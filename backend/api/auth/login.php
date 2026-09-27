<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';

$input = $_POST;
if (empty($input)) {
    $input = getJsonInput();
}
$identifier = trim($input['identifier'] ?? $input['email'] ?? $input['phone'] ?? $input['registration_id'] ?? '');
$password = trim($input['password'] ?? '');
$otp = trim($input['otp'] ?? '');
$role = trim($input['role'] ?? ''); // optional requested role

$pdo = getDbConnection();

// Scenario 1: Demo OTP Login (1234)
if ($otp === '1234') {
    // If phone or registration ID matches existing user
    $stmt = $pdo->prepare("
        SELECT 
            u.id, u.registration_id, u.role, u.full_name, u.name, u.email, u.phone, 
            u.role_id, COALESCE(r.slug, UPPER(u.role)) as role_slug, u.status, 
            u.profile_photo, u.avatar
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.id
        WHERE u.phone = ? OR u.phone LIKE ? OR u.registration_id = ?
    ");
    $stmt->execute([$identifier, "%$identifier%", $identifier]);
    $user = $stmt->fetch();

    if (!$user) {
        // Find default user based on role or fallback to worker
        $targetRole = strtoupper($role) === 'HOMEOWNER' ? 'HOMEOWNER' : (strtoupper($role) === 'CONTRACTOR' ? 'CONTRACTOR' : (strtoupper($role) === 'EMPLOYEE' ? 'EMPLOYEE' : 'WORKER'));
        $stmt = $pdo->prepare("
            SELECT 
                u.id, u.registration_id, u.role, u.full_name, u.name, u.email, u.phone, 
                u.role_id, COALESCE(r.slug, UPPER(u.role)) as role_slug, u.status, 
                u.profile_photo, u.avatar
            FROM users u
            LEFT JOIN roles r ON u.role_id = r.id
            WHERE r.slug = ? OR UPPER(u.role) = ?
            LIMIT 1
        ");
        $stmt->execute([$targetRole, $targetRole]);
        $user = $stmt->fetch();
    }

    if ($user) {
        // If worker, fetch profession
        $professionSlug = null;
        if (strtolower($user['role']) === 'worker' || $user['role_slug'] === 'WORKER') {
            $stmt = $pdo->prepare("
                SELECT COALESCE(p.slug, wp.profession) as profession_slug
                FROM worker_profiles wp
                LEFT JOIN professions p ON wp.profession_id = p.id
                WHERE wp.user_id = ?
            ");
            $stmt->execute([$user['id']]);
            $prof = $stmt->fetch();
            $professionSlug = $prof['profession_slug'] ?? 'mason';
        }

        $token = base64_encode($user['id'] . ':' . ($user['role_id'] ?? 2) . ':' . time());
        sendJsonResponse([
            'success' => true,
            'message' => 'Signed in successfully via OTP',
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'registration_id' => $user['registration_id'],
                'name' => $user['full_name'] ?: $user['name'],
                'full_name' => $user['full_name'] ?: $user['name'],
                'email' => $user['email'],
                'phone' => $user['phone'],
                'role' => $user['role_slug'] ?: strtoupper($user['role']),
                'role_normalized' => strtolower($user['role']),
                'profile_photo' => $user['profile_photo'],
                'avatar' => $user['profile_photo'] ?: $user['avatar'],
                'profession_slug' => $professionSlug
            ]
        ]);
    }
}

// Scenario 2: Registration ID / Email / Phone + Password Login
if (empty($identifier) || empty($password)) {
    sendJsonResponse([
        'success' => false,
        'message' => 'Please provide registration ID / phone / email and password (or OTP: 1234)'
    ], 400);
}

$stmt = $pdo->prepare("
    SELECT 
        u.id, u.registration_id, u.role, u.full_name, u.name, u.email, u.phone, 
        u.password_hash, u.role_id, COALESCE(r.slug, UPPER(u.role)) as role_slug, 
        u.status, u.profile_photo, u.avatar
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
    WHERE (u.registration_id = ? OR u.email = ? OR u.phone = ?) AND u.status = 'active'
");
$stmt->execute([$identifier, $identifier, $identifier]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password_hash'])) {
    // Check if standard demo fallback
    if ($password === 'Admin@123' && $user && ($user['email'] === 'admin@nirmaan.local' || strpos($user['email'], '@nirmaan.local') !== false)) {
        // Allow pass for pre-seeded demo accounts
    } else {
        sendJsonResponse([
            'success' => false,
            'message' => 'Invalid credentials. Please verify your Registration ID / Phone / Email and password.'
        ], 401);
    }
}

$professionSlug = null;
if (strtolower($user['role']) === 'worker' || $user['role_slug'] === 'WORKER') {
    $stmt = $pdo->prepare("
        SELECT COALESCE(p.slug, wp.profession) as profession_slug
        FROM worker_profiles wp
        LEFT JOIN professions p ON wp.profession_id = p.id
        WHERE wp.user_id = ?
    ");
    $stmt->execute([$user['id']]);
    $prof = $stmt->fetch();
    $professionSlug = $prof['profession_slug'] ?? 'mason';
}

$token = base64_encode($user['id'] . ':' . ($user['role_id'] ?? 2) . ':' . time());
sendJsonResponse([
    'success' => true,
    'message' => 'Signed in successfully',
    'token' => $token,
    'user' => [
        'id' => $user['id'],
        'registration_id' => $user['registration_id'],
        'name' => $user['full_name'] ?: $user['name'],
        'full_name' => $user['full_name'] ?: $user['name'],
        'email' => $user['email'],
        'phone' => $user['phone'],
        'role' => $user['role_slug'] ?: strtoupper($user['role']),
        'role_normalized' => strtolower($user['role']),
        'profile_photo' => $user['profile_photo'],
        'avatar' => $user['profile_photo'] ?: $user['avatar'],
        'profession_slug' => $professionSlug
    ]
]);
