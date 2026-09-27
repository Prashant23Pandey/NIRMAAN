<?php
/**
 * NIRMAAN 2.0 — Get Single Project API
 * GET /api/projects/get.php?id={projectId}
 * Returns a single project only if the authenticated user owns or is assigned to it.
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../middleware/auth.php';

$user = getAuthenticatedUser();
if (!$user) {
    sendJsonResponse(['success' => false, 'error' => 'Authentication required'], 401);
}

$pdo = getDbConnection();
$userId = (int)$user['id'];
$roleSlug = strtoupper($user['role_slug'] ?? $user['role'] ?? '');

// Support ?id= OR pick the user's first/active project automatically
$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($id > 0) {
    $stmt = $pdo->prepare("
        SELECT p.*, u.full_name as client_name, u.phone as client_phone
        FROM projects p
        JOIN users u ON p.client_user_id = u.id
        WHERE p.id = ?
    ");
    $stmt->execute([$id]);
    $project = $stmt->fetch(PDO::FETCH_ASSOC);

    // Security: ensure the user owns or is assigned to this project
    if ($project && $roleSlug !== 'SUPER_ADMIN' && $roleSlug !== 'ADMIN') {
        $isOwner = ((int)$project['client_user_id'] === $userId);
        $isContractor = ((int)($project['contractor_user_id'] ?? 0) === $userId);
        $isAssignedWorker = false;
        if (!$isOwner && !$isContractor) {
            $wCheck = $pdo->prepare("SELECT COUNT(*) FROM project_workers pw JOIN worker_profiles wp ON pw.worker_profile_id = wp.id WHERE pw.project_id = ? AND wp.user_id = ?");
            $wCheck->execute([$id, $userId]);
            $isAssignedWorker = ((int)$wCheck->fetchColumn() > 0);
        }
        if (!$isOwner && !$isContractor && !$isAssignedWorker) {
            sendJsonResponse(['success' => false, 'error' => 'Access denied to this project'], 403);
        }
    }
} else {
    // No ID given: return the user's most recent project
    if ($roleSlug === 'HOMEOWNER' || $roleSlug === 'CLIENT') {
        $stmt = $pdo->prepare("SELECT p.*, u.full_name as client_name, u.phone as client_phone FROM projects p JOIN users u ON p.client_user_id = u.id WHERE p.client_user_id = ? ORDER BY p.created_at DESC LIMIT 1");
        $stmt->execute([$userId]);
    } elseif ($roleSlug === 'CONTRACTOR') {
        $stmt = $pdo->prepare("SELECT p.*, u.full_name as client_name, u.phone as client_phone FROM projects p JOIN users u ON p.client_user_id = u.id WHERE p.contractor_user_id = ? ORDER BY p.created_at DESC LIMIT 1");
        $stmt->execute([$userId]);
    } else {
        $stmt = $pdo->prepare("SELECT p.*, u.full_name as client_name, u.phone as client_phone FROM projects p JOIN users u ON p.client_user_id = u.id WHERE p.id IN (SELECT project_id FROM project_workers pw JOIN worker_profiles wp ON pw.worker_profile_id = wp.id WHERE wp.user_id = ?) ORDER BY p.created_at DESC LIMIT 1");
        $stmt->execute([$userId]);
    }
    $project = $stmt->fetch(PDO::FETCH_ASSOC);
}

if (!$project) {
    sendJsonResponse(['success' => true, 'project' => null]);
}

// Assigned Workers
$wStmt = $pdo->prepare("
    SELECT pw.*, u.full_name as name, u.profile_photo as photo, wp.level, wp.id as worker_profile_id, prof.name as trade_name, wp.nirmaan_id
    FROM project_workers pw
    JOIN worker_profiles wp ON pw.worker_profile_id = wp.id
    JOIN professions prof ON wp.profession_id = prof.id
    JOIN users u ON wp.user_id = u.id
    WHERE pw.project_id = ? AND pw.status IN ('hired', 'active')
");
$wStmt->execute([$project['id']]);
$project['workers'] = $wStmt->fetchAll(PDO::FETCH_ASSOC);

// Milestones
try {
    $mStmt = $pdo->prepare("
        SELECT m.*, u.full_name as worker_name
        FROM milestones m
        LEFT JOIN worker_profiles wp ON m.worker_profile_id = wp.id
        LEFT JOIN users u ON wp.user_id = u.id
        WHERE m.project_id = ?
        ORDER BY m.id ASC
    ");
    $mStmt->execute([$project['id']]);
    $milestones = $mStmt->fetchAll(PDO::FETCH_ASSOC);
} catch (Exception $e) {
    $milestones = [];
}

foreach ($milestones as &$m) {
    try {
        $pStmt = $pdo->prepare("SELECT image_url FROM work_evidence WHERE milestone_id = ?");
        $pStmt->execute([$m['id']]);
        $m['proof_photos'] = $pStmt->fetchAll(PDO::FETCH_COLUMN);
    } catch (Exception $e) {
        $m['proof_photos'] = [];
    }
}
$project['milestones'] = $milestones;

// Timeline Evidence
try {
    $tStmt = $pdo->prepare("
        SELECT we.*, u.full_name as contributor_name
        FROM work_evidence we
        JOIN worker_profiles wp ON we.worker_profile_id = wp.id
        JOIN users u ON wp.user_id = u.id
        WHERE we.project_id = ?
        ORDER BY we.created_at DESC
    ");
    $tStmt->execute([$project['id']]);
    $project['timeline'] = $tStmt->fetchAll(PDO::FETCH_ASSOC);
} catch (Exception $e) {
    $project['timeline'] = [];
}

// Today's Attendance
try {
    $aStmt = $pdo->prepare("
        SELECT a.*, u.full_name as worker_name
        FROM attendance a
        JOIN worker_profiles wp ON a.worker_profile_id = wp.id
        JOIN users u ON wp.user_id = u.id
        WHERE a.project_id = ? AND a.date = CURDATE()
    ");
    $aStmt->execute([$project['id']]);
    $project['today_attendance'] = $aStmt->fetchAll(PDO::FETCH_ASSOC);
} catch (Exception $e) {
    $project['today_attendance'] = [];
}

sendJsonResponse([
    'success' => true,
    'project' => $project
]);
