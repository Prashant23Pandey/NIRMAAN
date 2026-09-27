<?php
/**
 * Localhost Database & API Diagnostic Test
 */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/config/database.php';

try {
    $db = getDB();
    
    // Check database connection and version
    $versionStmt = $db->query("SELECT VERSION() as mysql_version, DATABASE() as current_database");
    $dbInfo = $versionStmt->fetch(PDO::FETCH_ASSOC);
    
    // Check tables in nirmaan_db
    $tablesStmt = $db->query("SHOW TABLES");
    $tables = $tablesStmt->fetchAll(PDO::FETCH_COLUMN);
    
    // User counts
    $countsStmt = $db->query("
        SELECT 
            COUNT(*) as total_users,
            SUM(CASE WHEN role = 'worker' THEN 1 ELSE 0 END) as workers,
            SUM(CASE WHEN role = 'employee' THEN 1 ELSE 0 END) as employees,
            SUM(CASE WHEN role = 'client' THEN 1 ELSE 0 END) as clients,
            SUM(CASE WHEN role = 'contractor' THEN 1 ELSE 0 END) as contractors,
            SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admins
        FROM users
    ");
    $userStats = $countsStmt->fetch(PDO::FETCH_ASSOC);
    
    // Recent registered users sample
    $recentStmt = $db->query("
        SELECT id, registration_id, full_name, role, phone, email, status, created_at
        FROM users 
        ORDER BY id DESC 
        LIMIT 5
    ");
    $recentUsers = $recentStmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'status' => 'success',
        'message' => 'Connected successfully to MySQL on localhost!',
        'server' => [
            'php_version' => PHP_VERSION,
            'web_server' => $_SERVER['SERVER_SOFTWARE'] ?? 'Apache/WAMP',
            'mysql_version' => $dbInfo['mysql_version'] ?? 'unknown',
            'database' => $dbInfo['current_database'] ?? 'nirmaan_db',
        ],
        'database_stats' => [
            'total_tables' => count($tables),
            'tables' => $tables,
            'user_counts' => $userStats,
        ],
        'recent_users' => $recentUsers,
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Connection failed: ' . $e->getMessage(),
    ], JSON_PRETTY_PRINT);
}
