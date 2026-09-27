<?php
require_once __DIR__ . '/config/database.php';
$db = getDbConnection();

echo "=== USERS ===\n";
$users = $db->query("SELECT id, name, full_name, email, role, phone FROM users")->fetchAll(PDO::FETCH_ASSOC);
print_r($users);

echo "=== WORKER PROFILES ===\n";
$wps = $db->query("SELECT wp.id, wp.user_id, wp.profession_id, p.name as prof_name, wp.city, wp.latitude, wp.longitude FROM worker_profiles wp LEFT JOIN professions p ON wp.profession_id = p.id")->fetchAll(PDO::FETCH_ASSOC);
print_r($wps);

echo "=== JOBS ===\n";
$jobs = $db->query("SELECT id, title, profession_id, client_user_id, status, daily_wage, city, location FROM jobs")->fetchAll(PDO::FETCH_ASSOC);
print_r($jobs);

echo "=== NOTIFICATIONS ===\n";
$notifs = $db->query("SELECT id, user_id, title, message, type, is_read, created_at FROM notifications ORDER BY id DESC LIMIT 10")->fetchAll(PDO::FETCH_ASSOC);
print_r($notifs);

echo "=== PROJECTS ===\n";
$projs = $db->query("SELECT id, name, client_user_id, status, budget, spent FROM projects")->fetchAll(PDO::FETCH_ASSOC);
print_r($projs);

echo "=== PROJECT WORKERS ===\n";
$pw = $db->query("SELECT * FROM project_workers")->fetchAll(PDO::FETCH_ASSOC);
print_r($pw);
