<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../middleware/auth.php';

$pdo = getDbConnection();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = getJsonInput();
    $id = intval($input['emergency_id'] ?? 0);
    $status = $input['status'] ?? 'RESPONDED'; // OPEN, RESPONDED, RESOLVED

    $stmt = $pdo->prepare("UPDATE emergency_reports SET status = ?, resolved_at = IF(? = 'RESOLVED', NOW(), resolved_at) WHERE id = ?");
    $stmt->execute([$status, $status, $id]);

    sendJsonResponse(['success' => true, 'message' => "Emergency report updated to $status"]);
}

$stmt = $pdo->query("
    SELECT 
        er.*,
        u.name as reporter_name,
        u.phone as reporter_phone,
        p.name as project_name,
        prof.name as profession_name
    FROM emergency_reports er
    JOIN users u ON er.user_id = u.id
    LEFT JOIN projects p ON er.project_id = p.id
    LEFT JOIN worker_profiles wp ON er.worker_profile_id = wp.id
    LEFT JOIN professions prof ON wp.profession_id = prof.id
    ORDER BY er.reported_at DESC
");
$reports = $stmt->fetchAll();

sendJsonResponse([
    'success' => true,
    'count' => count($reports),
    'emergency_reports' => $reports
]);
