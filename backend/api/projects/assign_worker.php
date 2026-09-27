<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../middleware/auth.php';

$input = getJsonInput();
$projectId = intval($input['project_id'] ?? 1);
$workerProfileId = intval($input['worker_profile_id'] ?? $input['worker_id'] ?? 1);
$roleTrade = trim($input['role_trade'] ?? $input['trade'] ?? 'Mason');
$dailyWage = floatval($input['daily_wage'] ?? 850.00);

if (!$projectId || !$workerProfileId) {
    sendJsonResponse(['success' => false, 'error' => 'Project ID and Worker ID are required'], 400);
}

$pdo = getDbConnection();

try {
    // Check if worker already assigned
    $stmt = $pdo->prepare("SELECT id FROM project_workers WHERE project_id = ? AND worker_profile_id = ?");
    $stmt->execute([$projectId, $workerProfileId]);
    $existing = $stmt->fetch();

    if (!$existing) {
        $stmt = $pdo->prepare("
            INSERT INTO project_workers (project_id, worker_profile_id, role_trade, daily_wage, joined_at, status)
            VALUES (?, ?, ?, ?, NOW(), 'active')
        ");
        $stmt->execute([$projectId, $workerProfileId, $roleTrade, $dailyWage]);
    }

    sendJsonResponse([
        'success' => true,
        'message' => 'Worker assigned to project! Record persisted to MySQL project_workers.',
        'project_id' => $projectId,
        'worker_profile_id' => $workerProfileId,
        'role_trade' => $roleTrade
    ]);
} catch (Exception $e) {
    sendJsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
}
