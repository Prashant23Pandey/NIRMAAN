<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';

$pdo = getDbConnection();
$professionId = isset($_GET['profession_id']) ? intval($_GET['profession_id']) : 0;
$professionSlug = $_GET['profession_slug'] ?? '';

if ($professionSlug && !$professionId) {
    $stmt = $pdo->prepare("SELECT id FROM professions WHERE slug = ?");
    $stmt->execute([$professionSlug]);
    $prof = $stmt->fetch();
    if ($prof) {
        $professionId = $prof['id'];
    }
}

if ($professionId > 0) {
    $stmt = $pdo->prepare("
        SELECT s.*, p.name as profession_name, p.slug as profession_slug
        FROM skills s
        JOIN professions p ON s.profession_id = p.id
        WHERE s.profession_id = ?
        ORDER BY s.id ASC
    ");
    $stmt->execute([$professionId]);
} else {
    $stmt = $pdo->query("
        SELECT s.*, p.name as profession_name, p.slug as profession_slug
        FROM skills s
        JOIN professions p ON s.profession_id = p.id
        ORDER BY s.profession_id ASC, s.id ASC
    ");
}

$skills = $stmt->fetchAll();

sendJsonResponse([
    'success' => true,
    'count' => count($skills),
    'skills' => $skills
]);
