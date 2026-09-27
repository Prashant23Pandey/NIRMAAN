<?php
require_once __DIR__ . '/config/database.php';

try {
    $db = getDB();

    // 1. Ensure worker_profiles has document columns
    $cols = $db->query("DESCRIBE worker_profiles")->fetchAll(PDO::FETCH_COLUMN);
    if (!in_array('document_type', $cols)) {
        $db->exec("ALTER TABLE worker_profiles ADD COLUMN document_type VARCHAR(100) NULL AFTER bio");
        echo "Added document_type to worker_profiles.\n";
    }
    if (!in_array('document_number', $cols)) {
        $db->exec("ALTER TABLE worker_profiles ADD COLUMN document_number VARCHAR(100) NULL AFTER document_type");
        echo "Added document_number to worker_profiles.\n";
    }
    if (!in_array('document_url', $cols)) {
        $db->exec("ALTER TABLE worker_profiles ADD COLUMN document_url VARCHAR(255) NULL AFTER document_number");
        echo "Added document_url to worker_profiles.\n";
    }

    // 2. Ensure contractor_profiles has document columns
    $cCols = $db->query("DESCRIBE contractor_profiles")->fetchAll(PDO::FETCH_COLUMN);
    if (!in_array('document_url', $cCols)) {
        $db->exec("ALTER TABLE contractor_profiles ADD COLUMN document_url VARCHAR(255) NULL AFTER verification_status");
        echo "Added document_url to contractor_profiles.\n";
    }

    // 3. Ensure documents table exists
    $db->exec("
        CREATE TABLE IF NOT EXISTS documents (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            user_id BIGINT UNSIGNED NOT NULL,
            document_type VARCHAR(100) NOT NULL,
            document_number VARCHAR(100) NULL,
            file_url VARCHAR(255) NOT NULL,
            is_verified BOOLEAN DEFAULT TRUE,
            verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT fk_doc_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    // 4. Ensure verification_requests table exists
    $db->exec("
        CREATE TABLE IF NOT EXISTS verification_requests (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            worker_profile_id BIGINT UNSIGNED NOT NULL,
            type ENUM('identity', 'skills', 'documents') DEFAULT 'identity',
            status ENUM('pending', 'approved', 'rejected', 'needs_correction') DEFAULT 'pending',
            document_type VARCHAR(100) DEFAULT 'Aadhaar Card',
            document_url VARCHAR(255) NULL,
            remarks TEXT NULL,
            reviewed_by_user_id BIGINT UNSIGNED NULL,
            reviewed_at TIMESTAMP NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT fk_vr_worker FOREIGN KEY (worker_profile_id) REFERENCES worker_profiles (id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    // 5. Ensure uploads/documents directory exists
    $docsDir = __DIR__ . '/uploads/documents/';
    if (!is_dir($docsDir)) {
        mkdir($docsDir, 0777, true);
    }

    echo "Migration completed successfully!\n";
} catch (Exception $e) {
    echo "Migration error: " . $e->getMessage() . "\n";
    exit(1);
}
