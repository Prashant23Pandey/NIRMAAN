<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../middleware/auth.php';

$user = requireAuth(['SUPER_ADMIN']);

$input = getJsonInput();
$professionId = intval($input['profession_id'] ?? 0);
$name = trim($input['name'] ?? '');
$slug = trim($input['slug'] ?? strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', $name)));
$description = trim($input['description'] ?? '');

if (!$professionId || empty($name)) {
    sendJsonResponse(['success' => false, 'error' => 'Profession ID and Skill name are required'], 400);
}

$pdo = getDbConnection();

try {
    $stmt = $pdo->prepare("
        INSERT INTO skills (profession_id, name, slug, description, status)
        VALUES (?, ?, ?, ?, 'active')
    ");
    $stmt->execute([$professionId, $name, $slug, $description]);
    $newId = $pdo->lastInsertId();

    $log = $pdo->prepare("INSERT INTO admin_logs (admin_user_id, action, target_type, target_id, details) VALUES (?, 'CREATE_SKILL', 'SKILL', ?, ?)");
    $log->execute([$user['id'], $newId, "Added skill: $name to profession ID: $professionId"]);

    sendJsonResponse([
        'success' => true,
        'message' => 'Skill created successfully',
        'skill_id' => $newId
    ]);
} catch (Exception $e) {
    sendJsonResponse(['success' => false, 'error' => 'Error: ' . $e->getMessage()], 500);
}
