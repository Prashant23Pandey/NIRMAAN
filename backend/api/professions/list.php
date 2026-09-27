<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';

$pdo = getDbConnection();

$stmt = $pdo->query("
    SELECT 
        p.*,
        (SELECT COUNT(*) FROM worker_profiles wp WHERE wp.profession_id = p.id) as worker_count,
        (SELECT COUNT(*) FROM jobs j WHERE j.profession_id = p.id AND j.status = 'open') as open_jobs_count,
        (SELECT COUNT(*) FROM jobs j WHERE j.profession_id = p.id AND j.status = 'completed') as completed_jobs_count
    FROM professions p
    ORDER BY p.id ASC
");
$professions = $stmt->fetchAll();

sendJsonResponse([
    'success' => true,
    'count' => count($professions),
    'professions' => $professions
]);
