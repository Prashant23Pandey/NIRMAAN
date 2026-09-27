<?php
require_once __DIR__ . '/config/database.php';
$db = getDbConnection();

echo "=== ALL USERS ===\n";
$users = $db->query("SELECT id, registration_id, role_id, full_name, email, phone, status FROM users ORDER BY id")->fetchAll(PDO::FETCH_ASSOC);
foreach ($users as $u) {
    echo "  id={$u['id']} role_id={$u['role_id']} name='{$u['full_name']}' email={$u['email']} status={$u['status']}\n";
}

echo "\n=== ALL PROJECTS ===\n";
$projects = $db->query("SELECT p.*, u.full_name as client_name, u.email as client_email FROM projects p LEFT JOIN users u ON u.id = p.client_user_id ORDER BY p.id")->fetchAll(PDO::FETCH_ASSOC);
foreach ($projects as $p) {
    echo "  id={$p['id']} name='{$p['name']}' client_user_id={$p['client_user_id']} client='{$p['client_name']}' status={$p['status']} location='{$p['location']}'\n";
}

echo "\n=== ALL WORKER PROFILES ===\n";
$wps = $db->query("SELECT wp.id, wp.user_id, wp.nirmaan_id, p.name as profession, wp.city, wp.verification_status, wp.rating FROM worker_profiles wp LEFT JOIN professions p ON p.id = wp.profession_id ORDER BY wp.id")->fetchAll(PDO::FETCH_ASSOC);
foreach ($wps as $wp) {
    echo "  id={$wp['id']} user_id={$wp['user_id']} nirmaan_id={$wp['nirmaan_id']} profession={$wp['profession']} city={$wp['city']}\n";
}

echo "\n=== HOMEOWNER PROFILES ===\n";
$hps = $db->query("SELECT hp.*, u.full_name, u.email FROM homeowner_profiles hp LEFT JOIN users u ON u.id = hp.user_id ORDER BY hp.id")->fetchAll(PDO::FETCH_ASSOC);
foreach ($hps as $hp) {
    echo "  id={$hp['id']} user_id={$hp['user_id']} name='{$hp['full_name']}' email={$hp['email']} city={$hp['city']}\n";
}
