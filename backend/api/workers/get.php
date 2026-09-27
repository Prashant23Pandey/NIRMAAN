<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';

$id = $_GET['id'] ?? '';
$nirmaanId = $_GET['nirmaan_id'] ?? '';

if (empty($id) && empty($nirmaanId)) {
    sendJsonResponse(['success' => false, 'error' => 'Worker ID or Nirmaan ID is required'], 400);
}

$pdo = getDbConnection();

$stmt = $pdo->prepare("
    SELECT 
        wp.*,
        u.name,
        u.email,
        u.phone,
        u.avatar as photo,
        p.name as profession_name,
        p.slug as profession_slug,
        p.icon as profession_icon,
        pass.quality_score,
        pass.punctuality_score,
        pass.reliability_score,
        pass.completion_score,
        pass.client_payment_score,
        pass.client_site_score,
        pass.client_clarity_score
    FROM worker_profiles wp
    JOIN users u ON wp.user_id = u.id
    JOIN professions p ON wp.profession_id = p.id
    LEFT JOIN work_passports pass ON pass.worker_profile_id = wp.id
    WHERE wp.id = ? OR wp.user_id = ? OR wp.nirmaan_id = ?
    LIMIT 1
");
$stmt->execute([$id, $id, $nirmaanId ?: $id]);
$worker = $stmt->fetch();

if (!$worker) {
    sendJsonResponse(['success' => false, 'error' => 'Worker not found'], 404);
}

// 1. Verified Skills
$sStmt = $pdo->prepare("
    SELECT s.name, ws.is_verified, ws.proficiency_level
    FROM worker_skills ws
    JOIN skills s ON ws.skill_id = s.id
    WHERE ws.worker_profile_id = ?
");
$sStmt->execute([$worker['id']]);
$worker['skills'] = $sStmt->fetchAll();

// 2. Client Reviews
$rStmt = $pdo->prepare("
    SELECT r.*, u.name as client_name, p.name as project_title
    FROM reviews r
    JOIN users u ON r.reviewer_user_id = u.id
    LEFT JOIN projects p ON r.project_id = p.id
    WHERE r.reviewee_user_id = ? AND r.review_type = 'client_to_worker'
    ORDER BY r.created_at DESC
");
$rStmt->execute([$worker['user_id']]);
$worker['client_reviews'] = $rStmt->fetchAll();

// 3. Worker Reviews of Clients
$wrStmt = $pdo->prepare("
    SELECT r.*, u.name as client_name, p.name as project_title
    FROM reviews r
    JOIN users u ON r.reviewee_user_id = u.id
    LEFT JOIN projects p ON r.project_id = p.id
    WHERE r.reviewer_user_id = ? AND r.review_type = 'worker_to_client'
    ORDER BY r.created_at DESC
");
$wrStmt->execute([$worker['user_id']]);
$worker['worker_reviews_of_clients'] = $wrStmt->fetchAll();

// 4. Work History & Project Evidence
$eStmt = $pdo->prepare("
    SELECT we.*, p.name as project_name, p.location
    FROM work_evidence we
    JOIN projects p ON we.project_id = p.id
    WHERE we.worker_profile_id = ?
    ORDER BY we.created_at DESC
");
$eStmt->execute([$worker['id']]);
$worker['work_evidence'] = $eStmt->fetchAll();

sendJsonResponse([
    'success' => true,
    'worker' => $worker
]);
