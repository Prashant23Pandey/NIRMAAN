<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../middleware/auth.php';

$pdo = getDbConnection();

// Fetch contractor company summary
$stmt = $pdo->query("
    SELECT cp.*, u.name, u.phone, u.email, u.avatar
    FROM contractor_profiles cp
    JOIN users u ON cp.user_id = u.id
    LIMIT 1
");
$contractor = $stmt->fetch();

// 1. Projects under contractor
$stmt = $pdo->query("
    SELECT p.*, u.name as client_name
    FROM projects p
    JOIN users u ON p.client_user_id = u.id
    ORDER BY p.created_at DESC
");
$projects = $stmt->fetchAll();

// 2. Active workforce assigned
$stmt = $pdo->query("
    SELECT pw.*, u.name as worker_name, u.phone as worker_phone, u.avatar as worker_avatar, 
           p.name as project_name, prof.name as trade_name, wp.nirmaan_id, wp.rating
    FROM project_workers pw
    JOIN worker_profiles wp ON pw.worker_profile_id = wp.id
    JOIN users u ON wp.user_id = u.id
    JOIN professions prof ON wp.profession_id = prof.id
    JOIN projects p ON pw.project_id = p.id
    WHERE pw.status = 'active'
");
$workers = $stmt->fetchAll();

// 3. Open Contractor Jobs
$stmt = $pdo->query("
    SELECT j.*, p.name as profession_name
    FROM jobs j
    JOIN professions p ON j.profession_id = p.id
    WHERE j.status = 'open'
");
$openJobs = $stmt->fetchAll();

// 4. Today's Attendance Overview
$stmt = $pdo->query("
    SELECT a.*, u.name as worker_name, p.name as project_name
    FROM attendance a
    JOIN worker_profiles wp ON a.worker_profile_id = wp.id
    JOIN users u ON wp.user_id = u.id
    JOIN projects p ON a.project_id = p.id
    WHERE a.date = CURDATE()
");
$todayAttendance = $stmt->fetchAll();

// 5. Total Payroll & Metrics
$stmt = $pdo->query("SELECT COALESCE(SUM(amount), 0) as total_released FROM payments WHERE status = 'released'");
$payroll = $stmt->fetch();

sendJsonResponse([
    'success' => true,
    'contractor' => $contractor,
    'stats' => [
        'active_projects' => count($projects),
        'total_workers' => count($workers),
        'open_jobs' => count($openJobs),
        'attendance_today' => count($todayAttendance),
        'payroll_disbursed' => floatval($payroll['total_released'])
    ],
    'projects' => $projects,
    'workers' => $workers,
    'open_jobs' => $openJobs,
    'attendance' => $todayAttendance
]);
