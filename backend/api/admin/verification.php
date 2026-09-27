<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../middleware/auth.php';

$pdo = getDbConnection();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = getJsonInput();
    $id = intval($input['request_id'] ?? 0);
    $status = $input['status'] ?? 'approved'; // approved, rejected, needs_correction
    $remarks = trim($input['remarks'] ?? '');

    if (!$id) {
        sendJsonResponse(['success' => false, 'error' => 'Verification request ID is required'], 400);
    }

    $stmt = $pdo->prepare("
        UPDATE verification_requests 
        SET status = ?, remarks = ?, reviewed_at = CURRENT_TIMESTAMP 
        WHERE id = ?
    ");
    $stmt->execute([$status, $remarks, $id]);

    // If approved, verify worker
    if ($status === 'approved') {
        $stmt = $pdo->prepare("
            UPDATE worker_profiles wp
            JOIN verification_requests vr ON vr.worker_profile_id = wp.id
            SET wp.is_verified = 1
            WHERE vr.id = ?
        ");
        $stmt->execute([$id]);
    }

    sendJsonResponse(['success' => true, 'message' => "Verification updated to $status"]);
}

$type = $_GET['type'] ?? ''; // identity, skills, documents

$query = "
    SELECT 
        vr.*,
        u.name as worker_name,
        u.phone as worker_phone,
        u.avatar as worker_avatar,
        p.name as profession_name,
        wp.nirmaan_id,
        wp.level
    FROM verification_requests vr
    JOIN worker_profiles wp ON vr.worker_profile_id = wp.id
    JOIN users u ON wp.user_id = u.id
    JOIN professions p ON wp.profession_id = p.id
    WHERE 1=1
";

$params = [];
if ($type) {
    $query .= " AND vr.type = ?";
    $params[] = $type;
}

$query .= " ORDER BY vr.created_at DESC";

$stmt = $pdo->prepare($query);
$stmt->execute($params);
$requests = $stmt->fetchAll();

sendJsonResponse([
    'success' => true,
    'count' => count($requests),
    'verification_requests' => $requests
]);
