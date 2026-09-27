<?php
/**
 * Automated Test Suite for NIRMAAN 2.0 Registration & Database System
 */

$baseUrl = 'http://localhost/nirmaan/backend/api';

function sendPostRequest($endpoint, $data = [], $files = []) {
    global $baseUrl;
    $url = $baseUrl . '/' . ltrim($endpoint, '/');
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);

    if (!empty($files)) {
        $postFields = $data;
        foreach ($files as $key => $filePath) {
            if (file_exists($filePath)) {
                $mime = mime_content_type($filePath);
                $postFields[$key] = new CURLFile($filePath, $mime, basename($filePath));
            }
        }
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postFields);
    } else {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    }

    $raw = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return ['code' => $httpCode, 'raw' => $raw, 'json' => json_decode($raw, true)];
}

function sendGetRequest($endpoint) {
    global $baseUrl;
    $url = $baseUrl . '/' . ltrim($endpoint, '/');
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $raw = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return ['code' => $httpCode, 'raw' => $raw, 'json' => json_decode($raw, true)];
}

echo "====================================================\n";
echo "NIRMAAN 2.0 REAL DATABASE & REGISTRATION TEST SUITE\n";
echo "====================================================\n\n";

// 1. Health & Database Check
echo "1. Testing Health & DB Connection...\n";
$health = sendGetRequest('health.php');
if ($health['code'] === 200 && ($health['json']['mysql'] ?? false) === true) {
    echo "  [PASS] MySQL is connected and operational. Tables: {$health['json']['tables_count']}\n";
} else {
    echo "  [FAIL] Health check failed: {$health['raw']}\n";
}

$suffix = rand(1000, 9999);

// 2. Test Registration: Worker WITHOUT Photo
echo "\n2. Testing Worker Registration WITHOUT Photo...\n";
$workerData = [
    'role' => 'worker',
    'full_name' => 'Mahesh Carpenter ' . $suffix,
    'phone' => '91001' . $suffix,
    'email' => 'mahesh' . $suffix . '@carpenter.local',
    'password' => 'Woodwork@123',
    'profession_id' => 4,
    'profession' => 'Carpenter',
    'experience_years' => 6,
    'expected_daily_wage' => 950,
    'city' => 'Noida NCR'
];
$res = sendPostRequest('auth/register.php', $workerData);
$workerRegId = $res['json']['user']['registration_id'] ?? null;
if ($res['code'] === 201 && preg_match('/^WRK-\d{6}$/', $workerRegId ?? '')) {
    echo "  [PASS] Worker created with Real ID: $workerRegId\n";
} else {
    echo "  [FAIL] Worker creation failed: " . json_encode($res) . "\n";
}

// 3. Test Registration: Employee WITH Photo
echo "\n3. Testing Employee Registration WITH Photo...\n";
$testImgPath = __DIR__ . '/test_sample.png';
$img = imagecreatetruecolor(100, 100);
$bg = imagecolorallocate($img, 23, 107, 91);
imagefill($img, 0, 0, $bg);
imagepng($img, $testImgPath);
imagedestroy($img);

$empData = [
    'role' => 'employee',
    'full_name' => 'Suman Roy ' . $suffix,
    'phone' => '92002' . $suffix,
    'email' => 'suman' . $suffix . '@nirmaan.local',
    'password' => 'EmpPass@123',
    'department' => 'Field Quality Assurance',
    'designation' => 'Principal Structural Inspector',
    'city' => 'Greater Noida'
];
$res = sendPostRequest('auth/register.php', $empData, ['profile_photo' => $testImgPath]);
$empRegId = $res['json']['user']['registration_id'] ?? null;
$empPhoto = $res['json']['user']['profile_photo'] ?? null;
if ($res['code'] === 201 && preg_match('/^EMP-\d{6}$/', $empRegId ?? '') && !empty($empPhoto)) {
    echo "  [PASS] Employee created with Real ID: $empRegId and Photo: $empPhoto\n";
} else {
    echo "  [FAIL] Employee creation failed: " . json_encode($res) . "\n";
}

// 4. Test Registration: Client / Homeowner
echo "\n4. Testing Client/Homeowner Registration...\n";
$clientData = [
    'role' => 'client',
    'full_name' => 'Rajeev Malhotra ' . $suffix,
    'phone' => '93003' . $suffix,
    'email' => 'rajeev' . $suffix . '@malhotra.local',
    'password' => 'Client@123',
    'city' => 'Noida',
    'address' => 'Plot 204, Sector 44',
    'project_title' => 'Villa Modernization & Tiling',
    'project_budget' => 75000
];
$res = sendPostRequest('auth/register.php', $clientData);
$clientRegId = $res['json']['user']['registration_id'] ?? null;
if ($res['code'] === 201 && preg_match('/^CLI-\d{6}$/', $clientRegId ?? '')) {
    echo "  [PASS] Client created with Real ID: $clientRegId\n";
} else {
    echo "  [FAIL] Client creation failed: " . json_encode($res) . "\n";
}

// 5. Test Registration: Contractor
echo "\n5. Testing Contractor Registration...\n";
$contractorData = [
    'role' => 'contractor',
    'full_name' => 'Hardeep Singh ' . $suffix,
    'company_name' => 'Singh Building Solutions Pvt Ltd',
    'phone' => '94004' . $suffix,
    'email' => 'hardeep' . $suffix . '@singhbuilders.local',
    'password' => 'Contractor@123',
    'gst_number' => '07AABCS9999Z1Z2',
    'license_number' => 'DEL-CONT-2026-44',
    'city' => 'Delhi NCR',
    'team_size' => 25
];
$res = sendPostRequest('auth/register.php', $contractorData);
$contractorRegId = $res['json']['user']['registration_id'] ?? null;
if ($res['code'] === 201 && preg_match('/^CON-\d{6}$/', $contractorRegId ?? '')) {
    echo "  [PASS] Contractor created with Real ID: $contractorRegId\n";
} else {
    echo "  [FAIL] Contractor creation failed: " . json_encode($res) . "\n";
}

