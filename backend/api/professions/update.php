<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../middleware/auth.php';

$user = requireAuth(['SUPER_ADMIN']);

$input = getJsonInput();
$id = intval($input['id'] ?? 0);
$name = trim($input['name'] ?? '');
$description = trim($input['description'] ?? '');
$status = trim($input['status'] ?? 'active');

if (!$id) {
    sendJsonResponse(['success' => false, 'error' => 'Profession ID is required'], 400);
}

$pdo = getDbConnection();

$stmt = $pdo->prepare("
    UPDATE professions 
    SET name = COALESCE(NULLIF(?, ''), name),
        description = COALESCE(NULLIF(?, ''), description),
        status = ?
    WHERE id = ?
");
$stmt->execute([$name, $description, $status, $id]);

$log = $pdo->prepare("INSERT INTO admin_logs (admin_user_id, action, target_type, target_id, details) VALUES (?, 'UPDATE_PROFESSION', 'PROFESSION', ?, ?)");
$log->execute([$user['id'], $id, "Updated profession status to $status"]);

sendJsonResponse([
    'success' => true,
    'message' => 'Profession updated successfully'
]);
