<?php
require_once __DIR__ . '/config/database.php';

try {
    $pdo = getDbConnection();
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);

    echo "=== TABLES IN nirmaan_db ===\n";
    foreach ($tables as $table) {
        $count = $pdo->query("SELECT COUNT(*) FROM `{$table}`")->fetchColumn();
        echo str_pad($table, 25) . " : " . $count . " rows\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