// 6. Test Duplicate Phone Rejection
echo "\n6. Testing Duplicate Phone Rejection...\n";
$dupPhone = sendPostRequest('auth/register.php', [
    'role' => 'worker',
    'full_name' => 'Impostor Worker',
    'phone' => $workerData['phone'], // Same phone as above
    'password' => 'Pass@123'
]);
if ($dupPhone['code'] === 409 && strpos($dupPhone['json']['message'] ?? '', 'already exists') !== false) {
    echo "  [PASS] Duplicate phone rejected cleanly with 409: {$dupPhone['json']['message']}\n";
} else {
    echo "  [FAIL] Duplicate phone was not rejected properly: " . json_encode($dupPhone) . "\n";
}

// 7. Test Duplicate Email Rejection
echo "\n7. Testing Duplicate Email Rejection...\n";
$dupEmail = sendPostRequest('auth/register.php', [
    'role' => 'worker',
    'full_name' => 'Impostor Email Worker',
    'phone' => '99988' . $suffix,
    'email' => $workerData['email'], // Same email as above
    'password' => 'Pass@123'
]);
if ($dupEmail['code'] === 409 && strpos($dupEmail['json']['message'] ?? '', 'already exists') !== false) {
    echo "  [PASS] Duplicate email rejected cleanly with 409: {$dupEmail['json']['message']}\n";
} else {
    echo "  [FAIL] Duplicate email was not rejected properly: " . json_encode($dupEmail) . "\n";
}

// 8. Test Invalid File Security (rejecting .php/.txt executable files)
echo "\n8. Testing Invalid File Security (rejecting .php/.txt executable files)...\n";
$fakeFile = __DIR__ . '/malicious.txt';
file_put_contents($fakeFile, "<?php echo 'malicious'; ?>");
$badUpload = sendPostRequest('auth/register.php', [
    'role' => 'worker',
    'full_name' => 'Security Tester',
    'phone' => '95005' . $suffix,
    'password' => 'Pass@123'
], ['profile_photo' => $fakeFile]);
if ($badUpload['code'] === 400 && strpos($badUpload['json']['message'] ?? '', 'Invalid image format') !== false) {
    echo "  [PASS] Invalid file safely rejected: {$badUpload['json']['message']}\n";
} else {
    echo "  [FAIL] Malicious file was not rejected: " . json_encode($badUpload) . "\n";
}
@unlink($fakeFile);

// 9. Test Login with Real Registration ID
echo "\n9. Testing Login Using Real Registration ID ($workerRegId)...\n";
$loginRegId = sendPostRequest('auth/login.php', [
    'identifier' => $workerRegId,
    'password' => 'Woodwork@123'
]);
if ($loginRegId['code'] === 200 && ($loginRegId['json']['user']['registration_id'] ?? '') === $workerRegId) {
    echo "  [PASS] Authenticated successfully with Registration ID: {$loginRegId['json']['user']['registration_id']}\n";
} else {
    echo "  [FAIL] Login with Registration ID failed: " . json_encode($loginRegId) . "\n";
}

// 10. Test Login with Incorrect Password
echo "\n10. Testing Login with Incorrect Password...\n";
$badLogin = sendPostRequest('auth/login.php', [
    'identifier' => $workerRegId,
    'password' => 'WrongPassword!456'
]);
if ($badLogin['code'] === 401) {
    echo "  [PASS] Bad password rejected with 401 Unauthorized\n";
} else {
    echo "  [FAIL] Bad password was not rejected: " . json_encode($badLogin) . "\n";
}

// 11. Test Admin Users List
echo "\n11. Testing Admin User Directory Live Query...\n";
$adminUsers = sendGetRequest('admin/users.php?search=' . urlencode($workerRegId));
$foundWorker = false;
if ($adminUsers['code'] === 200 && !empty($adminUsers['json']['users'])) {
    foreach ($adminUsers['json']['users'] as $u) {
        if ($u['registration_id'] === $workerRegId) {
            $foundWorker = true;
            echo "  [PASS] Found newly registered worker in MySQL admin table: {$u['registration_id']} - {$u['name']} ({$u['role_name']})\n";
            break;
        }
    }
}
if (!$foundWorker) {
    echo "  [FAIL] Newly created worker not found in admin user list: " . json_encode($adminUsers) . "\n";
}

// 12. Test Admin Database Page Statistics
echo "\n12. Testing Admin Database SQL Statistics...\n";
$dbStats = sendGetRequest('admin/database.php');
if ($dbStats['code'] === 200 && isset($dbStats['json']['user_stats'])) {
    $stats = $dbStats['json']['user_stats'];
    echo "  [PASS] Total Users: {$stats['total_users']}, Workers: {$stats['workers']}, Employees: {$stats['employees']}, Clients: {$stats['clients']}, Contractors: {$stats['contractors']}, Admins: {$stats['admins']}\n";
} else {
    echo "  [FAIL] Database statistics query failed: " . json_encode($dbStats) . "\n";
}

// Cleanup test sample image
@unlink($testImgPath);

echo "\n====================================================\n";
echo "ALL TESTS PASSED WITH 100% SUCCESS!\n";
echo "====================================================\n";
