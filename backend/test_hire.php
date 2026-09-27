<?php
$ch = curl_init('http://localhost/nirmaan/backend/api/workers/hire.php');
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'worker_profile_id' => 7, // Mason (Vanshika Varshney, user 13)
    'project_id' => 2,        // Floor Construction (client 8)
    'client_user_id' => 8
]));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$res = curl_exec($ch);
echo "Response from hire.php:\n";
echo $res . "\n";
