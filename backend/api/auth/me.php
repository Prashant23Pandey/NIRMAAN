<?php
/**
 * NIRMAAN 2.0 — Current Authenticated User Session API
 * GET /api/auth/me.php
 * Single source of truth from MySQL
 */

error_reporting(0);
ini_set('display_errors', '0');

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../middleware/auth.php';

try {
    $user = getAuthenticatedUser();

    if (!$user) {
        sendJsonResponse([
            'authenticated' => false,
            'user' => null
        ]);
        exit;
    }

    $pdo = getDbConnection();
    $userId = (int)$user['id'];
    $roleNormalized = strtolower($user['role'] ?? '');
    $roleSlug = strtoupper($user['role_slug'] ?? $user['role'] ?? '');
    $extra = [];

    if ($roleNormalized === 'worker' || $roleSlug === 'WORKER') {
        $stmt = $pdo->prepare("
            SELECT 
                wp.id as worker_profile_id,
                wp.profession_id,
                COALESCE(p.name, wp.profession, '') as profession_name,
                COALESCE(p.slug, '') as profession_slug,
                COALESCE(wp.level, 'Level 1 Artisan') as level,
                COALESCE(wp.years_experience, wp.experience_years, 0) as years_experience,
                COALESCE(wp.experience_years, 0) as experience_years,
                COALESCE(wp.expected_daily_wage, wp.daily_rate, 0.00) as expected_daily_wage,
                COALESCE(wp.daily_rate, 0.00) as daily_rate,
                COALESCE(wp.rating, 0.00) as rating,
                COALESCE(wp.total_reviews, 0) as total_reviews,
                COALESCE(wp.completed_jobs, 0) as completed_jobs,
                wp.bio,
                COALESCE(wp.city, '') as city,
                COALESCE(wp.state, 'Uttar Pradesh') as state,
                COALESCE(wp.address, '') as address,
                COALESCE(wp.pincode, '') as pincode,
                wp.latitude,
                wp.longitude,
                COALESCE(wp.preferred_radius_km, 15.00) as preferred_radius_km,
                COALESCE(wp.is_available, 1) as is_available,
                COALESCE(wp.is_verified, 0) as is_verified,
                COALESCE(wp.verification_status, 'pending') as verification_status,
                COALESCE(wp.nirmaan_id, u.registration_id) as nirmaan_id,
                COALESCE(wp.profile_photo, u.profile_photo, u.avatar) as profile_photo,
                wp.document_type,
                wp.document_number,
                wp.document_url,
                wp.skills as skills_raw
            FROM users u
            LEFT JOIN worker_profiles wp ON wp.user_id = u.id
            LEFT JOIN professions p ON wp.profession_id = p.id
            WHERE u.id = ?
        ");
        $stmt->execute([$userId]);
        $workerProfile = $stmt->fetch();

        if ($workerProfile) {
            $workerProfileId = (int)($workerProfile['worker_profile_id'] ?? 0);

            // Fetch skills from worker_skills join
            $skills = [];
            if ($workerProfileId > 0) {
                $sStmt = $pdo->prepare("
                    SELECT s.id, s.name, s.slug, ws.proficiency_level, ws.is_verified
                    FROM worker_skills ws
                    JOIN skills s ON ws.skill_id = s.id
                    WHERE ws.worker_profile_id = ?
                ");
                $sStmt->execute([$workerProfileId]);
                $skillsRows = $sStmt->fetchAll();
                if ($skillsRows) {
                    $skills = $skillsRows;
                }
            }

            // Work Passport from MySQL
            $passport = null;
            if ($workerProfileId > 0) {
                $passStmt = $pdo->prepare("SELECT * FROM work_passports WHERE worker_profile_id = ?");
                $passStmt->execute([$workerProfileId]);
                $passport = $passStmt->fetch();
            }

            if (!$passport) {
                $passport = [
                    'quality_score' => 0.00,
                    'punctuality_score' => 0.00,
                    'reliability_score' => 0.00,
                    'completion_score' => 0.00,
                    'client_payment_score' => 0.00,
                    'client_site_score' => 0.00,
                    'client_clarity_score' => 0.00,
                ];
            }

            // Unread notifications count
            $notifCount = 0;
            try {
                $notifStmt = $pdo->prepare("SELECT COUNT(*) as unread_count FROM notifications WHERE user_id = ? AND is_read = 0");
                $notifStmt->execute([$userId]);
                $notifCount = (int)($notifStmt->fetch()['unread_count'] ?? 0);
            } catch (Exception $e) {}

            // Pending job alerts count
            $matchCount = 0;
            try {
                $matchStmt = $pdo->prepare("SELECT COUNT(*) as match_count FROM job_matches WHERE worker_profile_id = ? AND status = 'MATCHED'");
                $matchStmt->execute([$workerProfileId]);
                $matchCount = (int)($matchStmt->fetch()['match_count'] ?? 0);
            } catch (Exception $e) {}

            $extra = array_merge($workerProfile, [
                'trade' => $workerProfile['profession_name'],
                'available' => (bool)$workerProfile['is_available'],
                'verified' => (bool)$workerProfile['is_verified'],
                'skills' => $skills,
                'passport' => $passport,
                'unread_notifications' => $notifCount,
                'pending_job_matches' => $matchCount,
            ]);
        }

    } else if ($roleNormalized === 'client' || $roleNormalized === 'homeowner' || $roleSlug === 'HOMEOWNER') {
        $stmt = $pdo->prepare("
            SELECT 
                COALESCE(hp.city, cp.city, '') as city,
                COALESCE(hp.address, cp.address, '') as address,
                COALESCE(cp.company_name, '') as company_name,
                COALESCE(cp.state, 'Uttar Pradesh') as state,
                COALESCE(cp.project_type, '') as project_type,
                COALESCE(hp.rating, 0.00) as rating,
                COALESCE(hp.total_projects, 0) as total_projects
            FROM users u
            LEFT JOIN client_profiles cp ON cp.user_id = u.id
            LEFT JOIN homeowner_profiles hp ON hp.user_id = u.id
            WHERE u.id = ?
        ");
        $stmt->execute([$userId]);
        $clientProfile = $stmt->fetch();
        if ($clientProfile) {
            $extra = $clientProfile;
        }
    } else if ($roleNormalized === 'contractor' || $roleSlug === 'CONTRACTOR') {
        $stmt = $pdo->prepare("
            SELECT 
                company_name, license_number, specialization, experience_years,
                address, city, state, verification_status, gst_number, rating, total_projects, document_url
            FROM contractor_profiles WHERE user_id = ?
        ");
        $stmt->execute([$userId]);
        $contractorProfile = $stmt->fetch();
        if ($contractorProfile) {
            $extra = $contractorProfile;
        }
    } else if ($roleNormalized === 'employee' || $roleSlug === 'EMPLOYEE') {
        $stmt = $pdo->prepare("
            SELECT department, designation, employee_code, city, state, address, joining_date
            FROM employee_profiles WHERE user_id = ?
        ");
        $stmt->execute([$userId]);
        $employeeProfile = $stmt->fetch();
        if ($employeeProfile) {
            $extra = $employeeProfile;
        }
    }

    sendJsonResponse([
        'authenticated' => true,
        'user' => array_merge($user, $extra)
    ]);
} catch (Throwable $e) {
    sendJsonResponse([
        'authenticated' => false,
        'error' => $e->getMessage()
    ], 500);
}
