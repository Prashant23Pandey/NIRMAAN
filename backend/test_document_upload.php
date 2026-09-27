<?php
/**
 * Test Document / KYC Data Upload and Database Storage
 */

$testDocPath = __DIR__ . '/test_sample_aadhaar.png';
// Create a small 1x1 png image file as sample document
$sampleImg = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
file_put_contents($testDocPath, $sampleImg);

$uniq = rand(1000, 9999);
$ch = curl_init('http://127.0.0.1/nirmaan/backend/api/auth/register.php');

$postFields = [
    'role' => 'worker',
    'full_name' => "Kailash Verma $uniq",
    'phone' => "98877$uniq",
    'email' => "kailash$uniq@artisan.local",
    'password' => 'Password123!',
    'profession_id' => '1',
    'profession' => 'Mason',
    'years_experience' => '6',
    'expected_daily_wage' => '950',
    'city' => 'Greater Noida',
    'document_type' => 'Aadhaar Card',
    'document_number' => "5482 9912 $uniq",
    'document_file' => new CURLFile($testDocPath, 'image/png', 'aadhaar_card.png')
];

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $postFields);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Code: $httpCode\n";
echo "Response: $response\n\n";

$json = json_decode($response, true);
if (!$json || empty($json['success'])) {
    echo "FAILED: Registration with document failed.\n";
    exit(1);
}

$userId = $json['user']['id'];
$regId = $json['user']['registration_id'];
$docUrl = $json['user']['document_url'];

echo "User registered successfully with Real ID: $regId\n";
echo "Document URL: $docUrl\n";

// Verify file on disk
$fullFilePath = __DIR__ . '/' . $docUrl;
if (!file_exists($fullFilePath)) {
    echo "ERROR: Uploaded document file does not exist on disk at $fullFilePath\n";
    exit(1);
}
echo "Document file verified on disk: $fullFilePath\n";

// Verify Database Storage in MySQL
require_once __DIR__ . '/config/database.php';
$db = getDB();

// 1. Check worker_profiles
$wp = $db->query("SELECT * FROM worker_profiles WHERE user_id = $userId")->fetch(PDO::FETCH_ASSOC);
echo "worker_profiles DB check:\n";
echo " - document_type: " . $wp['document_type'] . "\n";
echo " - document_number: " . $wp['document_number'] . "\n";
echo " - document_url: " . $wp['document_url'] . "\n";

if ($wp['document_url'] !== $docUrl) {
    echo "ERROR: worker_profiles document_url does not match!\n";
    exit(1);
}

// 2. Check documents table
$doc = $db->query("SELECT * FROM documents WHERE user_id = $userId")->fetch(PDO::FETCH_ASSOC);
echo "\ndocuments table DB check:\n";
echo " - id: " . $doc['id'] . "\n";
echo " - document_type: " . $doc['document_type'] . "\n";
echo " - document_number: " . $doc['document_number'] . "\n";
echo " - file_url: " . $doc['file_url'] . "\n";

if (!$doc || $doc['file_url'] !== $docUrl) {
    echo "ERROR: documents table record not found or file_url mismatch!\n";
    exit(1);
}

// 3. Check verification_requests table
$workerProfileId = $wp['id'];
$vr = $db->query("SELECT * FROM verification_requests WHERE worker_profile_id = $workerProfileId")->fetch(PDO::FETCH_ASSOC);
echo "\nverification_requests table DB check:\n";
echo " - id: " . $vr['id'] . "\n";
echo " - status: " . $vr['status'] . "\n";
echo " - document_type: " . $vr['document_type'] . "\n";
echo " - document_url: " . $vr['document_url'] . "\n";

if (!$vr || $vr['document_url'] !== $docUrl) {
    echo "ERROR: verification_requests record not found or document_url mismatch!\n";
    exit(1);
}

// Clean up sample source file
@unlink($testDocPath);

echo "\n============================================\n";
echo "ALL TESTS PASSED: Document successfully uploaded and stored in database!\n";
echo "============================================\n";
