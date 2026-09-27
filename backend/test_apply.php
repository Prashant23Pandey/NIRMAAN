<?php
$ch = curl_init('http://localhost/nirmaan/backend/api/jobs/apply.php');
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'job_id' => 2,
    'worker_profile_id' => 5
]));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$res = curl_exec($ch);
echo "Response from apply.php:\n" . $res . "\n";
