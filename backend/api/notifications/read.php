<?php
/**
 * NIRMAAN 2.0 — Mark Notification Read API
 * POST /api/notifications/read.php
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../middleware/auth.php';

$pdo = getDbConnection();
$input = getJsonInput();
$notificationId = intval($input['notification_id'] ?? $input['id'] ?? 0);
$all = !empty($input['all']);
$userId = intval($input['user_id'] ?? 0);

$authUser = getAuthUser();
if ($authUser) {
    $userId = (int)$authUser['id'];
}

if ($all && $userId > 0) {
    $stmt = $pdo->prepare("UPDATE notifications SET is_read = 1 WHERE user_id = ?");
    $stmt->execute([$userId]);
    sendJsonResponse(['success' => true, 'message' => 'All notifications marked as read']);
}

if ($notificationId > 0) {
    $stmt = $pdo->prepare("UPDATE notifications SET is_read = 1 WHERE id = ?");
    $stmt->execute([$notificationId]);
    sendJsonResponse(['success' => true, 'message' => 'Notification marked as read']);
}

sendJsonResponse(['success' => false, 'error' => 'Notification ID or user ID required'], 400);
