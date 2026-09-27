<?php
/**
 * NIRMAAN 2.0 — User Notifications API
 * GET /api/notifications/list.php
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../middleware/auth.php';

$pdo = getDbConnection();
$authUser = getAuthUser();

$userId = 0;
if ($authUser) {
    $userId = (int)$authUser['id'];
} else if (!empty($_GET['user_id'])) {
    $userId = intval($_GET['user_id']);
} else if (!empty($_GET['worker_profile_id'])) {
    $wpStmt = $pdo->prepare("SELECT user_id FROM worker_profiles WHERE id = ?");
    $wpStmt->execute([intval($_GET['worker_profile_id'])]);
    $userId = (int)($wpStmt->fetchColumn() ?: 0);
}

$role = strtolower($_GET['role'] ?? ($authUser['role'] ?? ''));

if ($userId > 0) {
    $stmt = $pdo->prepare("
        SELECT * 
        FROM notifications 
        WHERE user_id = ? 
        ORDER BY created_at DESC 
        LIMIT 30
    ");
    $stmt->execute([$userId]);
    $notifications = $stmt->fetchAll();

    $unreadStmt = $pdo->prepare("SELECT COUNT(*) as unread_count FROM notifications WHERE user_id = ? AND is_read = 0");
    $unreadStmt->execute([$userId]);
    $unreadCount = (int)($unreadStmt->fetch()['unread_count'] ?? 0);
} else if ($role === 'worker') {
    // Notifications for worker users
    $stmt = $pdo->query("
        SELECT n.* 
        FROM notifications n
        JOIN users u ON n.user_id = u.id
        WHERE u.role = 'worker' OR n.type IN ('job', 'application')
        ORDER BY n.created_at DESC 
        LIMIT 30
    ");
    $notifications = $stmt->fetchAll();
    $unreadCount = count(array_filter($notifications, fn($n) => empty($n['is_read'])));
} else if ($role === 'homeowner' || $role === 'client') {
    // Notifications for homeowner users
    $stmt = $pdo->query("
        SELECT n.* 
        FROM notifications n
        JOIN users u ON n.user_id = u.id
        WHERE u.role IN ('client', 'homeowner') OR n.type IN ('hire', 'job_application', 'milestone')
        ORDER BY n.created_at DESC 
        LIMIT 30
    ");
    $notifications = $stmt->fetchAll();
    $unreadCount = count(array_filter($notifications, fn($n) => empty($n['is_read'])));
} else {
    // Return latest platform notifications
    $stmt = $pdo->query("
        SELECT * 
        FROM notifications 
        ORDER BY created_at DESC 
        LIMIT 30
    ");
    $notifications = $stmt->fetchAll();
    $unreadCount = count(array_filter($notifications, fn($n) => empty($n['is_read'])));
}

sendJsonResponse([
    'success' => true,
    'unread_count' => $unreadCount,
    'notifications' => $notifications ?: []
]);
