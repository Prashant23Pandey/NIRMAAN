<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../middleware/auth.php';

$pdo = getDbConnection();

// 1. Core KPIs
$kpis = [];

$stmt = $pdo->query("SELECT COUNT(*) FROM worker_profiles");
$kpis['total_workers'] = intval($stmt->fetchColumn());

$stmt = $pdo->query("SELECT COUNT(*) FROM homeowner_profiles");
$kpis['total_homeowners'] = intval($stmt->fetchColumn());

$stmt = $pdo->query("SELECT COUNT(*) FROM contractor_profiles");
$kpis['total_contractors'] = intval($stmt->fetchColumn());

$stmt = $pdo->query("SELECT COUNT(*) FROM jobs");
$kpis['total_jobs'] = intval($stmt->fetchColumn());

$stmt = $pdo->query("SELECT COUNT(*) FROM jobs WHERE status = 'open'");
$kpis['active_jobs'] = intval($stmt->fetchColumn());

$stmt = $pdo->query("SELECT COUNT(*) FROM jobs WHERE status = 'completed'");
$kpis['completed_jobs'] = intval($stmt->fetchColumn());

$stmt = $pdo->query("SELECT COUNT(*) FROM projects WHERE status = 'in_progress'");
$kpis['active_projects'] = intval($stmt->fetchColumn());

$stmt = $pdo->query("SELECT COUNT(*) FROM projects WHERE status = 'completed'");
$kpis['completed_projects'] = intval($stmt->fetchColumn());

$stmt = $pdo->query("SELECT COUNT(*) FROM verification_requests WHERE status = 'pending'");
$kpis['pending_verification'] = intval($stmt->fetchColumn());

$stmt = $pdo->query("SELECT COUNT(*) FROM disputes WHERE status = 'OPEN'");
$kpis['pending_disputes'] = intval($stmt->fetchColumn());

$stmt = $pdo->query("SELECT COALESCE(SUM(amount), 0) FROM payments");
$kpis['total_recorded_payments'] = floatval($stmt->fetchColumn());

// 2. Chart: Users by Role
$stmt = $pdo->query("
    SELECT r.name, COUNT(u.id) as value
    FROM roles r
    LEFT JOIN users u ON u.role_id = r.id
    GROUP BY r.id, r.name
");
$usersByRole = $stmt->fetchAll();

// 3. Chart: Workers by Profession
$stmt = $pdo->query("
    SELECT p.name, COUNT(wp.id) as count
    FROM professions p
    LEFT JOIN worker_profiles wp ON wp.profession_id = p.id
    GROUP BY p.id, p.name
    ORDER BY count DESC
");
$workersByProfession = $stmt->fetchAll();

// 4. Chart: Jobs by Profession
$stmt = $pdo->query("
    SELECT p.name, COUNT(j.id) as count
    FROM professions p
    LEFT JOIN jobs j ON j.profession_id = p.id
    GROUP BY p.id, p.name
    ORDER BY count DESC
");
$jobsByProfession = $stmt->fetchAll();

// 5. Chart: Monthly Completed Jobs from MySQL
$stmt = $pdo->query("
    SELECT 
        DATE_FORMAT(created_at, '%b') as month,
        COUNT(*) as jobs,
        COALESCE(SUM(daily_wage), 0) as wages
    FROM jobs
    WHERE status = 'completed'
    GROUP BY DATE_FORMAT(created_at, '%Y-%m'), DATE_FORMAT(created_at, '%b')
    ORDER BY MIN(created_at) ASC
");
$monthlyJobs = $stmt->fetchAll(PDO::FETCH_ASSOC);
if (empty($monthlyJobs)) {
    $monthlyJobs = [];
}

// 6. Project Status Breakdown
$stmt = $pdo->query("
    SELECT status, COUNT(*) as count
    FROM projects
    GROUP BY status
");
$projectStatus = $stmt->fetchAll();

sendJsonResponse([
    'success' => true,
    'kpis' => $kpis,
    'charts' => [
        'users_by_role' => $usersByRole,
        'workers_by_profession' => $workersByProfession,
        'jobs_by_profession' => $jobsByProfession,
        'monthly_jobs' => $monthlyJobs,
        'project_status' => $projectStatus
    ]
]);
