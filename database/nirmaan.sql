-- ========================================================
-- NIRMAAN 2.0 — Multi-Role Construction Workforce Platform
-- MySQL Database Schema & Real Relational Seeds
-- Database: nirmaan_db
-- ========================================================

CREATE DATABASE IF NOT EXISTS `nirmaan_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `nirmaan_db`;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. ROLES
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `slug` VARCHAR(50) NOT NULL UNIQUE,
  `description` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. PROFESSIONS
DROP TABLE IF EXISTS `professions`;
CREATE TABLE `professions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `description` TEXT NULL,
  `icon` VARCHAR(50) DEFAULT 'Hammer',
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. USERS (Central users table with real registration_id, normalized roles, phone, email, and password hashing)
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `registration_id` VARCHAR(50) NOT NULL UNIQUE,
  `role` ENUM('worker', 'employee', 'client', 'contractor', 'admin') NOT NULL,
  `role_id` INT NULL,
  `full_name` VARCHAR(150) NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(190) NULL UNIQUE,
  `phone` VARCHAR(30) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `profile_photo` VARCHAR(500) NULL,
  `avatar` VARCHAR(500) NULL,
  `status` ENUM('pending', 'active', 'suspended', 'rejected') NOT NULL DEFAULT 'active',
  `email_verified_at` DATETIME NULL,
  `phone_verified_at` DATETIME NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_reg_id` (`registration_id`),
  INDEX `idx_users_role` (`role`),
  INDEX `idx_users_phone` (`phone`),
  INDEX `idx_users_email` (`email`),
  INDEX `idx_users_status` (`status`),
  INDEX `idx_users_created_at` (`created_at`),
  CONSTRAINT `fk_users_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. SKILLS
DROP TABLE IF EXISTS `skills`;
CREATE TABLE `skills` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `profession_id` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL,
  `description` VARCHAR(255) NULL,
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_skills_profession` FOREIGN KEY (`profession_id`) REFERENCES `professions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. WORKER_PROFILES
DROP TABLE IF EXISTS `worker_profiles`;
CREATE TABLE `worker_profiles` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NOT NULL UNIQUE,
  `profession_id` INT NULL,
  `profession` VARCHAR(100) NULL,
  `nirmaan_id` VARCHAR(50) NULL UNIQUE,
  `level` VARCHAR(50) DEFAULT 'Level 2 Artisan',
  `experience_years` INT DEFAULT 5,
  `years_experience` INT DEFAULT 5,
  `daily_rate` DECIMAL(10,2) DEFAULT 800.00,
  `expected_daily_wage` DECIMAL(10,2) DEFAULT 800.00,
  `skills` TEXT NULL,
  `city` VARCHAR(100) DEFAULT 'Noida',
  `state` VARCHAR(100) DEFAULT 'Uttar Pradesh',
  `address` VARCHAR(255) NULL,
  `pincode` VARCHAR(20) NULL,
  `preferred_radius_km` DECIMAL(6,2) DEFAULT 15.00,
  `latitude` DECIMAL(10,7) NULL,
  `longitude` DECIMAL(10,7) NULL,
  `availability` VARCHAR(50) DEFAULT 'available',
  `is_available` BOOLEAN DEFAULT TRUE,
  `verification_status` ENUM('pending', 'verified', 'rejected') DEFAULT 'verified',
  `is_verified` BOOLEAN DEFAULT TRUE,
  `rating` DECIMAL(3,2) DEFAULT 4.80,
  `total_reviews` INT DEFAULT 0,
  `completed_jobs` INT DEFAULT 0,
  `bio` TEXT NULL,
  `document_type` VARCHAR(100) NULL,
  `document_number` VARCHAR(100) NULL,
  `document_url` VARCHAR(255) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_wp_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_wp_profession` FOREIGN KEY (`profession_id`) REFERENCES `professions` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. EMPLOYEE_PROFILES
DROP TABLE IF EXISTS `employee_profiles`;
CREATE TABLE `employee_profiles` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NOT NULL UNIQUE,
  `department` VARCHAR(100) NOT NULL,
  `designation` VARCHAR(100) NOT NULL,
  `employee_code` VARCHAR(50) NOT NULL UNIQUE,
  `city` VARCHAR(100) DEFAULT 'Noida',
  `state` VARCHAR(100) DEFAULT 'Uttar Pradesh',
  `address` VARCHAR(255) NULL,
  `joining_date` DATE NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_ep_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. CLIENT_PROFILES
DROP TABLE IF EXISTS `client_profiles`;
CREATE TABLE `client_profiles` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NOT NULL UNIQUE,
  `company_name` VARCHAR(150) NULL,
  `address` VARCHAR(255) NULL,
  `city` VARCHAR(100) DEFAULT 'Noida',
  `state` VARCHAR(100) DEFAULT 'Uttar Pradesh',
  `project_type` VARCHAR(100) DEFAULT 'Residential Renovation',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_cp_client_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. HOMEOWNER_PROFILES (Compatible with client profiles)
DROP TABLE IF EXISTS `homeowner_profiles`;
CREATE TABLE `homeowner_profiles` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NOT NULL UNIQUE,
  `city` VARCHAR(100) DEFAULT 'Noida',
  `address` VARCHAR(255) NULL,
  `rating` DECIMAL(3,2) DEFAULT 4.90,
  `total_projects` INT DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_hp_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. CONTRACTOR_PROFILES
DROP TABLE IF EXISTS `contractor_profiles`;
CREATE TABLE `contractor_profiles` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NOT NULL UNIQUE,
  `company_name` VARCHAR(150) NOT NULL,
  `license_number` VARCHAR(100) NULL,
  `specialization` VARCHAR(150) DEFAULT 'Civil Contracting',
  `experience_years` INT DEFAULT 10,
  `address` VARCHAR(255) NULL,
  `city` VARCHAR(100) DEFAULT 'Delhi NCR',
  `state` VARCHAR(100) DEFAULT 'Delhi',
  `verification_status` ENUM('pending', 'verified', 'rejected') DEFAULT 'verified',
  `document_url` VARCHAR(255) NULL,
  `gst_number` VARCHAR(50) NULL,
  `rating` DECIMAL(3,2) DEFAULT 4.75,
  `total_projects` INT DEFAULT 12,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_cp_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. WORKER_SKILLS
DROP TABLE IF EXISTS `worker_skills`;
CREATE TABLE `worker_skills` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `worker_profile_id` BIGINT UNSIGNED NOT NULL,
  `skill_id` INT NOT NULL,
  `is_verified` BOOLEAN DEFAULT TRUE,
  `proficiency_level` VARCHAR(50) DEFAULT 'Master Craftsman',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_ws_worker` FOREIGN KEY (`worker_profile_id`) REFERENCES `worker_profiles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ws_skill` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. PROJECTS
