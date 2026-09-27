<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../middleware/auth.php';

$pdo = getDbConnection();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = getJsonInput();
    $id = intval($input['dispute_id'] ?? 0);
    $status = $input['status'] ?? 'RESOLVED';
    $notes = trim($input['resolution_notes'] ?? '');

    $stmt = $pdo->prepare("UPDATE disputes SET status = ?, resolution_notes = ? WHERE id = ?");
    $stmt->execute([$status, $notes, $id]);

    sendJsonResponse(['success' => true, 'message' => "Dispute updated to $status"]);
}

$stmt = $pdo->query("
    SELECT 
        d.*,
        p.name as project_name,
        r.name as raised_by_name,
        r.phone as raised_by_phone,
        a.name as against_name,
        a.phone as against_phone
    FROM disputes d
    JOIN projects p ON d.project_id = p.id
    JOIN users r ON d.raised_by_user_id = r.id
    JOIN users a ON d.against_user_id = a.id
    ORDER BY d.created_at DESC
");
$disputes = $stmt->fetchAll();

sendJsonResponse([
    'success' => true,
    'count' => count($disputes),
    'disputes' => $disputes
]);
