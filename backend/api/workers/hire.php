<?php
/**
 * NIRMAAN 2.0 — Direct Worker Hire API
 * POST /api/workers/hire.php
 * 
 * Called when a homeowner clicks "HIRE THIS WORKER" from the Find Craftsmen page.
 * Creates a job (if needed), links worker to the homeowner's project,
 * and sends a notification to the worker — all in one transaction.
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../middleware/auth.php';

$pdo = getDbConnection();
$authUser = getAuthUser();

$input = getJsonInput();
$workerProfileId = intval($input['worker_profile_id'] ?? 0);
$projectId       = intval($input['project_id'] ?? 0);

if (!$workerProfileId) {
    sendJsonResponse(['success' => false, 'error' => 'worker_profile_id is required.'], 400);
}

// Determine the hiring homeowner's user ID
$clientUserId = 0;
if ($authUser) {
    $clientUserId = (int)$authUser['id'];
} else if (!empty($input['client_user_id'])) {
    $clientUserId = intval($input['client_user_id']);
}

if (!$clientUserId && $projectId > 0) {
    $pStmt = $pdo->prepare("SELECT client_user_id FROM projects WHERE id = ?");
    $pStmt->execute([$projectId]);
    $clientUserId = (int)($pStmt->fetchColumn() ?: 0);
}

if (!$clientUserId) {
    $cStmt = $pdo->query("SELECT id FROM users WHERE role IN ('client', 'homeowner') ORDER BY id ASC LIMIT 1");
    $clientUserId = (int)($cStmt->fetchColumn() ?: 0);
}

if (!$clientUserId) {
    sendJsonResponse(['success' => false, 'error' => 'Authentication required to hire workers.'], 401);
}

try {
    $pdo->beginTransaction();

    // 1. Fetch Worker Profile & User
    $stmt = $pdo->prepare("
        SELECT wp.*, u.id as user_id, u.name as worker_name, u.full_name as worker_full_name,
               u.phone as worker_phone, p.name as profession_name, p.id as profession_id
        FROM worker_profiles wp
        JOIN users u ON wp.user_id = u.id
        JOIN professions p ON wp.profession_id = p.id
        WHERE wp.id = ?
    ");
    $stmt->execute([$workerProfileId]);
    $worker = $stmt->fetch();

    if (!$worker) {
        sendJsonResponse(['success' => false, 'error' => 'Worker profile not found.'], 404);
    }

    // 2. Find or determine the project
    if ($projectId > 0) {
        $stmt = $pdo->prepare("SELECT * FROM projects WHERE id = ? AND client_user_id = ?");
        $stmt->execute([$projectId, $clientUserId]);
        $project = $stmt->fetch();
    } else {
        // Use the homeowner's most recent project
        $stmt = $pdo->prepare("SELECT * FROM projects WHERE client_user_id = ? ORDER BY created_at DESC LIMIT 1");
        $stmt->execute([$clientUserId]);
        $project = $stmt->fetch();
    }

    // 3. If no project exists, create one
    if (!$project) {
        $stmt = $pdo->prepare("
            INSERT INTO projects (name, category, client_user_id, location, city, start_date, progress_percent, budget, spent, status, description)
            VALUES (?, ?, ?, 'Site Location', 'Local', CURDATE(), 5, 50000, 0, 'in_progress', ?)
        ");
        $projectName = ($worker['profession_name'] ?? 'Construction') . ' Work';
        $stmt->execute([
            $projectName,
            $worker['profession_name'] ?? 'General',
            $clientUserId,
            'Hired ' . ($worker['worker_full_name'] ?? $worker['worker_name']) . ' for ' . ($worker['profession_name'] ?? 'construction') . ' work.'
        ]);
        $projectId = (int)$pdo->lastInsertId();
        
        // Re-fetch
        $stmt = $pdo->prepare("SELECT * FROM projects WHERE id = ?");
        $stmt->execute([$projectId]);
        $project = $stmt->fetch();
    } else {
        $projectId = (int)$project['id'];
    }

    // 4. Create a job record for this hire (so it appears in the worker's job feed)
    $jobTitle = 'Hired: ' . ($worker['profession_name'] ?? 'Worker') . ' for ' . ($project['name'] ?? 'Project');
    $stmt = $pdo->prepare("
        INSERT INTO jobs (title, description, profession_id, client_user_id, city, location, status, daily_wage, budget, duration_days, workers_needed, start_date, urgency)
        VALUES (?, ?, ?, ?, ?, ?, 'accepted', ?, ?, 30, 1, CURDATE(), 'normal')
    ");
    $dailyWage = $worker['expected_daily_wage'] ?: 850;
    $stmt->execute([
        $jobTitle,
        'Direct hire by homeowner for project: ' . ($project['name'] ?? 'Active Project'),
        $worker['profession_id'],
        $clientUserId,
        $project['city'] ?? 'Local',
        $project['location'] ?? 'Site',
        $dailyWage,
        $dailyWage * 30
    ]);
    $jobId = (int)$pdo->lastInsertId();

    // 5. Create a job_application record (auto-accepted)
    try {
        $stmt = $pdo->prepare("
            INSERT INTO job_applications (job_id, worker_profile_id, status, notes)
            VALUES (?, ?, 'accepted', 'Direct hire by homeowner')
        ");
        $stmt->execute([$jobId, $workerProfileId]);
    } catch (Exception $e) {
        // Table may not exist yet — non-critical
    }

    // 6. Link worker to project in project_workers
    $stmt = $pdo->prepare("SELECT id FROM project_workers WHERE project_id = ? AND worker_profile_id = ?");
    $stmt->execute([$projectId, $workerProfileId]);
    $existing = $stmt->fetch();

    if (!$existing) {
        $stmt = $pdo->prepare("
            INSERT INTO project_workers (project_id, worker_profile_id, role_trade, daily_wage, status)
            VALUES (?, ?, ?, ?, 'active')
        ");
        $stmt->execute([
            $projectId,
            $workerProfileId,
            $worker['profession_name'] ?? 'General',
            $dailyWage
        ]);
    } else {
        $stmt = $pdo->prepare("UPDATE project_workers SET status = 'active' WHERE id = ?");
        $stmt->execute([$existing['id']]);
    }

    // 7. Notify the WORKER about being hired
    $notifStmt = $pdo->prepare("
        INSERT INTO notifications (user_id, title, message, type, reference_type, reference_id, is_read, link)
        VALUES (?, ?, ?, 'job', 'project', ?, 0, ?)
    ");
    $workerNotifTitle = "🎉 YOU HAVE BEEN HIRED!";
    $workerNotifMsg = "Congratulations " . ($worker['worker_full_name'] ?? $worker['worker_name']) . "! A homeowner has hired you for " . ($project['name'] ?? 'a project') . ". Daily wage: ₹" . number_format($dailyWage) . "/day. Check your Work page for details.";
    $notifStmt->execute([$worker['user_id'], $workerNotifTitle, $workerNotifMsg, $projectId, '/worker/work']);

    // 8. Notify the HOMEOWNER about successful hire
    $homeownerNotifStmt = $pdo->prepare("
        INSERT INTO notifications (user_id, title, message, type, reference_type, reference_id, is_read, link)
        VALUES (?, ?, ?, 'hire', 'project', ?, 0, ?)
    ");
    $homeownerTitle = "✅ Worker Hired Successfully";
    $homeownerMsg = ($worker['worker_full_name'] ?? $worker['worker_name']) . " (" . ($worker['profession_name'] ?? 'Artisan') . ") has been added to your project \"" . ($project['name'] ?? 'Active Project') . "\". They will be notified immediately.";
    $homeownerNotifStmt->execute([$clientUserId, $homeownerTitle, $homeownerMsg, $projectId, '/homeowner/home']);

    $pdo->commit();

    sendJsonResponse([
        'success' => true,
        'message' => 'Worker hired successfully! Job created, linked to project, and both parties notified.',
        'job_id' => $jobId,
        'project_id' => $projectId,
        'worker_profile_id' => $workerProfileId,
        'worker_name' => $worker['worker_full_name'] ?? $worker['worker_name'],
        'daily_wage' => $dailyWage,
    ]);

} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    sendJsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
}
