<?php
require_once __DIR__ . '/config/database.php';
$pdo = getDbConnection();
$stmt = $pdo->query("DESCRIBE worker_profiles");
print_r($stmt->fetchAll(PDO::FETCH_COLUMN));
