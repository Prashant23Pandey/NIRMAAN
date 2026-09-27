<?php
/**
 * NIRMAAN 2.0 — Admin Audit Logs API
 * GET /api/admin/logs.php
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../middleware/auth.php';

requireRole(['SUPER_ADMIN']);

try {
    $db = getDbConnection();
    if ($db) {
        $stmt = $db->query("
            SELECT al.*, u.name as admin_name, u.email as admin_email
            FROM admin_logs al
            LEFT JOIN users u ON al.admin_id = u.id
            ORDER BY al.created_at DESC
            LIMIT 50
        ");
        $logs = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'logs' => $logs]);
        exit;
    }
} catch (Exception $e) {
    echo json_encode(['success' => true, 'logs' => []]);
    exit;
}

echo json_encode(['success' => true, 'logs' => []]);

