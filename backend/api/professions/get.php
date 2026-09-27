<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';

$slug = $_GET['slug'] ?? $_GET['id'] ?? '';

if (empty($slug)) {
    sendJsonResponse(['success' => false, 'error' => 'Profession slug or ID is required'], 400);
}

$pdo = getDbConnection();

$stmt = $pdo->prepare("
    SELECT p.*,
        (SELECT COUNT(*) FROM worker_profiles wp WHERE wp.profession_id = p.id) as worker_count,
        (SELECT COUNT(*) FROM jobs j WHERE j.profession_id = p.id AND j.status = 'open') as open_jobs_count
    FROM professions p
    WHERE p.slug = ? OR p.id = ?
    LIMIT 1
");
$stmt->execute([$slug, $slug]);
$profession = $stmt->fetch();

if (!$profession) {
    sendJsonResponse(['success' => false, 'error' => 'Profession not found'], 404);
}

// Fetch skills for this profession
$stmt = $pdo->prepare("SELECT * FROM skills WHERE profession_id = ? AND status = 'active'");
$stmt->execute([$profession['id']]);
$skills = $stmt->fetchAll();

$profession['skills'] = $skills;

sendJsonResponse([
    'success' => true,
    'profession' => $profession
]);
