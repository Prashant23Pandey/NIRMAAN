<?php
/**
 * NIRMAAN 2.0 — Unified Real Database Registration API
 * POST /api/auth/register.php
 * Supports multipart/form-data with optional profile photo & application/json
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';

// Accept both multipart/form-data ($_POST) and application/json
$input = $_POST;
if (empty($input)) {
    $input = getJsonInput();
}

$roleInput = strtolower(trim($input['role'] ?? 'worker'));
// Normalize homeowner to client
$role = ($roleInput === 'homeowner') ? 'client' : $roleInput;

$validRoles = ['worker', 'employee', 'client', 'contractor', 'admin'];
if (!in_array($role, $validRoles, true)) {
    sendJsonResponse([
        'success' => false,
        'message' => "Invalid account role: '$roleInput'. Must be worker, employee, client/homeowner, or contractor."
    ], 400);
}

$fullName = trim($input['full_name'] ?? $input['name'] ?? '');
$phone = preg_replace('/[^\d+]/', '', trim($input['phone'] ?? ''));
$email = trim($input['email'] ?? '');
$password = trim($input['password'] ?? '');

// Validation
if (empty($fullName)) {
    sendJsonResponse([
        'success' => false,
        'message' => 'Please provide your full name.'
    ], 400);
}

if (empty($phone) || strlen($phone) < 8) {
    sendJsonResponse([
        'success' => false,
        'message' => 'Please provide a valid phone number.'
    ], 400);
}

if (empty($password)) {
    $password = 'Nirmaan@123';
} else if (strlen($password) < 6) {
    sendJsonResponse([
        'success' => false,
        'message' => 'Password must be at least 6 characters long.'
    ], 400);
}

if (!empty($email) && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendJsonResponse([
        'success' => false,
        'message' => 'Please provide a valid email address.'
    ], 400);
}

$pdo = getDbConnection();

// Check duplicate phone
$stmt = $pdo->prepare("SELECT id FROM users WHERE phone = ?");
$stmt->execute([$phone]);
if ($stmt->fetch()) {
    sendJsonResponse([
        'success' => false,
        'message' => 'An account with this phone number already exists.'
    ], 409);
}

// Check duplicate email
if (!empty($email)) {
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        sendJsonResponse([
            'success' => false,
            'message' => 'An account with this email address already exists.'
        ], 409);
    }
}

// Map role to prefix & role_id
$roleConfig = [
    'worker' => ['prefix' => 'WRK', 'role_id' => 2],
    'employee' => ['prefix' => 'EMP', 'role_id' => 5],
    'client' => ['prefix' => 'CLI', 'role_id' => 3],
    'contractor' => ['prefix' => 'CON', 'role_id' => 4],
    'admin' => ['prefix' => 'ADM', 'role_id' => 1],
];
$config = $roleConfig[$role];
$prefix = $config['prefix'];
$roleId = $config['role_id'];

// Generate sequential registration ID
$stmt = $pdo->prepare("
    SELECT registration_id 
    FROM users 
    WHERE registration_id LIKE ? 
    ORDER BY id DESC 
    LIMIT 100
");
$stmt->execute([$prefix . '-%']);
$existingIds = $stmt->fetchAll(PDO::FETCH_COLUMN);

$maxNum = 0;
foreach ($existingIds as $eid) {
    if (preg_match('/^' . $prefix . '-(\d+)$/', $eid, $matches)) {
        $num = intval($matches[1]);
        if ($num > $maxNum) {
            $maxNum = $num;
        }
    }
}
$nextNum = $maxNum + 1;
$registrationId = sprintf('%s-%06d', $prefix, $nextNum);

// Verify uniqueness
$stmtCheck = $pdo->prepare("SELECT id FROM users WHERE registration_id = ?");
$stmtCheck->execute([$registrationId]);
while ($stmtCheck->fetch()) {
    $nextNum++;
    $registrationId = sprintf('%s-%06d', $prefix, $nextNum);
    $stmtCheck->execute([$registrationId]);
}

// Securely hash password
$passwordHash = password_hash($password, PASSWORD_BCRYPT);

// Handle optional profile picture upload
$photoPath = null;
if (isset($_FILES['profile_photo']) && $_FILES['profile_photo']['error'] !== UPLOAD_ERR_NO_FILE) {
    $file = $_FILES['profile_photo'];

    if ($file['error'] !== UPLOAD_ERR_OK) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Profile picture upload failed with system code: ' . $file['error']
        ], 400);
    }

    // Maximum size: 5 MB
    $maxBytes = 5 * 1024 * 1024;
    if ($file['size'] > $maxBytes) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Profile picture exceeds the maximum allowed size of 5 MB.'
        ], 400);
    }

    // Validate extension
    $origName = $file['name'] ?? '';
    $ext = strtolower(pathinfo($origName, PATHINFO_EXTENSION));
    $allowedExts = ['jpg', 'jpeg', 'png', 'webp'];
    if (!in_array($ext, $allowedExts, true)) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Invalid image format. Allowed formats: JPG, JPEG, PNG, WEBP.'
        ], 400);
    }

    // Validate MIME type with finfo
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);

    $allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!in_array($mimeType, $allowedMimes, true)) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Security check rejected file. Only JPG, JPEG, PNG, or WEBP images are permitted.'
        ], 400);
    }

    // Storage destination
    $uploadDir = __DIR__ . '/../../uploads/profile_photos/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $safeName = preg_replace('/[^a-zA-Z0-9_\-]/', '', $registrationId) . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
    $destination = $uploadDir . $safeName;

    if (!move_uploaded_file($file['tmp_name'], $destination)) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Could not save profile picture to server directory.'
        ], 500);
    }

    $photoPath = 'uploads/profile_photos/' . $safeName;
}

// Optional Document / KYC File Upload Handling
$documentPath = null;
$documentField = isset($_FILES['document_file']) ? 'document_file' : (isset($_FILES['document']) ? 'document' : (isset($_FILES['kyc_file']) ? 'kyc_file' : null));

if ($documentField && isset($_FILES[$documentField]) && $_FILES[$documentField]['error'] !== UPLOAD_ERR_NO_FILE) {
    $docFile = $_FILES[$documentField];

    if ($docFile['error'] !== UPLOAD_ERR_OK) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Document upload failed with system code: ' . $docFile['error']
        ], 400);
    }

    // Maximum size: 5 MB
    $maxBytes = 5 * 1024 * 1024;
    if ($docFile['size'] > $maxBytes) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Document file exceeds the maximum allowed size of 5 MB.'
        ], 400);
    }

    // Validate extension
    $origDocName = $docFile['name'] ?? '';
    $docExt = strtolower(pathinfo($origDocName, PATHINFO_EXTENSION));
    $allowedDocExts = ['jpg', 'jpeg', 'png', 'webp', 'pdf'];
    if (!in_array($docExt, $allowedDocExts, true)) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Invalid document format. Allowed formats: JPG, JPEG, PNG, WEBP, PDF.'
        ], 400);
    }

    // Validate MIME type with finfo
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $docMimeType = finfo_file($finfo, $docFile['tmp_name']);
    finfo_close($finfo);

    $allowedDocMimes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!in_array($docMimeType, $allowedDocMimes, true)) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Security check rejected document file. Only JPG, JPEG, PNG, WEBP images or PDF files are permitted.'
        ], 400);
    }

    // Storage destination
    $docUploadDir = __DIR__ . '/../../uploads/documents/';
    if (!is_dir($docUploadDir)) {
        mkdir($docUploadDir, 0777, true);
    }

    $safeDocName = 'DOC_' . preg_replace('/[^a-zA-Z0-9_\-]/', '', $registrationId) . '_' . bin2hex(random_bytes(4)) . '.' . $docExt;
    $docDestination = $docUploadDir . $safeDocName;

    if (!move_uploaded_file($docFile['tmp_name'], $docDestination)) {
        sendJsonResponse([
            'success' => false,
            'message' => 'Could not save document file to server directory.'
        ], 500);
    }

    $documentPath = 'uploads/documents/' . $safeDocName;
}

// Fallback avatar if no photo uploaded
$avatarFallback = $photoPath ?: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80';

// City and State defaults
$city = trim($input['city'] ?? 'Noida');
$state = trim($input['state'] ?? 'Uttar Pradesh');
$address = trim($input['address'] ?? '');

// Database Transaction
try {
    $pdo->beginTransaction();

    // 1. Insert User
    $stmt = $pdo->prepare("
        INSERT INTO users (
            registration_id, role, role_id, full_name, name, email, phone,
            password_hash, profile_photo, avatar, status
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, 'active'
        )
    ");
    $stmt->execute([
        $registrationId,
        $role,
        $roleId,
        $fullName,
        $fullName,
        $email ?: null,
        $phone,
        $passwordHash,
        $photoPath,
        $avatarFallback
    ]);
    $userId = (int)$pdo->lastInsertId();

    $extraUserData = [];

    // 2. Role-specific profile table insertion
    if ($role === 'worker') {
        $professionId = intval($input['profession_id'] ?? 1);
        $professionName = trim($input['profession'] ?? '');
        $experienceYears = intval($input['years_experience'] ?? $input['experience_years'] ?? 5);
        $dailyRate = floatval($input['expected_daily_wage'] ?? $input['daily_rate'] ?? 800.00);
        $bio = trim($input['bio'] ?? "Registered Artisan with Nirmaan Work Passport.");

        // If profession name empty, fetch from professions table
        if (empty($professionName) && $professionId > 0) {
            $pStmt = $pdo->prepare("SELECT name, slug FROM professions WHERE id = ?");
            $pStmt->execute([$professionId]);
            $pRow = $pStmt->fetch();
            if ($pRow) {
                $professionName = $pRow['name'];
                $extraUserData['profession_slug'] = $pRow['slug'];
            }
        }
        if (empty($extraUserData['profession_slug'])) {
            $extraUserData['profession_slug'] = strtolower(str_replace(' ', '-', $professionName ?: 'mason'));
        }

        // Skills serialization
        $skillsInput = $input['skills'] ?? $input['skill_ids'] ?? [];
        $skillsText = is_array($skillsInput) ? implode(', ', $skillsInput) : (string)$skillsInput;

        $documentType = trim($input['document_type'] ?? 'Aadhaar Card');
        $documentNumber = trim($input['document_number'] ?? '');

        $stmt = $pdo->prepare("
            INSERT INTO worker_profiles (
                user_id, profile_photo, profession_id, profession, nirmaan_id, level, 
                experience_years, years_experience, daily_rate, expected_daily_wage,
                skills, city, state, address, is_available, is_verified, verification_status, bio,
                rating, total_reviews, completed_jobs,
                document_type, document_number, document_url
            ) VALUES (
                ?, ?, ?, ?, ?, 'Level 1 Artisan',
                ?, ?, ?, ?,
                ?, ?, ?, ?, 1, 0, 'pending', ?,
                0.00, 0, 0,
                ?, ?, ?
            )
        ");
        $stmt->execute([
            $userId, $photoPath, $professionId ?: null, $professionName, $registrationId,
            $experienceYears, $experienceYears, $dailyRate, $dailyRate,
            $skillsText, $city, $state, $address, $bio,
            $documentType ?: null, $documentNumber ?: null, $documentPath ?: null
        ]);
        $workerProfileId = (int)$pdo->lastInsertId();

        // 2b. Store document record in `documents` table
        if (!empty($documentPath) || !empty($documentNumber)) {
            $docStmt = $pdo->prepare("
                INSERT INTO documents (
                    user_id, document_type, document_number, file_url, is_verified, verified_at, created_at
                ) VALUES (
                    ?, ?, ?, ?, 0, NULL, CURRENT_TIMESTAMP
                )
            ");
            $docStmt->execute([
                $userId,
                $documentType ?: 'Identity Document',
                $documentNumber ?: null,
                $documentPath ?: ''
            ]);
        }

        // 2c. Store verification request in `verification_requests` table
        $vrStmt = $pdo->prepare("
            INSERT INTO verification_requests (
                worker_profile_id, type, status, document_type, document_url, remarks
            ) VALUES (
                ?, 'identity', 'pending', ?, ?, 'KYC identity document uploaded during onboarding. Awaiting Super Admin verification.'
            )
        ");
        $vrStmt->execute([
            $workerProfileId,
            $documentType ?: 'Aadhaar Card',
            $documentPath ?: ''
        ]);

        // Save worker skills if array of IDs provided
        if (is_array($skillsInput) && count($skillsInput) > 0) {
            $wsStmt = $pdo->prepare("
                INSERT INTO worker_skills (worker_profile_id, skill_id, is_verified, proficiency_level)
                VALUES (?, ?, 0, 'Registered Craftsman')
            ");
            foreach ($skillsInput as $s) {
                if (is_numeric($s)) {
                    $wsStmt->execute([$workerProfileId, intval($s)]);
                }
            }
        }

        // Initialize Work Passport with zero scores for new worker
        $wpStmt = $pdo->prepare("
            INSERT INTO work_passports (
                worker_profile_id, qr_code_hash, quality_score, punctuality_score, 
                reliability_score, completion_score, client_payment_score, client_site_score, client_clarity_score
            ) VALUES (
                ?, ?, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00
            )
        ");
        $wpStmt->execute([$workerProfileId, 'NRM-PASSPORT-' . $registrationId . '-QR']);

        $extraUserData['profession'] = $professionName;
        $extraUserData['profession_name'] = $professionName;
        $extraUserData['trade'] = $professionName;
        $extraUserData['worker_profile_id'] = $workerProfileId;
        $extraUserData['profile_photo'] = $photoPath;
        $extraUserData['expected_daily_wage'] = $dailyRate;
        $extraUserData['daily_rate'] = $dailyRate;
        $extraUserData['years_experience'] = $experienceYears;
        $extraUserData['experience_years'] = $experienceYears;
        $extraUserData['level'] = 'Level 1 Artisan';
        $extraUserData['document_type'] = $documentType;
        $extraUserData['document_number'] = $documentNumber;
        $extraUserData['document_url'] = $documentPath;

    } else if ($role === 'employee') {
        $department = trim($input['department'] ?? 'Operations & Site Governance');
        $designation = trim($input['designation'] ?? 'Site Engineer');
        $employeeCode = trim($input['employee_code'] ?? $registrationId);
        $joiningDate = trim($input['joining_date'] ?? date('Y-m-d'));

        $stmt = $pdo->prepare("
            INSERT INTO employee_profiles (
                user_id, department, designation, employee_code, city, state, address, joining_date
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?
            )
        ");
        $stmt->execute([
            $userId, $department, $designation, $employeeCode, $city, $state, $address, $joiningDate
        ]);

        $extraUserData['department'] = $department;
        $extraUserData['designation'] = $designation;
        $extraUserData['employee_code'] = $employeeCode;

    } else if ($role === 'client') {
        $companyName = trim($input['company_name'] ?? '');
        $projectType = trim($input['project_type'] ?? $input['project_category'] ?? 'Residential Renovation');
        $projectTitle = trim($input['project_title'] ?? '');
        $projectBudget = floatval($input['project_budget'] ?? 50000.00);

        // Insert client_profiles
        $stmt = $pdo->prepare("
            INSERT INTO client_profiles (
                user_id, company_name, address, city, state, project_type
            ) VALUES (
                ?, ?, ?, ?, ?, ?
            )
        ");
        $stmt->execute([
            $userId, $companyName ?: null, $address, $city, $state, $projectType
        ]);

        // Insert homeowner_profiles for full legacy backwards-compatibility
        $stmt = $pdo->prepare("
            INSERT INTO homeowner_profiles (
                user_id, city, address, rating, total_projects
            ) VALUES (
                ?, ?, ?, 0.00, 0
            )
        ");
        $stmt->execute([$userId, $city, $address]);

        // Optional project initiation
        if (!empty($projectTitle)) {
            $pStmt = $pdo->prepare("
                INSERT INTO projects (
                    name, category, client_user_id, location, city, start_date, progress_percent, budget, spent, status, description
                ) VALUES (
                    ?, ?, ?, ?, ?, 'Next Week', 0, ?, 0.00, 'planning', 'Custom construction project initiated during client registration.'
                )
            ");
            $pStmt->execute([
                $projectTitle, $projectType, $userId, $address ?: $city, $city, $projectBudget
            ]);
        }

        $extraUserData['company_name'] = $companyName;
        $extraUserData['project_type'] = $projectType;

    } else if ($role === 'contractor') {
        $companyName = trim($input['company_name'] ?? $fullName . ' Construction');
        $licenseNumber = trim($input['license_number'] ?? '');
        $gstNumber = trim($input['gst_number'] ?? '');
        $specialization = trim($input['specialization'] ?? 'Civil & Commercial Infrastructure');
        $experienceYears = intval($input['experience_years'] ?? 10);

        $stmt = $pdo->prepare("
            INSERT INTO contractor_profiles (
                user_id, company_name, license_number, specialization, experience_years, 
                address, city, state, verification_status, document_url, gst_number, rating, total_projects
            ) VALUES (
                ?, ?, ?, ?, ?,
                ?, ?, ?, 'pending', ?, ?, 0.00, 0
            )
        ");
        $stmt->execute([
            $userId, $companyName, $licenseNumber ?: null, $specialization, $experienceYears,
            $address, $city, $state, $documentPath ?: null, $gstNumber ?: null
        ]);

        if (!empty($documentPath) || !empty($licenseNumber)) {
            $docStmt = $pdo->prepare("
                INSERT INTO documents (
                    user_id, document_type, document_number, file_url, is_verified, verified_at, created_at
                ) VALUES (
                    ?, 'Contractor License / GST', ?, ?, 0, NULL, CURRENT_TIMESTAMP
                )
            ");
            $docStmt->execute([
                $userId,
                $licenseNumber ?: $gstNumber ?: null,
                $documentPath ?: ''
            ]);
        }

        $extraUserData['company_name'] = $companyName;
        $extraUserData['specialization'] = $specialization;
        $extraUserData['document_url'] = $documentPath;
    }

    $pdo->commit();

    // Generate authenticated token
    $token = base64_encode($userId . ':' . $roleId . ':' . time());

    // Send successful response
    sendJsonResponse([
        'success' => true,
        'message' => 'Registration successful',
        'token' => $token,
        'user' => array_merge([
            'id' => $userId,
            'registration_id' => $registrationId,
            'role' => ($role === 'client') ? 'HOMEOWNER' : strtoupper($role),
            'role_normalized' => $role,
            'full_name' => $fullName,
            'name' => $fullName,
            'email' => $email,
            'phone' => $phone,
            'profile_photo' => $photoPath,
            'document_url' => $documentPath,
            'avatar' => $avatarFallback,
            'city' => $city,
            'status' => 'active',
            'created_at' => date('Y-m-d H:i:s')
        ], $extraUserData)
    ], 201);

} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    // Clean up uploaded files if transaction failed
    if ($photoPath && file_exists(__DIR__ . '/../../' . $photoPath)) {
        @unlink(__DIR__ . '/../../' . $photoPath);
    }
    if ($documentPath && file_exists(__DIR__ . '/../../' . $documentPath)) {
        @unlink(__DIR__ . '/../../' . $documentPath);
    }

    sendJsonResponse([
        'success' => false,
        'message' => 'Registration could not be completed. Please try again. (' . $e->getMessage() . ')'
    ], 500);
}
