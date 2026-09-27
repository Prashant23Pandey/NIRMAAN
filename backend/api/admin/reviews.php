<?php
/**
 * NIRMAAN 2.0 — Admin Reviews Governance API
 * GET /api/admin/reviews.php — List all reviews from MySQL
 * POST /api/admin/reviews.php — Moderate review status
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';

$pdo = getDbConnection();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = getJsonInput();
    $reviewId = intval($input['review_id'] ?? 0);
    $status = trim($input['status'] ?? 'published');

    if ($reviewId <= 0 || !in_array($status, ['published', 'hidden', 'flagged'], true)) {
        sendJsonResponse(['success' => false, 'message' => 'Invalid parameters'], 400);
    }

    $stmt = $pdo->prepare("UPDATE reviews SET status = ? WHERE id = ?");
    $stmt->execute([$status, $reviewId]);

    sendJsonResponse([
        'success' => true,
        'message' => "Review #{$reviewId} status updated to {$status}"
    ]);
}

$stmt = $pdo->query("
    SELECT 
        r.id,
        r.project_id,
        p.name as project,
        u1.full_name as reviewer,
        u2.full_name as reviewee,
        IF(r.review_type = 'client_to_worker', 'Client to Artisan', 'Artisan to Client') as type,
        r.rating,
        r.comment,
        r.status,
        r.created_at
    FROM reviews r
    JOIN projects p ON r.project_id = p.id
    JOIN users u1 ON r.reviewer_user_id = u1.id
    JOIN users u2 ON r.reviewee_user_id = u2.id
    ORDER BY r.created_at DESC
");
$reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);

sendJsonResponse([
    'success' => true,
    'count' => count($reviews),
    'reviews' => $reviews
]);
