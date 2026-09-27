<?php
/**
 * Migration: Create job_matches table & update jobs, notifications, worker_profiles
 */
require_once __DIR__ . '/config/database.php';

try {
    $db = getDB();

    // 1. Create job_matches table
    $db->exec("
        CREATE TABLE IF NOT EXISTS `job_matches` (
            `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            `job_id` BIGINT UNSIGNED NOT NULL,
            `worker_profile_id` BIGINT UNSIGNED NOT NULL,
            `distance_km` DECIMAL(5,2) DEFAULT 0.00,
            `match_score` INT DEFAULT 90,
            `status` ENUM('MATCHED', 'VIEWED', 'APPLIED', 'REJECTED', 'EXPIRED') DEFAULT 'MATCHED',
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            `viewed_at` TIMESTAMP NULL,
            `responded_at` TIMESTAMP NULL,
            INDEX idx_jm_job (job_id),
            INDEX idx_jm_worker (worker_profile_id),
            INDEX idx_jm_status (status),
            CONSTRAINT `fk_jm_job` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON DELETE CASCADE,
            CONSTRAINT `fk_jm_worker` FOREIGN KEY (`worker_profile_id`) REFERENCES `worker_profiles` (`id`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");
    echo "Table job_matches verified/created.\n";

    // 2. Add columns to jobs table
    $jobCols = $db->query("DESCRIBE jobs")->fetchAll(PDO::FETCH_COLUMN);
    if (!in_array('budget', $jobCols)) {
        $db->exec("ALTER TABLE jobs ADD COLUMN budget DECIMAL(12,2) NULL AFTER daily_wage");
        echo "Added budget to jobs.\n";
    }
    if (!in_array('address', $jobCols)) {
        $db->exec("ALTER TABLE jobs ADD COLUMN address VARCHAR(255) NULL AFTER location");
        echo "Added address to jobs.\n";
    }
    if (!in_array('pincode', $jobCols)) {
        $db->exec("ALTER TABLE jobs ADD COLUMN pincode VARCHAR(20) NULL AFTER city");
        echo "Added pincode to jobs.\n";
    }
    if (!in_array('latitude', $jobCols)) {
        $db->exec("ALTER TABLE jobs ADD COLUMN latitude DECIMAL(10,7) NULL AFTER pincode");
        echo "Added latitude to jobs.\n";
    }
    if (!in_array('longitude', $jobCols)) {
        $db->exec("ALTER TABLE jobs ADD COLUMN longitude DECIMAL(10,7) NULL AFTER latitude");
        echo "Added longitude to jobs.\n";
    }
    if (!in_array('radius_km', $jobCols)) {
        $db->exec("ALTER TABLE jobs ADD COLUMN radius_km DECIMAL(6,2) DEFAULT 10.00 AFTER longitude");
        echo "Added radius_km to jobs.\n";
    }
    if (!in_array('required_skills', $jobCols)) {
        $db->exec("ALTER TABLE jobs ADD COLUMN required_skills TEXT NULL AFTER description");
        echo "Added required_skills to jobs.\n";
    }
    if (!in_array('urgency', $jobCols)) {
        $db->exec("ALTER TABLE jobs ADD COLUMN urgency ENUM('normal', 'urgent', 'immediate') DEFAULT 'normal' AFTER status");
        echo "Added urgency to jobs.\n";
    }

    // 3. Add columns to notifications table
    $notifCols = $db->query("DESCRIBE notifications")->fetchAll(PDO::FETCH_COLUMN);
    if (!in_array('reference_type', $notifCols)) {
        $db->exec("ALTER TABLE notifications ADD COLUMN reference_type VARCHAR(50) NULL AFTER type");
        echo "Added reference_type to notifications.\n";
    }
    if (!in_array('reference_id', $notifCols)) {
        $db->exec("ALTER TABLE notifications ADD COLUMN reference_id BIGINT UNSIGNED NULL AFTER reference_type");
        echo "Added reference_id to notifications.\n";
    }

    // 4. Add columns to worker_profiles table
    $wpCols = $db->query("DESCRIBE worker_profiles")->fetchAll(PDO::FETCH_COLUMN);
    if (!in_array('pincode', $wpCols)) {
        $db->exec("ALTER TABLE worker_profiles ADD COLUMN pincode VARCHAR(20) NULL AFTER address");
        echo "Added pincode to worker_profiles.\n";
    }
    if (!in_array('preferred_radius_km', $wpCols)) {
        $db->exec("ALTER TABLE worker_profiles ADD COLUMN preferred_radius_km DECIMAL(6,2) DEFAULT 15.00 AFTER pincode");
        echo "Added preferred_radius_km to worker_profiles.\n";
    }
    if (!in_array('latitude', $wpCols)) {
        $db->exec("ALTER TABLE worker_profiles ADD COLUMN latitude DECIMAL(10,7) NULL AFTER preferred_radius_km");
        echo "Added latitude to worker_profiles.\n";
    }
    if (!in_array('longitude', $wpCols)) {
        $db->exec("ALTER TABLE worker_profiles ADD COLUMN longitude DECIMAL(10,7) NULL AFTER latitude");
        echo "Added longitude to worker_profiles.\n";
    }

    // 5. Update existing jobs with default budget if null
    $db->exec("UPDATE jobs SET budget = daily_wage * duration_days WHERE budget IS NULL");

    // 6. Give demo workers sample coordinates for realistic distance matching
    // Noida Sector 62 is approx 28.6280° N, 77.3750° E
    $db->exec("
        UPDATE worker_profiles SET 
            latitude = 28.6280 + (RAND() * 0.05 - 0.025),
            longitude = 77.3750 + (RAND() * 0.05 - 0.025),
            pincode = '201301',
            preferred_radius_km = 15.00
        WHERE latitude IS NULL
    ");

    echo "Migration completed successfully!\n";
} catch (Exception $e) {
    echo "Migration error: " . $e->getMessage() . "\n";
    exit(1);
}
