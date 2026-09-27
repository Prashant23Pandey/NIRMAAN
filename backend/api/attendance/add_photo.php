<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';

$input = getJsonInput();
$projectId = intval($input['project_id'] ?? 1);
$workerProfileId = intval($input['worker_profile_id'] ?? 1);
$imageUrl = trim($input['image_url'] ?? 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80');
$title = trim($input['title'] ?? 'Site Progress Photo Proof');
$notes = trim($input['notes'] ?? 'Uploaded by artisan from site with verified GPS location');

$pdo = getDbConnection();

try {
    $stmt = $pdo->prepare("
        INSERT INTO work_evidence (project_id, worker_profile_id, image_url, title, notes, verified, date, timestamp_str)
        VALUES (?, ?, ?, ?, ?, 1, 'Today', DATE_FORMAT(NOW(), '%h:%i %p'))
    ");
    $stmt->execute([$projectId, $workerProfileId, $imageUrl, $title, $notes]);

    sendJsonResponse([
        'success' => true,
        'message' => 'Site evidence photo added and certified on Nirmaan Work Passport ledger',
        'evidence_id' => $pdo->lastInsertId()
    ]);
} catch (Exception $e) {
    sendJsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
}
