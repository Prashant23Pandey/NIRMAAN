<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../middleware/auth.php';

// Super admin permission check
$user = requireAuth(['SUPER_ADMIN']);

$input = getJsonInput();
$name = trim($input['name'] ?? '');
$slug = trim($input['slug'] ?? strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', $name)));
$description = trim($input['description'] ?? '');
$icon = trim($input['icon'] ?? 'Hammer');

if (empty($name)) {
    sendJsonResponse(['success' => false, 'error' => 'Profession name is required'], 400);
}

$pdo = getDbConnection();

try {
    $stmt = $pdo->prepare("
        INSERT INTO professions (name, slug, description, icon, status)
        VALUES (?, ?, ?, ?, 'active')
    ");
    $stmt->execute([$name, $slug, $description, $icon]);
    $newId = $pdo->lastInsertId();

    // Log admin action
    $log = $pdo->prepare("INSERT INTO admin_logs (admin_user_id, action, target_type, target_id, details) VALUES (?, 'CREATE_PROFESSION', 'PROFESSION', ?, ?)");
    $log->execute([$user['id'], $newId, "Added new profession: $name"]);

    sendJsonResponse([
        'success' => true,
        'message' => 'Profession created successfully and now available across platform',
        'profession_id' => $newId
    ]);
} catch (Exception $e) {
    sendJsonResponse(['success' => false, 'error' => 'Error: ' . $e->getMessage()], 500);
}
