<?php
/**
 * NIRMAAN 2.0 — Clean Database Reset Script
 * Resets all transactional, demo, and fake user records while strictly preserving:
 * - Roles (Master)
 * - Professions (Master)
 * - Skills (Master)
 * - Single bootstrap Super Admin user (admin@nirmaan.local / 9999900001)
 *
 * Security: CLI only or HTTP with secret confirmation token in local environment.
 */

if (php_sapi_name() !== 'cli') {
    require_once __DIR__ . '/config/cors.php';
    $remoteIp = $_SERVER['REMOTE_ADDR'] ?? '';
    $isLocal = in_array($remoteIp, ['127.0.0.1', '::1', 'localhost'], true) || (strncmp($remoteIp, '192.168.', 8) === 0) || (strncmp($remoteIp, '10.', 3) === 0);
    $token = $_GET['token'] ?? $_POST['token'] ?? '';
    
    if (!$isLocal || $token !== 'nirmaan_clean_reset_pass_2026') {
        http_response_code(403);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            'success' => false,
            'message' => 'Forbidden: Clean database reset is strictly development/admin-only with a valid confirmation token.'
        ]);
        exit;
    }
} else {
    // CLI execution check
    $args = $argv ?? [];
    if (!in_array('--confirm', $args, true)) {
        echo "Safety Warning: This script permanently clears all demo/transactional data from nirmaan_db.\n";
        echo "To execute, run: php backend/reset_demo_data.php --confirm\n";
        exit(1);
    }
}

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/seed_master_data.php';

try {
    $pdo = getDbConnection();
    echo "\n=== STARTING NIRMAAN 2.0 CLEAN DATABASE RESET ===\n";

    $pdo->exec("SET FOREIGN_KEY_CHECKS = 0;");

    // Ensure worker_profiles has profile_photo column
    try {
        $checkCol = $pdo->query("SHOW COLUMNS FROM `worker_profiles` LIKE 'profile_photo'");
        if (!$checkCol->fetch()) {
            $pdo->exec("ALTER TABLE `worker_profiles` ADD COLUMN `profile_photo` VARCHAR(500) NULL AFTER `user_id`");
            echo "✔ Added profile_photo column to worker_profiles.\n";
        }
    } catch (Exception $e) {
        // Ignore if already exists
    }

    // List of transactional and demo tables to truncate / clean
    $truncateTables = [
        'attendance',
        'work_evidence',
        'milestones',
        'payments',
        'reviews',
        'disputes',
        'emergency_reports',
        'job_applications',
        'job_matches',
        'project_workers',
        'jobs',
        'projects',
        'verification_requests',
        'documents',
        'notifications',
        'work_passports',
        'worker_skills',
        'worker_profiles',
        'homeowner_profiles',
        'client_profiles',
        'contractor_profiles',
        'employee_profiles',
        'admin_logs'
    ];

    foreach ($truncateTables as $table) {
        try {
            $pdo->exec("TRUNCATE TABLE `{$table}`");
            echo "✔ Cleared table: {$table}\n";
        } catch (Exception $e) {
            // In case TRUNCATE fails on FK, use DELETE FROM
            $pdo->exec("DELETE FROM `{$table}`");
            $pdo->exec("ALTER TABLE `{$table}` AUTO_INCREMENT = 1");
            echo "✔ Cleared table (via DELETE): {$table}\n";
        }
    }

    // Clean users table: preserve ONLY the bootstrap Super Admin (id = 1, role = 'admin')
    $delUsersStmt = $pdo->exec("DELETE FROM `users` WHERE `id` != 1 AND `role` != 'admin'");
    echo "✔ Removed {$delUsersStmt} non-admin user records from users table.\n";

    // Set AUTO_INCREMENT for users to next available id (2)
    $maxId = (int)$pdo->query("SELECT COALESCE(MAX(id), 1) FROM `users`")->fetchColumn();
    $nextUserId = $maxId + 1;
    $pdo->exec("ALTER TABLE `users` AUTO_INCREMENT = {$nextUserId}");
    echo "✔ Reset users AUTO_INCREMENT to {$nextUserId}.\n";

    // Clean up uploaded demo profile photos & documents, keeping the directories
    $cleanDirs = [
        __DIR__ . '/uploads/profile_photos',
        __DIR__ . '/uploads/documents'
    ];
    foreach ($cleanDirs as $dir) {
        if (is_dir($dir)) {
            $files = glob($dir . '/*');
            $removedFiles = 0;
            foreach ($files as $file) {
                if (is_file($file) && substr($file, -8) !== '.gitkeep') {
                    @unlink($file);
                    $removedFiles++;
                }
            }
            echo "✔ Cleaned {$removedFiles} uploaded files from " . basename($dir) . "\n";
        }
    }

    $pdo->exec("SET FOREIGN_KEY_CHECKS = 1;");

    echo "\n=== POST-RESET DATABASE VERIFICATION ===\n";
    $verifyTables = [
        'users',
        'worker_profiles',
        'homeowner_profiles',
        'contractor_profiles',
        'employee_profiles',
        'jobs',
        'job_matches',
        'job_applications',
        'projects',
        'project_workers',
        'milestones',
        'attendance',
        'work_evidence',
        'reviews',
        'payments',
        'notifications',
        'work_passports',
        'worker_skills',
        'verification_requests',
        'roles',
        'professions',
        'skills'
    ];

    $summary = [];
    foreach ($verifyTables as $t) {
        try {
            $count = (int)$pdo->query("SELECT COUNT(*) FROM `{$t}`")->fetchColumn();
            $summary[$t] = $count;
            echo str_pad($t, 25) . ": {$count} rows\n";
        } catch (Exception $e) {
            $summary[$t] = 'N/A';
        }
    }

    echo "\n✔ Clean database reset completed successfully. Platform is in pristine launch state.\n";

    if (php_sapi_name() !== 'cli') {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            'success' => true,
            'message' => 'Clean database reset completed successfully.',
            'tables' => $summary
        ], JSON_PRETTY_PRINT);
    }
} catch (Exception $e) {
    if (isset($pdo)) {
        $pdo->exec("SET FOREIGN_KEY_CHECKS = 1;");
    }
    echo "Error resetting database: " . $e->getMessage() . "\n";
    if (php_sapi_name() !== 'cli') {
        http_response_code(500);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit(1);
}
