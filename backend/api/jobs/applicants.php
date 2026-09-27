<?php
/**
 * NIRMAAN 2.0 — Job Applicants List API
 * GET /api/jobs/applicants.php?job_id=X
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../middleware/auth.php';

$pdo = getDbConnection();
$jobId = intval($_GET['job_id'] ?? 0);

if (!$jobId) {
    sendJsonResponse(['success' => false, 'error' => 'Job ID is required.'], 400);
}

$stmt = $pdo->prepare("
    SELECT 
        ja.id as application_id,
        ja.job_id,
        ja.worker_profile_id,
        ja.status as application_status,
        ja.applied_at,
        ja.notes,
        wp.user_id,
        wp.profession_id,
        p.name as profession_name,
        wp.level,
        wp.experience_years,
        wp.daily_rate,
        wp.expected_daily_wage,
        wp.rating,
        wp.total_reviews,
        wp.completed_jobs,
        wp.city,
        wp.is_verified,
        wp.verification_status,
        wp.document_type,
        wp.document_url,
        u.name as worker_name,
        u.full_name as worker_full_name,
        u.phone as worker_phone,
        u.registration_id,
        COALESCE(u.profile_photo, u.avatar) as worker_photo,
        COALESCE(jm.distance_km, 3.5) as distance_km,
        COALESCE(jm.match_score, 92) as match_score
    FROM job_applications ja
    JOIN worker_profiles wp ON ja.worker_profile_id = wp.id
    JOIN users u ON wp.user_id = u.id
    JOIN professions p ON wp.profession_id = p.id
    LEFT JOIN job_matches jm ON jm.job_id = ja.job_id AND jm.worker_profile_id = ja.worker_profile_id
    WHERE ja.job_id = ?
    ORDER BY ja.applied_at DESC
");
$stmt->execute([$jobId]);
$applicants = $stmt->fetchAll();

// Also fetch matched workers from job_matches
$mStmt = $pdo->prepare("
    SELECT 
        jm.id as match_id,
        jm.job_id,
        jm.worker_profile_id,
        jm.status as match_status,
        COALESCE(jm.distance_km, 3.8) as distance_km,
        COALESCE(jm.match_score, 90) as match_score,
        wp.user_id,
        wp.profession_id,
        p.name as profession_name,
        wp.level,
        wp.experience_years,
        COALESCE(wp.expected_daily_wage, wp.daily_rate, 850) as expected_daily_wage,
        wp.rating,
        wp.total_reviews,
        wp.completed_jobs,
        wp.city,
        wp.is_verified,
        u.name as worker_name,
        u.full_name as worker_full_name,
        u.phone as worker_phone,
        u.registration_id,
        COALESCE(u.profile_photo, u.avatar) as worker_photo
    FROM job_matches jm
    JOIN worker_profiles wp ON jm.worker_profile_id = wp.id
    JOIN users u ON wp.user_id = u.id
    JOIN professions p ON wp.profession_id = p.id
    WHERE jm.job_id = ?
    ORDER BY jm.match_score DESC
");
$mStmt->execute([$jobId]);
$matches = $mStmt->fetchAll();

sendJsonResponse([
    'success' => true,
    'job_id' => $jobId,
    'count' => count($applicants),
    'applicants' => $applicants,
    'matches_count' => count($matches),
    'matches' => $matches
]);
