<?php
$ch = curl_init('http://localhost/nirmaan/backend/api/jobs/create.php');
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'title' => 'Test Flooring Job',
    'profession_id' => 6,
    'client_user_id' => 8,
    'budget' => 15000,
    'location' => 'Noida',
    'description' => 'Test flooring job description'
]));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$res = curl_exec($ch);
echo "Response from jobs/create.php:\n";
echo $res . "\n";
