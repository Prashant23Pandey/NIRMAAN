<?php
/**
 * NIRMAAN 2.0 — Reviews API
 * GET /api/reviews/list.php
 * Real reviews from MySQL reviews table
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';

$pdo = getDbConnection();

$workerId = isset($_GET['worker_id']) ? intval($_GET['worker_id']) : 0;
$projectId = isset($_GET['project_id']) ? intval($_GET['project_id']) : 0;

$sql = "
    SELECT 
        r.id,
        r.project_id,
        p.name as project_name,
        r.reviewer_user_id,
        u1.full_name as reviewer_name,
        r.reviewee_user_id,
        u2.full_name as reviewee_name,
        r.rating,
        r.comment,
        r.review_type,
        r.is_verified,
        r.status,
        r.created_at
    FROM reviews r
    JOIN projects p ON r.project_id = p.id
    JOIN users u1 ON r.reviewer_user_id = u1.id
    JOIN users u2 ON r.reviewee_user_id = u2.id
    WHERE 1=1
";
$params = [];

if ($workerId > 0) {
    // Reviewee or reviewer is this worker
    $sql .= " AND (r.reviewee_user_id = ? OR r.reviewer_user_id = ?)";
    $params[] = $workerId;
    $params[] = $workerId;
}

if ($projectId > 0) {
    $sql .= " AND r.project_id = ?";
    $params[] = $projectId;
}

$sql .= " ORDER BY r.created_at DESC";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);

sendJsonResponse([
    'success' => true,
    'count' => count($reviews),
    'reviews' => $reviews
]);
