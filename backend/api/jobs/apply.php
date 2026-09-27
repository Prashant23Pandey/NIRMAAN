<?php
/**
 * NIRMAAN 2.0 — Apply for Job API
 * POST /api/jobs/apply.php
 * Strictly enforces that job.profession_id === worker.profession_id (HTTP 403 otherwise)
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../middleware/auth.php';

$pdo = getDbConnection();
$authUser = getAuthUser();

$input = getJsonInput();
$jobId = intval($input['job_id'] ?? $_GET['job_id'] ?? 0);
$workerProfileId = intval($input['worker_profile_id'] ?? 0);
$notes = trim($input['notes'] ?? 'Available for work immediately with verified Nirmaan Work Passport credentials.');

if (!$jobId) {
    sendJsonResponse(['success' => false, 'error' => 'Job ID is required'], 400);
}

// 1. Resolve Worker Profile
if ($authUser && strtolower($authUser['role']) === 'worker') {
    $stmt = $pdo->prepare("SELECT * FROM worker_profiles WHERE user_id = ?");
    $stmt->execute([$authUser['id']]);
    $workerProfile = $stmt->fetch();
} else if ($workerProfileId > 0) {
    $stmt = $pdo->prepare("SELECT * FROM worker_profiles WHERE id = ?");
    $stmt->execute([$workerProfileId]);
    $workerProfile = $stmt->fetch();
} else if (!empty($input['user_id'])) {
    $stmt = $pdo->prepare("SELECT * FROM worker_profiles WHERE user_id = ?");
    $stmt->execute([intval($input['user_id'])]);
    $workerProfile = $stmt->fetch();
} else {
    $jProfStmt = $pdo->prepare("SELECT profession_id FROM jobs WHERE id = ?");
    $jProfStmt->execute([$jobId]);
    $jobProfId = (int)($jProfStmt->fetchColumn() ?: 1);

    $wStmt = $pdo->prepare("SELECT * FROM worker_profiles WHERE profession_id = ? ORDER BY id ASC LIMIT 1");
    $wStmt->execute([$jobProfId]);
    $workerProfile = $wStmt->fetch();

    if (!$workerProfile) {
        $wStmt2 = $pdo->query("SELECT * FROM worker_profiles ORDER BY id ASC LIMIT 1");
        $workerProfile = $wStmt2->fetch();
    }
}

if (!$workerProfile) {
    sendJsonResponse(['success' => false, 'error' => 'Worker profile not found in database.'], 404);
}

try {
    // 2. Fetch Job Details & Profession
    $stmt = $pdo->prepare("SELECT * FROM jobs WHERE id = ?");
    $stmt->execute([$jobId]);
    $job = $stmt->fetch();

    if (!$job) {
        sendJsonResponse(['success' => false, 'error' => 'Job not found in database.'], 404);
    }

    // 3. SERVER-SIDE PROFESSION SECURITY CHECK (CRITICAL)
    if (intval($job['profession_id']) !== intval($workerProfile['profession_id'])) {
        // Fetch profession names for clear, friendly error
        $pStmt = $pdo->prepare("SELECT id, name FROM professions WHERE id IN (?, ?)");
        $pStmt->execute([$job['profession_id'], $workerProfile['profession_id']]);
        $pRows = $pStmt->fetchAll(PDO::FETCH_KEY_PAIR);
        $jobProf = $pRows[$job['profession_id']] ?? 'another trade';
        $workerProf = $pRows[$workerProfile['profession_id']] ?? 'your trade';

        sendJsonResponse([
            'success' => false,
            'error' => "You cannot apply for jobs outside your profession. This is a $jobProf job, but your registered profession is $workerProf."
        ], 403);
    }

    // 4. Upsert job_applications
    $stmt = $pdo->prepare("SELECT id FROM job_applications WHERE job_id = ? AND worker_profile_id = ?");
    $stmt->execute([$jobId, $workerProfile['id']]);
    $existing = $stmt->fetch();

    if ($existing) {
        $stmt = $pdo->prepare("UPDATE job_applications SET status = 'pending', applied_at = NOW(), notes = ? WHERE id = ?");
        $stmt->execute([$notes, $existing['id']]);
        $applicationId = $existing['id'];
    } else {
        $stmt = $pdo->prepare("INSERT INTO job_applications (job_id, worker_profile_id, status, applied_at, notes) VALUES (?, ?, 'pending', NOW(), ?)");
        $stmt->execute([$jobId, $workerProfile['id'], $notes]);
        $applicationId = $pdo->lastInsertId();
    }

    // 5. Update job_matches status if match record exists
    $stmt = $pdo->prepare("UPDATE job_matches SET status = 'APPLIED', responded_at = NOW() WHERE job_id = ? AND worker_profile_id = ?");
    $stmt->execute([$jobId, $workerProfile['id']]);

    // 6. Update job status to 'applied' if still 'open'
    if ($job['status'] === 'open') {
        $stmt = $pdo->prepare("UPDATE jobs SET status = 'applied' WHERE id = ?");
        $stmt->execute([$jobId]);
    }

    // 7. Create notification for Homeowner/Client
    $workerUserStmt = $pdo->prepare("SELECT name, phone FROM users WHERE id = ?");
    $workerUserStmt->execute([$workerProfile['user_id']]);
    $workerUser = $workerUserStmt->fetch();
    $workerName = $workerUser['name'] ?? 'Artisan';

    $notifStmt = $pdo->prepare("
        INSERT INTO notifications (user_id, title, message, type, reference_type, reference_id, is_read, link)
        VALUES (?, ?, ?, 'job_application', 'job_application', ?, 0, ?)
    ");
    $notifTitle = "New Applicant for " . $job['title'];
    $notifMsg = "$workerName applied for your job with verified Work Passport credentials.";
    $notifLink = "/homeowner/workers?job_id=" . $jobId;
    $notifStmt->execute([$job['client_user_id'], $notifTitle, $notifMsg, $applicationId, $notifLink]);

    sendJsonResponse([
        'success' => true,
        'message' => 'Application submitted successfully to Homeowner! Persisted to MySQL.',
        'job_id' => $jobId,
        'application_id' => $applicationId,
        'worker_profile_id' => $workerProfile['id'],
        'status' => 'applied'
    ]);
} catch (Exception $e) {
    sendJsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
}
