<?php
/**
 * NIRMAAN 2.0 — System Health Check Endpoint
 * GET /api/health.php
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';

$response = [
    'status' => 'error',
    'php' => true,
    'php_version' => PHP_VERSION,
    'mysql' => false,
    'database' => DB_NAME,
    'timestamp' => date('c'),
    'message' => 'Checking system components...'
];

try {
    $db = getDB();
    if ($db) {
        // Run a lightweight test query
        $stmt = $db->query("SELECT 1 AS alive");
        if ($stmt && $stmt->fetch()) {
            $response['status'] = 'ok';
            $response['mysql'] = true;
            $response['message'] = 'Nirmaan Backend & MySQL Database are operational.';
            
            // Check if tables exist
            $tableCountStmt = $db->query("SELECT count(*) FROM information_schema.tables WHERE table_schema = '" . DB_NAME . "'");
            $response['tables_count'] = (int)$tableCountStmt->fetchColumn();
            
            http_response_code(200);
        } else {
            throw new Exception("Database ping query failed");
        }
    } else {
        throw new Exception("Unable to establish PDO connection to MySQL");
    }
} catch (Exception $e) {
    http_response_code(503);
    $response['status'] = 'error';
    $response['mysql'] = false;
    $response['message'] = 'MySQL Database connection error: ' . $e->getMessage() . '. Please verify WAMP MySQL service is running and nirmaan_db is imported.';
}

echo json_encode($response, JSON_PRETTY_PRINT);
