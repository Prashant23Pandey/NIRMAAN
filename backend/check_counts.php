<?php
require_once __DIR__ . '/config/database.php';
$db = getDbConnection();
$tables = [
    'roles', 'professions', 'skills',
    'users', 'worker_profiles', 'homeowner_profiles', 'contractor_profiles',
    'jobs', 'job_matches', 'job_applications', 'projects', 'project_workers',
    'work_evidence', 'reviews', 'payments', 'notifications', 'attendance', 'work_passports'
];
foreach ($tables as $t) {
    try {
        $stmt = $db->query("SELECT COUNT(*) as c FROM `{$t}`");
        $c = $stmt->fetch(PDO::FETCH_ASSOC)['c'];
        echo "{$t}: {$c}\n";
    } catch (Exception $e) {
        echo "{$t}: ERROR - " . $e->getMessage() . "\n";
    }
}
