<?php
/**
 * Safe database importer for nirmaan_db
 */
$host = getenv('DB_HOST') ?: '127.0.0.1';
$port = getenv('DB_PORT') ?: '3306';
$user = getenv('DB_USER') ?: 'root';
$pass = getenv('DB_PASSWORD') ?: '';

try {
    $pdo = new PDO("mysql:host=$host;port=$port;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
    
    echo "Connecting to MySQL server on $host:$port...\n";
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `nirmaan_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
    $pdo->exec("USE `nirmaan_db`;");
    echo "Database `nirmaan_db` ready.\n";

    $sqlFile = __DIR__ . '/../database/nirmaan.sql';
    if (!file_exists($sqlFile)) {
        die("Error: SQL file $sqlFile not found.\n");
    }

    $sql = file_get_contents($sqlFile);
    
    // Execute SQL
    $pdo->exec($sql);
    echo "Successfully imported database/nirmaan.sql!\n";

    // Verify tables
    $stmt = $pdo->query("SHOW TABLES;");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo "Total tables in nirmaan_db: " . count($tables) . "\n";
    
    // Verify users count
    $stmt = $pdo->query("SELECT COUNT(*) FROM users;");
    echo "Total seeded users: " . $stmt->fetchColumn() . "\n";

    // Show some users
    $stmt = $pdo->query("SELECT id, registration_id, role, full_name, phone FROM users LIMIT 5;");
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo " - [{$row['registration_id']}] {$row['role']}: {$row['full_name']} ({$row['phone']})\n";
    }

} catch (Exception $e) {
    echo "Database import error: " . $e->getMessage() . "\n";
    exit(1);
}
