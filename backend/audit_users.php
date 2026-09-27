<?php
require_once __DIR__ . '/config/database.php';

$pdo = getDbConnection();

echo "=== ROLES ===\n";
$stmt = $pdo->query("SELECT * FROM roles");
print_r($stmt->fetchAll(PDO::FETCH_ASSOC));

echo "=== ADMIN USERS ===\n";
$stmt = $pdo->query("SELECT id, role_id, full_name, email, phone, role FROM users WHERE role = 'admin' OR email LIKE '%admin%'");
print_r($stmt->fetchAll(PDO::FETCH_ASSOC));

echo "=== ALL USERS SUMMARY ===\n";
$stmt = $pdo->query("SELECT id, role, full_name, email, phone FROM users LIMIT 25");
print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
