<?php
/**
 * NIRMAAN 2.0 — Projects List API
 * GET /api/projects/list.php
 * Returns projects belonging to the authenticated user only.
 * Admins and Contractors see all projects (optionally filtered by ?client_id=&contractor_id=)
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../middleware/auth.php';

// Require authentication — unauthenticated callers get []
$user = getAuthenticatedUser();

$pdo = getDbConnection();

$params = [];

// Base query using full_name (correct column)
$query = "
    SELECT 
        p.*,
        u.full_name as client_name,
        u.phone as client_phone
    FROM projects p
    JOIN users u ON p.client_user_id = u.id
    WHERE 1=1
";

// Role-based scoping
if ($user) {
    $roleSlug = strtoupper($user['role_slug'] ?? $user['role'] ?? '');
    if ($roleSlug === 'HOMEOWNER' || $roleSlug === 'CLIENT') {
        // Homeowner sees only their own projects
        $query .= " AND p.client_user_id = ?";
        $params[] = (int)$user['id'];
    } elseif ($roleSlug === 'CONTRACTOR') {
        // Contractor sees projects they manage
        $query .= " AND p.contractor_user_id = ?";
        $params[] = (int)$user['id'];
    } elseif ($roleSlug === 'WORKER') {
        // Worker sees projects they're assigned to
        $query .= " AND p.id IN (SELECT project_id FROM project_workers WHERE worker_profile_id IN (SELECT id FROM worker_profiles WHERE user_id = ?))";
        $params[] = (int)$user['id'];
    }
    // SUPER_ADMIN / ADMIN sees all — no extra clause
} else {
    // Not authenticated: return empty list
    sendJsonResponse(['success' => true, 'count' => 0, 'projects' => []]);
}

// Optional explicit filter overrides (admin usage)
$clientId = isset($_GET['client_id']) ? intval($_GET['client_id']) : 0;
$contractorId = isset($_GET['contractor_id']) ? intval($_GET['contractor_id']) : 0;
$status = $_GET['status'] ?? '';
if ($clientId > 0 && ($roleSlug === 'SUPER_ADMIN' || $roleSlug === 'ADMIN')) {
    $query .= " AND p.client_user_id = ?";
    $params[] = $clientId;
}
if ($contractorId > 0 && ($roleSlug === 'SUPER_ADMIN' || $roleSlug === 'ADMIN')) {
    $query .= " AND p.contractor_user_id = ?";
    $params[] = $contractorId;
}
if ($status) {
    $query .= " AND p.status = ?";
    $params[] = $status;
}

$query .= " ORDER BY p.created_at DESC";

$stmt = $pdo->prepare($query);
$stmt->execute($params);
$projects = $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach ($projects as &$proj) {
    // Workers assigned to this project
    $wStmt = $pdo->prepare("
        SELECT pw.*, u.full_name as name, u.profile_photo as photo, wp.level, p2.name as trade_name
        FROM project_workers pw
        JOIN worker_profiles wp ON pw.worker_profile_id = wp.id
        JOIN users u ON wp.user_id = u.id
        JOIN professions p2 ON wp.profession_id = p2.id
        WHERE pw.project_id = ? AND pw.status IN ('hired', 'active')
    ");
    $wStmt->execute([$proj['id']]);
    $proj['workers'] = $wStmt->fetchAll(PDO::FETCH_ASSOC);
    $proj['worker_count'] = count($proj['workers']);

    // Milestones (if table exists)
    try {
        $mStmt = $pdo->prepare("SELECT * FROM milestones WHERE project_id = ? ORDER BY id ASC");
        $mStmt->execute([$proj['id']]);
        $proj['milestones'] = $mStmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        $proj['milestones'] = [];
    }

    // Check-in count today (for sidebar widget)
    try {
        $cStmt = $pdo->prepare("SELECT COUNT(*) FROM attendance WHERE project_id = ? AND date = CURDATE()");
        $cStmt->execute([$proj['id']]);
        $proj['checked_in_today'] = (int)$cStmt->fetchColumn();
    } catch (Exception $e) {
        $proj['checked_in_today'] = 0;
    }
}

sendJsonResponse([
    'success' => true,
    'count' => count($projects),
    'projects' => $projects
]);
