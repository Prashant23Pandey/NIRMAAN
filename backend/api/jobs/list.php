<?php
/**
 * NIRMAAN 2.0 — Jobs List API
 * GET /api/jobs/list.php
 * Enforces Server-Side Profession Security for Workers
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../middleware/auth.php';

$pdo = getDbConnection();
$authUser = getAuthUser();

$professionId = isset($_GET['profession_id']) ? intval($_GET['profession_id']) : 0;
$professionSlug = trim($_GET['profession'] ?? $_GET['profession_slug'] ?? '');
$status = trim($_GET['status'] ?? '');
$city = trim($_GET['city'] ?? '');
$clientUserId = isset($_GET['client_user_id']) ? intval($_GET['client_user_id']) : 0;
$workerProfileId = isset($_GET['worker_profile_id']) ? intval($_GET['worker_profile_id']) : 0;

// Resolve worker profile if worker is logged in or provided
if ($authUser && strtolower($authUser['role']) === 'worker') {
    $stmt = $pdo->prepare("SELECT id, profession_id FROM worker_profiles WHERE user_id = ?");
    $stmt->execute([$authUser['id']]);
    $wp = $stmt->fetch();
    if ($wp && !empty($wp['profession_id'])) {
        $professionId = (int)$wp['profession_id'];
        $workerProfileId = (int)$wp['id'];
        $professionSlug = ''; // override any requested slug so worker cannot access other trades
    }
} else if ($workerProfileId > 0 && !$professionId) {
    $stmt = $pdo->prepare("SELECT profession_id FROM worker_profiles WHERE id = ?");
    $stmt->execute([$workerProfileId]);
    $professionId = (int)($stmt->fetchColumn() ?: 0);
}

$query = "
    SELECT 
        j.*,
        p.name as profession_name,
        p.slug as profession_slug,
        p.icon as profession_icon,
        u.name as client_name,
        u.full_name as client_full_name,
        u.phone as client_phone,
        COALESCE(u.profile_photo, u.avatar) as client_avatar,
        (SELECT ja.status FROM job_applications ja WHERE ja.job_id = j.id " . ($workerProfileId > 0 ? "AND ja.worker_profile_id = $workerProfileId " : "") . "ORDER BY ja.id DESC LIMIT 1) as my_application_status,
        (SELECT ja.worker_profile_id FROM job_applications ja WHERE ja.job_id = j.id AND ja.status IN ('accepted','hired') ORDER BY ja.id DESC LIMIT 1) as hired_worker_profile_id,
        (SELECT pr.id FROM projects pr WHERE pr.client_user_id = j.client_user_id ORDER BY pr.id DESC LIMIT 1) as project_id
    FROM jobs j
    JOIN professions p ON j.profession_id = p.id
    JOIN users u ON j.client_user_id = u.id
    WHERE 1=1
";

$params = [];

// Build the WHERE clause carefully:
// For workers: show open jobs in their trade OR their own accepted/in-progress jobs
if ($professionId > 0 && $workerProfileId > 0) {
    // Worker: open jobs in their profession OR accepted jobs they're hired on
    $query .= " AND (
        (j.status = 'open' AND j.profession_id = ?)
        OR (j.status IN ('accepted','in_progress') AND EXISTS (
            SELECT 1 FROM job_applications ja2
            WHERE ja2.job_id = j.id AND ja2.worker_profile_id = $workerProfileId AND ja2.status IN ('accepted','hired')
        ))
    )";
    $params[] = $professionId;
} else {
    // Homeowner / contractor / admin / no auth: apply filters normally
    if ($professionId > 0) {
        $query .= " AND j.profession_id = ?";
        $params[] = $professionId;
    } else if ($professionSlug) {
        $query .= " AND p.slug = ?";
        $params[] = $professionSlug;
    }

    if ($clientUserId > 0) {
        $query .= " AND j.client_user_id = ?";
        $params[] = $clientUserId;
    }

    if ($status) {
        $query .= " AND j.status = ?";
        $params[] = $status;
    }
}

if ($city) {
    $query .= " AND (j.city LIKE ? OR j.location LIKE ?)";
    $params[] = "%$city%";
    $params[] = "%$city%";
}

$query .= " ORDER BY j.status ASC, j.created_at DESC"; // accepted/in_progress first


$stmt = $pdo->prepare($query);
$stmt->execute($params);
$jobs = $stmt->fetchAll();

sendJsonResponse([
    'success' => true,
    'count' => count($jobs),
    'profession_filter_enforced' => ($authUser && strtolower($authUser['role']) === 'worker'),
    'jobs' => $jobs
]);