DROP TABLE IF EXISTS `projects`;
CREATE TABLE `projects` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `category` VARCHAR(100) DEFAULT 'Renovation',
  `client_user_id` BIGINT UNSIGNED NOT NULL,
  `contractor_user_id` BIGINT UNSIGNED NULL,
  `location` VARCHAR(255) NOT NULL,
  `city` VARCHAR(100) DEFAULT 'Noida',
  `start_date` VARCHAR(50) DEFAULT 'Tomorrow',
  `progress_percent` INT DEFAULT 0,
  `budget` DECIMAL(12,2) DEFAULT 50000.00,
  `spent` DECIMAL(12,2) DEFAULT 0.00,
  `status` ENUM('planning', 'in_progress', 'completed') DEFAULT 'in_progress',
  `description` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_projects_client` FOREIGN KEY (`client_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. JOBS
DROP TABLE IF EXISTS `jobs`;
CREATE TABLE `jobs` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(200) NOT NULL,
  `title_hindi` VARCHAR(200) NULL,
  `profession_id` INT NOT NULL,
  `client_user_id` BIGINT UNSIGNED NOT NULL,
  `contractor_user_id` BIGINT UNSIGNED NULL,
  `location` VARCHAR(255) NOT NULL,
  `address` VARCHAR(255) NULL,
  `city` VARCHAR(100) DEFAULT 'Noida',
  `pincode` VARCHAR(20) NULL,
  `latitude` DECIMAL(10,7) NULL,
  `longitude` DECIMAL(10,7) NULL,
  `radius_km` DECIMAL(6,2) DEFAULT 10.00,
  `distance_km` DECIMAL(4,1) DEFAULT 3.2,
  `daily_wage` DECIMAL(10,2) NOT NULL,
  `budget` DECIMAL(12,2) NULL,
  `duration_days` INT DEFAULT 7,
  `workers_needed` INT DEFAULT 1,
  `start_date` VARCHAR(50) DEFAULT 'Tomorrow',
  `description` TEXT NULL,
  `required_skills` TEXT NULL,
  `status` ENUM('open', 'applied', 'accepted', 'completed') DEFAULT 'open',
  `urgency` ENUM('normal', 'urgent', 'immediate') DEFAULT 'normal',
  `is_bathroom_renovation_demo` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_jobs_profession` FOREIGN KEY (`profession_id`) REFERENCES `professions` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_jobs_client` FOREIGN KEY (`client_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 13. JOB_APPLICATIONS
DROP TABLE IF EXISTS `job_applications`;
CREATE TABLE `job_applications` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `job_id` BIGINT UNSIGNED NOT NULL,
  `worker_profile_id` BIGINT UNSIGNED NOT NULL,
  `status` ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
  `applied_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `notes` TEXT NULL,
  CONSTRAINT `fk_ja_job` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ja_worker` FOREIGN KEY (`worker_profile_id`) REFERENCES `worker_profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 14. PROJECT_WORKERS
DROP TABLE IF EXISTS `project_workers`;
CREATE TABLE `project_workers` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `project_id` BIGINT UNSIGNED NOT NULL,
  `worker_profile_id` BIGINT UNSIGNED NOT NULL,
  `role_trade` VARCHAR(100) NOT NULL,
  `daily_wage` DECIMAL(10,2) NOT NULL,
  `joined_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `status` ENUM('active', 'relieved') DEFAULT 'active',
  CONSTRAINT `fk_pw_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pw_worker` FOREIGN KEY (`worker_profile_id`) REFERENCES `worker_profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 15. ATTENDANCE
DROP TABLE IF EXISTS `attendance`;
CREATE TABLE `attendance` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `project_id` BIGINT UNSIGNED NOT NULL,
  `worker_profile_id` BIGINT UNSIGNED NOT NULL,
  `check_in_time` VARCHAR(20) DEFAULT '09:02 AM',
  `check_out_time` VARCHAR(20) NULL,
  `location_lat` DECIMAL(10,7) DEFAULT 28.6284540,
  `location_lng` DECIMAL(10,7) DEFAULT 77.3769440,
  `location_verified` BOOLEAN DEFAULT TRUE,
  `progress_percent` INT DEFAULT 80,
  `date` DATE NOT NULL,
  `status` ENUM('checked_in', 'checked_out', 'day_completed') DEFAULT 'checked_in',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_att_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_att_worker` FOREIGN KEY (`worker_profile_id`) REFERENCES `worker_profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 16. MILESTONES
DROP TABLE IF EXISTS `milestones`;
CREATE TABLE `milestones` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `project_id` BIGINT UNSIGNED NOT NULL,
  `worker_profile_id` BIGINT UNSIGNED NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `trade` VARCHAR(100) NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `progress_threshold` INT DEFAULT 100,
  `status` ENUM('pending', 'approved', 'paid') DEFAULT 'pending',
  `note` TEXT NULL,
  `completion_date` VARCHAR(50) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_m_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_m_worker` FOREIGN KEY (`worker_profile_id`) REFERENCES `worker_profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 17. WORK_EVIDENCE
DROP TABLE IF EXISTS `work_evidence`;
CREATE TABLE `work_evidence` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `project_id` BIGINT UNSIGNED NOT NULL,
  `worker_profile_id` BIGINT UNSIGNED NOT NULL,
  `attendance_id` BIGINT UNSIGNED NULL,
  `milestone_id` BIGINT UNSIGNED NULL,
  `image_url` VARCHAR(255) NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `notes` TEXT NULL,
  `verified` BOOLEAN DEFAULT TRUE,
  `date` VARCHAR(50) DEFAULT 'Today',
  `timestamp_str` VARCHAR(20) DEFAULT '10:42 AM',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_we_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_we_worker` FOREIGN KEY (`worker_profile_id`) REFERENCES `worker_profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 18. WORK_PASSPORTS
DROP TABLE IF EXISTS `work_passports`;
CREATE TABLE `work_passports` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `worker_profile_id` BIGINT UNSIGNED NOT NULL UNIQUE,
  `qr_code_hash` VARCHAR(255) NOT NULL,
  `quality_score` DECIMAL(3,2) DEFAULT 4.90,
  `punctuality_score` DECIMAL(3,2) DEFAULT 4.70,
  `reliability_score` DECIMAL(3,2) DEFAULT 4.80,
  `completion_score` DECIMAL(3,2) DEFAULT 4.90,
  `client_payment_score` DECIMAL(3,2) DEFAULT 4.90,
  `client_site_score` DECIMAL(3,2) DEFAULT 4.70,
  `client_clarity_score` DECIMAL(3,2) DEFAULT 4.80,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_pass_worker` FOREIGN KEY (`worker_profile_id`) REFERENCES `worker_profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 19. REVIEWS
DROP TABLE IF EXISTS `reviews`;
CREATE TABLE `reviews` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `project_id` BIGINT UNSIGNED NOT NULL,
  `reviewer_user_id` BIGINT UNSIGNED NOT NULL,
  `reviewee_user_id` BIGINT UNSIGNED NOT NULL,
  `rating` DECIMAL(3,2) NOT NULL,
  `comment` TEXT NOT NULL,
  `review_type` ENUM('client_to_worker', 'worker_to_client') DEFAULT 'client_to_worker',
  `is_verified` BOOLEAN DEFAULT TRUE,
  `status` ENUM('published', 'flagged', 'hidden') DEFAULT 'published',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_rev_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_rev_reviewer` FOREIGN KEY (`reviewer_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_rev_reviewee` FOREIGN KEY (`reviewee_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 20. PAYMENTS
DROP TABLE IF EXISTS `payments`;
CREATE TABLE `payments` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `project_id` BIGINT UNSIGNED NOT NULL,
  `milestone_id` BIGINT UNSIGNED NULL,
  `payer_user_id` BIGINT UNSIGNED NOT NULL,
  `payee_user_id` BIGINT UNSIGNED NOT NULL,
  `amount` DECIMAL(12,2) NOT NULL,
  `status` ENUM('pending', 'held_in_escrow', 'released', 'refunded') DEFAULT 'held_in_escrow',
  `utr_number` VARCHAR(100) DEFAULT 'UPI/NIRM/93847291',
  `payment_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_pay_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pay_payer` FOREIGN KEY (`payer_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pay_payee` FOREIGN KEY (`payee_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 21. NOTIFICATIONS
DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `message` TEXT NOT NULL,
  `type` ENUM('job', 'job_application', 'milestone', 'checkin', 'passport', 'review', 'system') DEFAULT 'system',
  `reference_type` VARCHAR(50) NULL,
  `reference_id` BIGINT UNSIGNED NULL,
  `is_read` BOOLEAN DEFAULT FALSE,
  `link` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_notif_user (`user_id`),
  INDEX idx_notif_type (`type`),
  CONSTRAINT `fk_notif_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 21b. JOB_MATCHES
DROP TABLE IF EXISTS `job_matches`;
CREATE TABLE `job_matches` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `job_id` BIGINT UNSIGNED NOT NULL,
  `worker_profile_id` BIGINT UNSIGNED NOT NULL,
  `distance_km` DECIMAL(5,2) DEFAULT 0.00,
  `match_score` INT DEFAULT 90,
  `status` ENUM('MATCHED', 'VIEWED', 'APPLIED', 'REJECTED', 'EXPIRED') DEFAULT 'MATCHED',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `viewed_at` TIMESTAMP NULL,
  `responded_at` TIMESTAMP NULL,
  INDEX idx_jm_job (`job_id`),
  INDEX idx_jm_worker (`worker_profile_id`),
  INDEX idx_jm_status (`status`),
  CONSTRAINT `fk_jm_job` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_jm_worker` FOREIGN KEY (`worker_profile_id`) REFERENCES `worker_profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 22. VERIFICATION_REQUESTS
DROP TABLE IF EXISTS `verification_requests`;
CREATE TABLE `verification_requests` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `worker_profile_id` BIGINT UNSIGNED NOT NULL,
  `type` ENUM('identity', 'skills', 'documents') DEFAULT 'identity',
  `status` ENUM('pending', 'approved', 'rejected', 'needs_correction') DEFAULT 'pending',
  `document_type` VARCHAR(100) DEFAULT 'Aadhaar Card',
  `document_url` VARCHAR(255) NULL,
  `remarks` TEXT NULL,
  `reviewed_by_user_id` BIGINT UNSIGNED NULL,
  `reviewed_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_vr_worker` FOREIGN KEY (`worker_profile_id`) REFERENCES `worker_profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 23. DOCUMENTS
DROP TABLE IF EXISTS `documents`;
CREATE TABLE `documents` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `document_type` VARCHAR(100) NOT NULL,
  `document_number` VARCHAR(100) NULL,
  `file_url` VARCHAR(255) NOT NULL,
  `is_verified` BOOLEAN DEFAULT TRUE,
  `verified_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_doc_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 24. DISPUTES
DROP TABLE IF EXISTS `disputes`;
CREATE TABLE `disputes` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `project_id` BIGINT UNSIGNED NOT NULL,
  `raised_by_user_id` BIGINT UNSIGNED NOT NULL,
  `against_user_id` BIGINT UNSIGNED NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `description` TEXT NOT NULL,
  `status` ENUM('OPEN', 'INVESTIGATING', 'RESOLVED', 'ESCALATED') DEFAULT 'OPEN',
  `resolution_notes` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_disp_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_disp_raised` FOREIGN KEY (`raised_by_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_disp_against` FOREIGN KEY (`against_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 25. EMERGENCY_REPORTS
DROP TABLE IF EXISTS `emergency_reports`;
CREATE TABLE `emergency_reports` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `project_id` BIGINT UNSIGNED NULL,
  `worker_profile_id` BIGINT UNSIGNED NULL,
  `location` VARCHAR(255) NOT NULL,
  `emergency_type` VARCHAR(100) NOT NULL,
  `details` TEXT NULL,
  `status` ENUM('OPEN', 'RESPONDED', 'RESOLVED') DEFAULT 'OPEN',
  `reported_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `resolved_at` TIMESTAMP NULL,
  CONSTRAINT `fk_em_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 26. ADMIN_LOGS
DROP TABLE IF EXISTS `admin_logs`;
CREATE TABLE `admin_logs` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `admin_user_id` BIGINT UNSIGNED NOT NULL,
  `action` VARCHAR(100) NOT NULL,
  `target_type` VARCHAR(100) NOT NULL,
  `target_id` BIGINT UNSIGNED NULL,
  `details` TEXT NULL,
  `ip_address` VARCHAR(50) DEFAULT '127.0.0.1',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_al_admin` FOREIGN KEY (`admin_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;


-- ========================================================
-- SEED DATA
-- ========================================================

-- Roles
INSERT INTO `roles` (`id`, `name`, `slug`, `description`) VALUES
(1, 'Super Admin', 'SUPER_ADMIN', 'Platform control centre & governance'),
(2, 'Worker', 'WORKER', 'Artisan craftsman with digital Work Passport'),
(3, 'Homeowner', 'HOMEOWNER', 'Individual site owner building or renovating'),
(4, 'Contractor', 'CONTRACTOR', 'Commercial builder managing workforce & projects'),
(5, 'Employee', 'EMPLOYEE', 'Corporate & field engineering employee');

-- 11 Seeded Professions
INSERT INTO `professions` (`id`, `name`, `slug`, `description`, `icon`, `status`) VALUES
(1, 'Mason', 'mason', 'Brickwork, structural masonry, plastering and AAC blockwork', 'BrickWall', 'active'),
(2, 'Electrician', 'electrician', 'Concealed conduit wiring, DB dressing, solar and fixture installation', 'Zap', 'active'),
(3, 'Plumber', 'plumber', 'CPVC sanitary piping, leakage repair, water tank and drainage fitting', 'Droplets', 'active'),
(4, 'Carpenter', 'carpenter', 'Wood framing, modular kitchen, door shutters and custom furniture', 'Hammer', 'active'),
(5, 'Painter', 'painter', 'Interior wall finish, exterior emulsion, texture coat and waterproofing', 'Paintbrush', 'active'),
(6, 'Tile Worker', 'tile-worker', 'Anti-skid floor vitrified tiling, wall dado and granite counter laying', 'Grid', 'active'),
(7, 'Welder', 'welder', 'Metal gate fabrication, MS structure welding and railing alignment', 'Flame', 'active'),
(8, 'HVAC Technician', 'hvac', 'Split AC copper piping, central chiller ducting and gas charging', 'Wind', 'active'),
(9, 'Roofer', 'roofer', 'Shed roofing, tar felting, ridge tile laying and metal truss erection', 'Home', 'active'),
(10, 'Flooring Worker', 'flooring', 'Italian marble polishing, granite floor laying and vinyl installation', 'Layers', 'active'),
(11, 'General Helper', 'helper', 'Cement mortar mixing, site debris clearing and raw material staging', 'HardHat', 'active');

-- Skills per Profession
INSERT INTO `skills` (`id`, `profession_id`, `name`, `slug`, `description`) VALUES
(1, 1, 'Brickwork', 'brickwork', 'Clay brick and fly-ash brick laying'),
(2, 1, 'Plaster', 'plaster', 'Smooth wall sand-cement plaster finish'),
(3, 1, 'RCC Work', 'rcc-work', 'Reinforced cement concrete casting'),
(4, 1, 'Blockwork', 'blockwork', 'AAC lightweight masonry block jointing'),
(5, 1, 'Foundation', 'foundation', 'Excavation footing and damp proof course'),
(6, 2, 'Conduit Wiring', 'conduit-wiring', 'Concealed PVC pipe copper cable pulling'),
(7, 2, 'DB Installation', 'db-installation', 'Distribution board and MCB dressing'),
(8, 2, 'CCTV & Intercom', 'cctv', 'Security camera and door phone setup'),
(9, 2, 'Solar Setup', 'solar', 'Rooftop solar panel inverter connection'),
(10, 2, 'AC Wiring', 'ac-wiring', 'Dedicated 16A power line installation'),
(11, 3, 'Pipe Fitting', 'pipe-fitting', 'Concealed CPVC/UPVC water line connections'),
(12, 3, 'Bathroom Sanitary', 'sanitary', 'Wall-hung commode and diverter installation'),
(13, 3, 'Water Tank', 'water-tank', 'Overhead loft tank and motor booster setup'),
(14, 3, 'Drainage', 'drainage', 'SWR soil and waste pipe slope laying'),
(15, 3, 'Leak Repair', 'leak-repair', 'Pressure pump testing and leak rectification'),
(16, 4, 'Modular Kitchen', 'modular-kitchen', 'Cabinet carcass assembly and hinge fixing'),
(17, 4, 'Door Shutters', 'doors', 'Flush door and teak frame hanging'),
(18, 4, 'Custom Furniture', 'furniture', 'Wardrobes, bed boxes and study units'),
(19, 4, 'Wood Repair', 'wood-repair', 'Chipped veneer and laminate restoration'),
(20, 5, 'Interior Emulsion', 'interior-emulsion', 'Putty sanding and acrylic emulsion rolling'),
(21, 5, 'Exterior Weather-Proof', 'exterior', 'Silicon weatherproof facade painting'),
(22, 5, 'Texture Finish', 'texture', 'Stucco and designer stencil wall texture'),
(23, 5, 'Waterproofing', 'waterproofing', 'Liquid membrane brush application'),
(24, 6, 'Vitrified Floor Tiles', 'floor-tiles', 'Laser aligned 600x1200mm floor tiling'),
(25, 6, 'Bathroom Wall Dado', 'wall-dado', 'Full height glazed ceramic dado fixing'),
(26, 6, 'Granite Countertops', 'granite', 'Kitchen platform bullnosing and polish'),
(27, 6, 'Anti-Skid Gradient', 'anti-skid', 'Shower area slope water runoff levelling'),
(28, 7, 'MS Gate Fabrication', 'gate-work', 'Ornamental main gate welding and hinge fit'),
(29, 7, 'Structural Welding', 'structural-welding', 'Heavy I-beam and channel arc welding'),
(30, 7, 'Railing Alignment', 'railing', 'Balcony safety grill and SS pipe welding'),
(31, 8, 'Split AC Installation', 'split-ac', 'Copper piping flare and indoor unit mount'),
(32, 8, 'Gas Charging', 'gas-charging', 'R32 / R410A refrigerant vacuum and refill'),
(33, 8, 'Ducting & Maintenance', 'ducting', 'Galvanized iron sheet ducting and coil wash'),
(34, 9, 'Profile Sheet Roofing', 'sheet-roofing', 'Color coated steel sheet self-drilling fix'),
(35, 9, 'Waterproofing Coat', 'roof-waterproofing', 'App membrane heat torch application'),
(36, 9, 'Clay Tile Laying', 'clay-tiles', 'Mangalore terracotta ridge tile mortar fixing'),
(37, 10, 'Italian Marble Polish', 'marble-polish', 'Diamond abrasive pad diamond crystallization'),
(38, 10, 'Kota Stone Laying', 'kota-stone', 'Zero joint natural green stone flooring');

-- Seed Users with REAL Unique Registration IDs (WRK-*, CLI-*, CON-*, EMP-*, ADM-*)
-- Password for all demo accounts: Admin@123 (hashed with BCRYPT)
INSERT INTO `users` (`id`, `registration_id`, `role`, `role_id`, `full_name`, `name`, `email`, `phone`, `password_hash`, `profile_photo`, `avatar`, `status`) VALUES
(1, 'ADM-000001', 'admin', 1, 'Super Administrator', 'Super Administrator', 'admin@nirmaan.local', '9999900001', '$2y$10$fGgN7r6E1.yG4uY6Kk8zIeg5tW/Fq1j6.Z6hPkWf5dIqQG5bTqOia', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&h=400&q=80', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&h=400&q=80', 'active'),
(2, 'WRK-000001', 'worker', 2, 'Ramesh Kumar', 'Ramesh Kumar', 'ramesh@nirmaan.local', '9876543210', '$2y$10$fGgN7r6E1.yG4uY6Kk8zIeg5tW/Fq1j6.Z6hPkWf5dIqQG5bTqOia', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&h=400&q=80', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&h=400&q=80', 'active'),
(3, 'WRK-000002', 'worker', 2, 'Sunil Yadav', 'Sunil Yadav', 'sunil@nirmaan.local', '9876543211', '$2y$10$fGgN7r6E1.yG4uY6Kk8zIeg5tW/Fq1j6.Z6hPkWf5dIqQG5bTqOia', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=400&q=80', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=400&q=80', 'active'),
(4, 'WRK-000003', 'worker', 2, 'Amit Kumar', 'Amit Kumar', 'amit@nirmaan.local', '9876543212', '$2y$10$fGgN7r6E1.yG4uY6Kk8zIeg5tW/Fq1j6.Z6hPkWf5dIqQG5bTqOia', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&h=400&q=80', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&h=400&q=80', 'active'),
(5, 'WRK-000004', 'worker', 2, 'Rajesh Verma', 'Rajesh Verma', 'rajesh@nirmaan.local', '9876543213', '$2y$10$fGgN7r6E1.yG4uY6Kk8zIeg5tW/Fq1j6.Z6hPkWf5dIqQG5bTqOia', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80', 'active'),
(6, 'WRK-000005', 'worker', 2, 'Pooja Sharma', 'Pooja Sharma', 'pooja@nirmaan.local', '9876543214', '$2y$10$fGgN7r6E1.yG4uY6Kk8zIeg5tW/Fq1j6.Z6hPkWf5dIqQG5bTqOia', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=400&q=80', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=400&q=80', 'active'),
(7, 'WRK-000006', 'worker', 2, 'Mohan Singh', 'Mohan Singh', 'mohan@nirmaan.local', '9876543215', '$2y$10$fGgN7r6E1.yG4uY6Kk8zIeg5tW/Fq1j6.Z6hPkWf5dIqQG5bTqOia', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&h=400&q=80', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&h=400&q=80', 'active'),
(8, 'WRK-000007', 'worker', 2, 'Vikas Kumar', 'Vikas Kumar', 'vikas@nirmaan.local', '9876543216', '$2y$10$fGgN7r6E1.yG4uY6Kk8zIeg5tW/Fq1j6.Z6hPkWf5dIqQG5bTqOia', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&h=400&q=80', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&h=400&q=80', 'active'),
(9, 'CLI-000001', 'client', 3, 'Priya Sharma (Homeowner)', 'Priya Sharma (Homeowner)', 'priya@gmail.com', '9812345678', '$2y$10$fGgN7r6E1.yG4uY6Kk8zIeg5tW/Fq1j6.Z6hPkWf5dIqQG5bTqOia', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80', 'active'),
(10, 'CON-000001', 'contractor', 4, 'Sharma Infrastructure (Contractor)', 'Sharma Infrastructure (Contractor)', 'vikram@sharma-infra.com', '9898989898', '$2y$10$fGgN7r6E1.yG4uY6Kk8zIeg5tW/Fq1j6.Z6hPkWf5dIqQG5bTqOia', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&h=400&q=80', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&h=400&q=80', 'active'),
(11, 'EMP-000001', 'employee', 5, 'Anil Saxena (Site Engineer)', 'Anil Saxena (Site Engineer)', 'anil@nirmaan.local', '9811122299', '$2y$10$fGgN7r6E1.yG4uY6Kk8zIeg5tW/Fq1j6.Z6hPkWf5dIqQG5bTqOia', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80', 'active');

-- Worker Profiles
INSERT INTO `worker_profiles` (`id`, `user_id`, `profession_id`, `profession`, `nirmaan_id`, `level`, `experience_years`, `years_experience`, `daily_rate`, `expected_daily_wage`, `rating`, `total_reviews`, `completed_jobs`, `is_available`, `is_verified`, `verification_status`, `bio`, `city`, `state`, `address`) VALUES
(1, 2, 1, 'Mason', 'WRK-000001', 'Level 2 Artisan', 7, 7, 850.00, 850.00, 4.80, 142, 126, 1, 1, 'verified', 'Master mason with 7 years of specialized experience in brick laying, structural AAC blockwork and bathroom vitrified tile gradient.', 'Noida', 'Uttar Pradesh', 'Sector 62, Noida, UP'),
(2, 3, 1, 'Mason', 'WRK-000002', 'Level 1 Artisan', 5, 5, 800.00, 800.00, 4.70, 94, 84, 1, 1, 'verified', 'Skilled bricklayer with precision plumb and high daily output for residential and boundary works.', 'Noida', 'Uttar Pradesh', 'Sector 76, Noida, UP'),
(3, 4, 2, 'Electrician', 'WRK-000003', 'Master Electrician', 6, 6, 900.00, 900.00, 4.90, 88, 79, 1, 1, 'verified', 'Licensed wireman expert in concealed conduit cabling, DB load balancing, and smart home inverter automation.', 'Greater Noida', 'Uttar Pradesh', 'Sector Alpha 1, Greater Noida'),
(4, 5, 3, 'Plumber', 'WRK-000004', 'Lead Plumber', 8, 8, 850.00, 850.00, 4.85, 110, 104, 1, 1, 'verified', 'Certified plumbing technician specialized in pressure concealed CPVC and sanitary diverter installation.', 'Ghaziabad', 'Uttar Pradesh', 'Indirapuram, Ghaziabad'),
(5, 6, 5, 'Painter', 'WRK-000005', 'Master Finisher', 5, 5, 800.00, 800.00, 4.75, 76, 68, 1, 1, 'verified', 'Texture artist and waterproofing specialist with expert surface putty prep and airless spray capability.', 'Delhi NCR', 'Delhi', 'Mayur Vihar Phase 1, Delhi'),
(6, 7, 4, 'Carpenter', 'WRK-000006', 'Modular Specialist', 9, 9, 950.00, 950.00, 4.90, 120, 115, 1, 1, 'verified', 'Master carpenter for modular kitchen carcass, teak frame installation, and precision wood restoration.', 'Noida', 'Uttar Pradesh', 'Sector 50, Noida'),
(7, 8, 6, 'Tile Worker', 'WRK-000007', 'Tile Specialist', 6, 6, 880.00, 880.00, 4.80, 92, 86, 1, 1, 'verified', 'Large format vitrified tile specialist with zero-gap laser levelling and Italian marble grouting expertise.', 'Noida', 'Uttar Pradesh', 'Sector 18, Noida');

-- Employee Profiles
INSERT INTO `employee_profiles` (`id`, `user_id`, `department`, `designation`, `employee_code`, `city`, `state`, `address`, `joining_date`) VALUES
(1, 11, 'Field Operations', 'Senior Site Engineer', 'EMP-000001', 'Noida', 'Uttar Pradesh', 'Tower 4, Sector 128, Noida', '2024-03-15');

-- Client Profiles
INSERT INTO `client_profiles` (`id`, `user_id`, `company_name`, `address`, `city`, `state`, `project_type`) VALUES
(1, 9, 'Priya Homeowners', 'B-42, Sector 62, Noida, Uttar Pradesh', 'Noida', 'Uttar Pradesh', 'Bathroom & Villa Renovation');

-- Homeowner Profiles
INSERT INTO `homeowner_profiles` (`id`, `user_id`, `city`, `address`, `rating`, `total_projects`) VALUES
(1, 9, 'Noida', 'B-42, Sector 62, Noida, Uttar Pradesh', 4.90, 2);

-- Contractor Profiles
INSERT INTO `contractor_profiles` (`id`, `user_id`, `company_name`, `license_number`, `specialization`, `experience_years`, `address`, `city`, `state`, `verification_status`, `gst_number`, `rating`, `total_projects`) VALUES
(1, 10, 'Sharma & Sons Infrastructure Pvt Ltd', 'PWD-A-2024-991', 'Civil & Commercial Infrastructure', 14, 'Plot 88, Okhla Industrial Area Phase 3', 'Delhi NCR', 'Delhi', 'verified', '07AABCS1429B1Z8', 4.80, 14);

-- Worker Skills Link
INSERT INTO `worker_skills` (`worker_profile_id`, `skill_id`, `is_verified`, `proficiency_level`) VALUES
(1, 1, 1, 'Expert Level'),
(1, 2, 1, 'Expert Level'),
(1, 24, 1, 'Master Level'),
(2, 1, 1, 'Verified'),
(2, 2, 1, 'Verified'),
(3, 6, 1, 'Licensed'),
(3, 7, 1, 'Master'),
(4, 11, 1, 'Certified'),
(4, 12, 1, 'Master'),
(5, 20, 1, 'Master'),
(5, 23, 1, 'Certified'),
(6, 16, 1, 'Master'),
(7, 24, 1, 'Master'),
(7, 25, 1, 'Master');

-- Projects
INSERT INTO `projects` (`id`, `name`, `category`, `client_user_id`, `contractor_user_id`, `location`, `city`, `start_date`, `progress_percent`, `budget`, `spent`, `status`, `description`) VALUES
(1, 'Bathroom Renovation', 'Renovation', 9, 10, 'B-42, Sector 62, Noida', 'Noida', '2026-09-23', 62, 45000.00, 17500.00, 'in_progress', 'Complete master bathroom overhaul: vitrified anti-skid floor tiling, concealed CPVC plumbing, and sanitary wall mounting.'),
(2, '2BHK Apartment Interior Painting', 'Painting', 9, 10, 'Tower C-402, Sector 78, Noida', 'Noida', '2026-10-05', 0, 32000.00, 0.00, 'planning', 'Full interior emulsion painting, crack filling and waterproof primer coat across 1,150 sq.ft.');

-- Jobs
INSERT INTO `jobs` (`id`, `title`, `title_hindi`, `profession_id`, `client_user_id`, `contractor_user_id`, `location`, `city`, `distance_km`, `daily_wage`, `duration_days`, `workers_needed`, `start_date`, `description`, `status`, `is_bathroom_renovation_demo`) VALUES
(1, 'Master Mason for Bathroom Renovation', 'बाथरूम नवीनीकरण हेतु राजमिस्त्री', 1, 9, 10, 'Sector 62, Noida', 'Noida', 3.2, 850.00, 6, 1, 'Tomorrow', 'Brickwork dismantling, wall levelling, cement mortar rendering, and floor leveling.', 'accepted', 1),
(2, 'Master Mason + Helper Pair', 'राजमिस्त्री + सहायक जोड़ी', 1, 9, 10, 'Sector 76, Noida', 'Noida', 1.8, 1600.00, 7, 2, 'Monday', 'Boundary wall blockwork, mortar mixing, and RCC beam jointing.', 'open', 0),
(3, 'Concealed Wiring & DB Setup', 'कंसील्ड वायरिंग एवं डीबी सेटअप', 2, 9, 10, 'Sector 50, Noida', 'Noida', 4.5, 900.00, 5, 1, 'Next Week', 'PVC conduit pulling, modular switch plate fitting and distribution box MCB load balance.', 'open', 0),
(4, 'Bathroom Diverter & CPVC Plumbing', 'बाथरूम डाइवरटर एवं प्लंबिंग', 3, 9, 10, 'Sector 62, Noida', 'Noida', 2.1, 850.00, 4, 1, 'Tomorrow', 'Hot & cold concealed CPVC piping, wall-hung commode bracket, and pressure testing.', 'accepted', 1),
(5, 'Interior Acrylic Emulsion Painting', 'इंटीरियर ऐक्रेलिक पेंटिंग', 5, 9, 10, 'Indirapuram, Ghaziabad', 'Ghaziabad', 5.2, 800.00, 6, 2, 'Wednesday', 'Putty sanding, primer coat, and 2 coats of premium washable emulsion on all walls.', 'open', 0),
(6, 'Modular Kitchen Carcass Assembly', 'मॉड्यूलर किचन कैबिनेट असेंबली', 4, 9, 10, 'Sector 18, Noida', 'Noida', 3.7, 950.00, 4, 1, 'Friday', 'HDHMR board kitchen carcass fitting, soft-close hydraulic hinges, and drawer channel fix.', 'open', 0);

-- Project Workers
INSERT INTO `project_workers` (`id`, `project_id`, `worker_profile_id`, `role_trade`, `daily_wage`, `status`) VALUES
(1, 1, 1, 'Master Mason & Lead Tiler', 850.00, 'active'),
(2, 1, 4, 'Plumbing Specialist', 850.00, 'active'),
(3, 1, 7, 'Tile Specialist', 880.00, 'active');

-- Attendance
INSERT INTO `attendance` (`id`, `project_id`, `worker_profile_id`, `check_in_time`, `check_out_time`, `location_lat`, `location_lng`, `location_verified`, `progress_percent`, `date`, `status`) VALUES
(1, 1, 1, '09:02 AM', NULL, 28.6284540, 77.3769440, 1, 80, CURDATE(), 'checked_in'),
(2, 1, 4, '08:55 AM', '05:30 PM', 28.6284540, 77.3769440, 1, 100, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'day_completed');

-- Milestones
INSERT INTO `milestones` (`id`, `project_id`, `worker_profile_id`, `title`, `trade`, `amount`, `progress_threshold`, `status`, `note`, `completion_date`) VALUES
(1, 1, 4, 'Concealed CPVC Plumbing & Drainage', 'Plumbing', 5100.00, 100, 'approved', 'Pressure tested up to 10 kg/cm2 with zero drop. Completed cleanly.', '24 Sept 2026'),
(2, 1, 1, 'Vitrified Wall & Floor Tiling', 'Tile & Masonry', 6500.00, 100, 'pending', 'Anti-skid floor gradient tested with laser level. 4 photo proofs uploaded.', 'Today'),
(3, 1, 7, 'Sanitaryware & Fixture Final Mounting', 'Sanitary', 5900.00, 0, 'pending', 'Scheduled upon tile grout curing.', 'Pending');

-- Work Evidence
INSERT INTO `work_evidence` (`id`, `project_id`, `worker_profile_id`, `attendance_id`, `milestone_id`, `image_url`, `title`, `notes`, `verified`, `date`, `timestamp_str`) VALUES
(1, 1, 1, 1, 2, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80', 'Anti-skid Floor Tile Laser Alignment', 'Zero lippage laser verified across 600x1200 vitrified slabs.', 1, 'Today', '10:42 AM'),
(2, 1, 1, 1, 2, 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=600&q=80', 'Drainage Gradient Level Check', 'Water slope directed cleanly to concealed stainless drain grating.', 1, 'Today', '11:15 AM'),
(3, 1, 4, 2, 1, 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=600&q=80', 'Concealed CPVC Pipe Pressure Test', 'Pipes hydro-tested under 8 bar pressure.', 1, 'Yesterday', '04:20 PM'),
(4, 1, 1, NULL, NULL, 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=80', 'Wall Chemical Water-Proofing Primer', 'Two-layer polymer slurry coat before tiling.', 1, '23 Sept 2026', '02:00 PM');

-- Work Passports
INSERT INTO `work_passports` (`worker_profile_id`, `qr_code_hash`, `quality_score`, `punctuality_score`, `reliability_score`, `completion_score`, `client_payment_score`, `client_site_score`, `client_clarity_score`) VALUES
(1, 'NRM-PASSPORT-RAMESH-8492-HASHED', 4.90, 4.70, 4.80, 4.90, 4.90, 4.70, 4.80),
(2, 'NRM-PASSPORT-SUNIL-1102-HASHED', 4.70, 4.80, 4.70, 4.80, 4.80, 4.60, 4.70),
(3, 'NRM-PASSPORT-AMIT-5582-HASHED', 4.95, 4.90, 4.90, 4.95, 4.90, 4.80, 4.90),
(4, 'NRM-PASSPORT-RAJESH-3391-HASHED', 4.85, 4.75, 4.85, 4.90, 4.95, 4.70, 4.80),
(5, 'NRM-PASSPORT-POOJA-7714-HASHED', 4.80, 4.70, 4.75, 4.80, 4.85, 4.70, 4.80),
(6, 'NRM-PASSPORT-MOHAN-4490-HASHED', 4.90, 4.85, 4.90, 4.95, 4.90, 4.75, 4.85),
(7, 'NRM-PASSPORT-VIKAS-6621-HASHED', 4.85, 4.80, 4.80, 4.85, 4.90, 4.70, 4.80);

-- Reviews
INSERT INTO `reviews` (`project_id`, `reviewer_user_id`, `reviewee_user_id`, `rating`, `comment`, `review_type`, `is_verified`, `status`) VALUES
(1, 9, 2, 5.00, 'Ramesh has exceptional alignment skills for vitrified tiles and maintained spotless site discipline throughout the renovation.', 'client_to_worker', 1, 'published'),
(1, 2, 9, 4.90, 'Dr. Sharma is very supportive. He provides timely payments on approved milestones and keeps materials ready on site.', 'worker_to_client', 1, 'published'),
(1, 9, 5, 4.80, 'Rajesh completed concealed plumbing within 2 days with zero leakages. Highly recommended.', 'client_to_worker', 1, 'published');

-- Payments
INSERT INTO `payments` (`project_id`, `milestone_id`, `payer_user_id`, `payee_user_id`, `amount`, `status`, `utr_number`) VALUES
(1, 1, 9, 5, 5100.00, 'released', 'UPI/NIRM/93847291'),
(1, 2, 9, 2, 6500.00, 'held_in_escrow', 'ESCROW/NIRM/81923019');

-- Notifications
INSERT INTO `notifications` (`user_id`, `title`, `message`, `type`, `is_read`, `link`) VALUES
(2, 'Tile Milestone Ready for Approval', 'You have uploaded 4 site photos for Tile Work at Sharma Residence.', 'milestone', 0, '/worker/work'),
(9, 'Worker Checked In', 'Ramesh Kumar checked in on-site at 09:02 AM with GPS verification.', 'checkin', 0, '/homeowner/project/1'),
(1, 'New Worker Verification Pending', 'Ramesh Kumar submitted Level 2 Masonry credentials for review.', 'passport', 0, '/admin/verification');

-- Verification Requests
INSERT INTO `verification_requests` (`worker_profile_id`, `type`, `status`, `document_type`, `document_url`, `remarks`) VALUES
(1, 'identity', 'approved', 'Aadhaar Card', 'https://nirmaan.local/docs/aadhaar_ramesh.pdf', 'UIDAI biometric hash verified'),
(1, 'skills', 'approved', 'NSDC Masonry Certification', 'https://nirmaan.local/docs/nsdc_cert_ramesh.pdf', 'Level 2 Master Craftsman certified'),
(2, 'identity', 'approved', 'Aadhaar Card', 'https://nirmaan.local/docs/aadhaar_sunil.pdf', 'Identity verified'),
(3, 'skills', 'pending', 'State Wireman License', 'https://nirmaan.local/docs/wireman_amit.pdf', 'Pending inspection by electrical supervisor');

-- Documents
INSERT INTO `documents` (`user_id`, `document_type`, `document_number`, `file_url`, `is_verified`) VALUES
(2, 'Aadhaar Card', 'XXXXXXXX4921', 'https://nirmaan.local/docs/aadhaar_ramesh.pdf', 1),
(2, 'Skill Certificate', 'NSDC-MAS-2024-88', 'https://nirmaan.local/docs/nsdc_cert_ramesh.pdf', 1),
(9, 'Property Registration', 'REG-UP-NOIDA-42', 'https://nirmaan.local/docs/deed_sharma.pdf', 1),
(10, 'GST Registration', '07AABCS1429B1Z8', 'https://nirmaan.local/docs/gst_sharma_sons.pdf', 1);

-- Disputes
INSERT INTO `disputes` (`project_id`, `raised_by_user_id`, `against_user_id`, `category`, `description`, `status`, `resolution_notes`) VALUES
(1, 9, 2, 'Material Specification', 'Clarification needed on epoxy grout color matching with bathroom tile accent.', 'RESOLVED', 'Mutual agreement reached: ivory epoxy grout selected and applied.');

-- Emergency Reports
INSERT INTO `emergency_reports` (`user_id`, `project_id`, `worker_profile_id`, `location`, `emergency_type`, `details`, `status`) VALUES
(2, 1, 1, 'Sector 62, Noida (Sharma Residence)', 'First Aid / Hand Abrasion', 'Minor tile edge abrasion. First aid kit on site applied. Worker resumed safely.', 'RESOLVED');

-- Admin Logs
INSERT INTO `admin_logs` (`admin_user_id`, `action`, `target_type`, `target_id`, `details`) VALUES
(1, 'SYSTEM_INITIALIZE', 'DATABASE', 1, 'Imported nirmaan_db schema with real registration IDs and normalized tables.');
