<?php
/**
 * NIRMAAN 2.0 — Accept Worker Application API
 * POST /api/jobs/accept.php
 * Updates job_applications, creates project_workers entry, and notifies worker
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../middleware/auth.php';

$pdo = getDbConnection();
$authUser = getAuthUser();

$input = getJsonInput();
$jobId = intval($input['job_id'] ?? $_GET['job_id'] ?? 0);
$workerProfileId = intval($input['worker_profile_id'] ?? $input['worker_id'] ?? 0);

if (!$workerProfileId && $authUser) {
    $wpStmt = $pdo->prepare("SELECT id FROM worker_profiles WHERE user_id = ?");
    $wpStmt->execute([$authUser['id']]);
    $workerProfileId = (int)($wpStmt->fetchColumn() ?: 0);
}
if (!$workerProfileId && !empty($input['user_id'])) {
    $wpStmt = $pdo->prepare("SELECT id FROM worker_profiles WHERE user_id = ?");
    $wpStmt->execute([intval($input['user_id'])]);
    $workerProfileId = (int)($wpStmt->fetchColumn() ?: 0);
}
if (!$workerProfileId) {
    $wStmt = $pdo->prepare("SELECT worker_profile_id FROM job_applications WHERE job_id = ? ORDER BY id DESC LIMIT 1");
    $wStmt->execute([$jobId]);
    $workerProfileId = (int)($wStmt->fetchColumn() ?: 0);
}
if (!$workerProfileId) {
    $wStmt = $pdo->query("SELECT id FROM worker_profiles ORDER BY id ASC LIMIT 1");
    $workerProfileId = (int)($wStmt->fetchColumn() ?: 1);
}

if (!$jobId || !$workerProfileId) {
    sendJsonResponse(['success' => false, 'error' => 'Job ID and Worker Profile ID are required.'], 400);
}

try {
    $pdo->beginTransaction();

    // 1. Fetch Job
    $stmt = $pdo->prepare("SELECT j.*, p.name as profession_name FROM jobs j JOIN professions p ON j.profession_id = p.id WHERE j.id = ?");
    $stmt->execute([$jobId]);
    $job = $stmt->fetch();

    if (!$job) {
        sendJsonResponse(['success' => false, 'error' => 'Job not found in database.'], 404);
    }

    // 2. Fetch Worker Profile & User
    $stmt = $pdo->prepare("
        SELECT wp.*, u.id as user_id, u.name as worker_name, u.phone as worker_phone
        FROM worker_profiles wp
        JOIN users u ON wp.user_id = u.id
        WHERE wp.id = ?
    ");
    $stmt->execute([$workerProfileId]);
    $worker = $stmt->fetch();

    if (!$worker) {
        sendJsonResponse(['success' => false, 'error' => 'Worker profile not found in database.'], 404);
    }

    // 3. Update job_applications status to 'accepted'
    $stmt = $pdo->prepare("UPDATE job_applications SET status = 'accepted' WHERE job_id = ? AND worker_profile_id = ?");
    $stmt->execute([$jobId, $workerProfileId]);

    // 4. Update job status to 'accepted'
    $stmt = $pdo->prepare("UPDATE jobs SET status = 'accepted' WHERE id = ?");
    $stmt->execute([$jobId]);

    // 5. Ensure a project exists for this work scope
    $stmt = $pdo->prepare("SELECT id FROM projects WHERE client_user_id = ? AND name = ?");
    $stmt->execute([$job['client_user_id'], $job['title']]);
    $project = $stmt->fetch();

    if (!$project) {
        $stmt = $pdo->prepare("
            INSERT INTO projects (
                name, category, client_user_id, location, city, start_date, progress_percent, budget, spent, status, description
            ) VALUES (
                ?, ?, ?, ?, ?, ?, 10, ?, 0.00, 'in_progress', ?
            )
        ");
        $stmt->execute([
            $job['title'],
            $job['profession_name'],
            $job['client_user_id'],
            $job['location'],
            $job['city'],
            $job['start_date'] ?: 'Tomorrow',
            $job['budget'] ?: 45000.00,
            $job['description'] ?: 'Active site project commenced with verified artisan.'
        ]);
        $projectId = (int)$pdo->lastInsertId();
    } else {
        $projectId = (int)$project['id'];
    }

    // 6. Link worker in project_workers table
    $stmt = $pdo->prepare("SELECT id FROM project_workers WHERE project_id = ? AND worker_profile_id = ?");
    $stmt->execute([$projectId, $workerProfileId]);
    $pw = $stmt->fetch();

    if (!$pw) {
        $stmt = $pdo->prepare("
            INSERT INTO project_workers (project_id, worker_profile_id, role_trade, daily_wage, status)
            VALUES (?, ?, ?, ?, 'active')
        ");
        $stmt->execute([
            $projectId,
            $workerProfileId,
            $job['profession_name'],
            $job['daily_wage'] ?: 850.00
        ]);
    } else {
        $stmt = $pdo->prepare("UPDATE project_workers SET status = 'active' WHERE id = ?");
        $stmt->execute([$pw['id']]);
    }

    // 7. Dispatch Selection Notification to the Worker
    $notifStmt = $pdo->prepare("
        INSERT INTO notifications (user_id, title, message, type, reference_type, reference_id, is_read, link)
        VALUES (?, ?, ?, 'job', 'project', ?, 0, ?)
    ");
    $notifTitle = "YOU HAVE BEEN SELECTED 🎉";
    $notifMsg = "Congratulations " . $worker['worker_name'] . "! The homeowner has accepted your application for " . $job['title'] . ". Site work is now active.";
    $notifLink = "/worker/work";
    $notifStmt->execute([$worker['user_id'], $notifTitle, $notifMsg, $projectId, $notifLink]);

    $pdo->commit();

    sendJsonResponse([
        'success' => true,
        'message' => 'Worker application accepted! Project is now active in project_workers and worker has been notified.',
        'job_id' => $jobId,
        'project_id' => $projectId,
        'worker_profile_id' => $workerProfileId,
        'worker_name' => $worker['worker_name'],
        'status' => 'accepted'
    ]);

} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    sendJsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
}
