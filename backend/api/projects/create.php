<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../middleware/auth.php';

$user = requireAuth(['HOMEOWNER', 'CONTRACTOR', 'SUPER_ADMIN']);

$input = getJsonInput();
$name = trim($input['name'] ?? 'Bathroom Renovation');
$category = trim($input['category'] ?? 'Renovation');
$location = trim($input['location'] ?? 'Sector 62, Noida');
$city = trim($input['city'] ?? 'Noida');
$budget = floatval($input['budget'] ?? 45000.00);
$startDate = trim($input['start_date'] ?? 'Tomorrow');
$description = trim($input['description'] ?? '');

$pdo = getDbConnection();

try {
    $stmt = $pdo->prepare("
        INSERT INTO projects (name, category, client_user_id, location, city, start_date, progress_percent, budget, spent, status, description)
        VALUES (?, ?, ?, ?, ?, ?, 10, ?, 0.00, 'in_progress', ?)
    ");
    $stmt->execute([$name, $category, $user['id'], $location, $city, $startDate, $budget, $description]);
    $newProjectId = $pdo->lastInsertId();

    sendJsonResponse([
        'success' => true,
        'message' => 'Project created successfully in MySQL database',
        'project_id' => $newProjectId
    ]);
} catch (Exception $e) {
    sendJsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
}
