<?php
require_once __DIR__ . '/config/database.php';
$db = getDbConnection();
$cols = $db->query("SHOW COLUMNS FROM users")->fetchAll(PDO::FETCH_COLUMN);
echo "users columns: " . implode(', ', $cols) . "\n";
$wpcols = $db->query("SHOW COLUMNS FROM worker_profiles")->fetchAll(PDO::FETCH_COLUMN);
echo "worker_profiles columns: " . implode(', ', $wpcols) . "\n";
$roleRow = $db->query("SELECT id, name, slug FROM roles")->fetchAll(PDO::FETCH_ASSOC);
echo "roles:\n";
foreach ($roleRow as $r) echo "  id={$r['id']} name={$r['name']} slug=" . ($r['slug'] ?? 'n/a') . "\n";
$profRow = $db->query("SELECT id, name, slug FROM professions")->fetchAll(PDO::FETCH_ASSOC);
echo "professions:\n";
foreach ($profRow as $p) echo "  id={$p['id']} name={$p['name']} slug=" . ($p['slug'] ?? 'n/a') . "\n";
