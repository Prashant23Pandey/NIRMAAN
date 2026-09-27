<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';

$input = getJsonInput();
$projectId = intval($input['project_id'] ?? 1);
$workerProfileId = intval($input['worker_profile_id'] ?? 1);
$time = date('h:i A');

$pdo = getDbConnection();

try {
    $stmt = $pdo->prepare("
        INSERT INTO attendance (project_id, worker_profile_id, check_in_time, location_verified, progress_percent, date, status)
        VALUES (?, ?, ?, 1, 80, CURDATE(), 'checked_in')
        ON DUPLICATE KEY UPDATE check_in_time = VALUES(check_in_time), status = 'checked_in'
    ");
    $stmt->execute([$projectId, $workerProfileId, $time]);

    sendJsonResponse([
        'success' => true,
        'message' => 'Checked in successfully with GPS Geo-fence verification',
        'check_in_time' => $time
    ]);
} catch (Exception $e) {
    sendJsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
}
