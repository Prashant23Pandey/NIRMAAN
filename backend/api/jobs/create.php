<?php
/**
 * NIRMAAN 2.0 — Job Creation & Real Worker Matching API
 * POST /api/jobs/create.php
 * Creates job, executes matching algorithm, and dispatches MySQL notifications & matches
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../middleware/auth.php';

$pdo = getDbConnection();
$authUser = getAuthUser();

$input = getJsonInput();
$title = trim($input['title'] ?? '');
$professionId = intval($input['profession_id'] ?? 1);
$description = trim($input['description'] ?? '');
$budget = floatval($input['budget'] ?? 0);
$dailyWage = floatval($input['daily_wage'] ?? 0);
$durationDays = intval($input['duration_days'] ?? $input['duration'] ?? 7);
$workersNeeded = intval($input['workers_needed'] ?? 1);
$startDate = trim($input['start_date'] ?? 'Tomorrow');
$address = trim($input['address'] ?? $input['location'] ?? 'Sector 62, Noida');
$location = trim($input['location'] ?? $address);
$city = trim($input['city'] ?? 'Noida');
$pincode = trim($input['pincode'] ?? '201301');
$latitude = isset($input['latitude']) && is_numeric($input['latitude']) ? floatval($input['latitude']) : null;
$longitude = isset($input['longitude']) && is_numeric($input['longitude']) ? floatval($input['longitude']) : null;
$radiusKm = floatval($input['radius_km'] ?? $input['radius'] ?? 10.00);
$urgency = in_array($input['urgency'] ?? '', ['normal', 'urgent', 'immediate']) ? $input['urgency'] : 'normal';

// Required skills serialization
$requiredSkillsInput = $input['required_skills'] ?? $input['skills'] ?? [];
$requiredSkillsText = is_array($requiredSkillsInput) ? implode(', ', $requiredSkillsInput) : (string)$requiredSkillsInput;

if (empty($title)) {
    sendJsonResponse(['success' => false, 'error' => 'Job title is required.'], 400);
}

// Compute budget/dailyWage relationship
if ($dailyWage <= 0 && $budget > 0 && $durationDays > 0) {
    $dailyWage = round($budget / ($durationDays * max(1, $workersNeeded)), 2);
} else if ($budget <= 0 && $dailyWage > 0 && $durationDays > 0) {
    $budget = round($dailyWage * $durationDays * max(1, $workersNeeded), 2);
} else if ($budget <= 0 && $dailyWage <= 0) {
    $dailyWage = 850.00;
    $budget = $dailyWage * $durationDays * $workersNeeded;
}

// Resolve Homeowner/Client User ID
$clientUserId = 0;
if ($authUser) {
    $clientUserId = (int)$authUser['id'];
} else if (!empty($input['client_user_id'])) {
    $clientUserId = intval($input['client_user_id']);
}

// If guest created job, fallback to default seed homeowner (ID 9 or first client)
if ($clientUserId <= 0) {
    $stmt = $pdo->query("SELECT id FROM users WHERE role = 'client' ORDER BY id ASC LIMIT 1");
    $clientUser = $stmt->fetch();
    $clientUserId = $clientUser ? (int)$clientUser['id'] : 1;
}

try {
    $pdo->beginTransaction();

    // 1. Insert into jobs table
    $stmt = $pdo->prepare("
        INSERT INTO jobs (
            title, profession_id, client_user_id, location, address, city, pincode,
            latitude, longitude, radius_km, daily_wage, budget, duration_days, workers_needed,
            start_date, description, required_skills, urgency, status
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, 'open'
        )
    ");
    $stmt->execute([
        $title, $professionId, $clientUserId, $location, $address, $city, $pincode,
        $latitude, $longitude, $radiusKm, $dailyWage, $budget, $durationDays, $workersNeeded,
        $startDate, $description, $requiredSkillsText, $urgency
    ]);
    $jobId = (int)$pdo->lastInsertId();

    // Fetch Profession Name for notification
    $pStmt = $pdo->prepare("SELECT name FROM professions WHERE id = ?");
    $pStmt->execute([$professionId]);
    $profRow = $pStmt->fetch();
    $professionName = $profRow['name'] ?? 'Artisan';

    // 2. MATCHING ALGORITHM:
    // Find workers with the SAME profession_id who are available
    $wStmt = $pdo->prepare("
        SELECT wp.id as worker_profile_id, wp.user_id, wp.latitude, wp.longitude, wp.city, wp.rating, u.name as worker_name
        FROM worker_profiles wp
        JOIN users u ON wp.user_id = u.id
        WHERE wp.profession_id = ? AND wp.is_available = 1 AND u.status = 'active'
    ");
    $wStmt->execute([$professionId]);
    $matchingWorkers = $wStmt->fetchAll();

    $matchedCount = 0;
    $matchedWorkerIds = [];

    $matchInsertStmt = $pdo->prepare("
        INSERT INTO job_matches (job_id, worker_profile_id, distance_km, match_score, status)
        VALUES (?, ?, ?, ?, 'MATCHED')
    ");

    $notifInsertStmt = $pdo->prepare("
        INSERT INTO notifications (user_id, title, message, type, reference_type, reference_id, is_read, link)
        VALUES (?, ?, ?, 'job', 'job', ?, 0, ?)
    ");

    foreach ($matchingWorkers as $w) {
        $distanceKm = 4.2; // default estimated distance
        if ($latitude && $longitude && $w['latitude'] && $w['longitude']) {
            // Haversine formula in KM
            $latFrom = deg2rad($latitude);
            $lonFrom = deg2rad($longitude);
            $latTo = deg2rad($w['latitude']);
            $lonTo = deg2rad($w['longitude']);

            $latDelta = $latTo - $latFrom;
            $lonDelta = $lonTo - $lonFrom;

            $angle = 2 * asin(sqrt(pow(sin($latDelta / 2), 2) + cos($latFrom) * cos($latTo) * pow(sin($lonDelta / 2), 2)));
            $distanceKm = round($angle * 6371, 1);
        }

        // Check if within radius (or within 25 km fallback)
        if ($distanceKm <= max($radiusKm, 25.0)) {
            $matchScore = min(99, max(75, intval(($w['rating'] / 5.0) * 100) - intval($distanceKm)));
            $matchInsertStmt->execute([$jobId, $w['worker_profile_id'], $distanceKm, $matchScore]);

            // Dispatch notification
            $notifTitle = "NEW JOB NEAR YOU: $title";
            $notifMsg = "$professionName Required • $location (approx $distanceKm km away) • Budget ₹" . number_format($budget, 0);
            $notifLink = "/worker/jobs?job_id=$jobId";
            $notifInsertStmt->execute([$w['user_id'], $notifTitle, $notifMsg, $jobId, $notifLink]);

            $matchedCount++;
            $matchedWorkerIds[] = (int)$w['worker_profile_id'];
        }
    }

    $pdo->commit();

    sendJsonResponse([
        'success' => true,
        'message' => "Job created and published successfully to $matchedCount matching $professionName craftsmen in MySQL!",
        'job_id' => $jobId,
        'profession_id' => $professionId,
        'profession_name' => $professionName,
        'matched_workers_count' => $matchedCount,
        'matched_worker_ids' => $matchedWorkerIds
    ], 201);

} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    sendJsonResponse(['success' => false, 'error' => 'Job creation failed: ' . $e->getMessage()], 500);
}
