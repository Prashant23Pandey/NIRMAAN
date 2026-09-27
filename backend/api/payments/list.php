<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';

$pdo = getDbConnection();

$stmt = $pdo->query("
    SELECT 
        pay.*,
        p.name as project_name,
        payer.name as client_name,
        payee.name as worker_name,
        m.title as milestone_title
    FROM payments pay
    JOIN projects p ON pay.project_id = p.id
    JOIN users payer ON pay.payer_user_id = payer.id
    JOIN users payee ON pay.payee_user_id = payee.id
    LEFT JOIN milestones m ON pay.milestone_id = m.id
    ORDER BY pay.payment_date DESC
");
$payments = $stmt->fetchAll();

sendJsonResponse([
    'success' => true,
    'count' => count($payments),
    'payments' => $payments
]);
