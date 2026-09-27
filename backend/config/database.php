<?php
/**
 * NIRMAAN 2.0 Database Connection
 * PDO with configurable WAMP/MySQL environment constants
 */

define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('DB_NAME') ?: 'nirmaan_db');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASSWORD', getenv('DB_PASSWORD') ?: '');
define('DB_PORT', getenv('DB_PORT') ?: '3306');

function getDbConnection() {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];
        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASSWORD, $options);
        } catch (PDOException $e) {
            http_response_code(500);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'success' => false,
                'error' => 'Database connection failed: ' . $e->getMessage(),
                'message' => 'Database connection failed. Ensure MySQL service is running on port ' . DB_PORT . ' and database ' . DB_NAME . ' exists.',
                'hint' => 'Ensure WAMP / MySQL service is running on ' . DB_HOST . ':' . DB_PORT . ' and database nirmaan_db is imported.'
            ]);
            exit;
        }
    }
    return $pdo;
}

function getDB() {
    return getDbConnection();
}

function sendJsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    exit;
}

function getJsonInput() {
    $raw = file_get_contents('php://input');
    if (!$raw) {
        return $_POST;
    }
    $decoded = json_decode($raw, true);
    if (is_array($decoded) && !empty($decoded)) {
        return $decoded;
    }
    return !empty($_POST) ? $_POST : (is_array($decoded) ? $decoded : []);
}
