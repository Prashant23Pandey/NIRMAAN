<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';

$pdo = getDbConnection();

$professionSlug = $_GET['profession'] ?? $_GET['profession_slug'] ?? '';
$city = $_GET['city'] ?? '';
$availableOnly = isset($_GET['available']) ? intval($_GET['available']) : null;

$query = "
    SELECT 
        wp.*,
        u.name,
        u.email,
        u.phone,
        u.avatar as photo,
        p.name as profession_name,
        p.slug as profession_slug,
        p.icon as profession_icon,
        pass.quality_score,
        pass.punctuality_score,
        pass.reliability_score,
        pass.completion_score,
        pass.client_payment_score,
        pass.client_site_score,
        pass.client_clarity_score
    FROM worker_profiles wp
    JOIN users u ON wp.user_id = u.id
    JOIN professions p ON wp.profession_id = p.id
    LEFT JOIN work_passports pass ON pass.worker_profile_id = wp.id
    WHERE u.status = 'active'
";

$params = [];

if ($professionSlug) {
    $query .= " AND (p.slug = ? OR p.name LIKE ?)";
    $params[] = $professionSlug;
    $params[] = "%$professionSlug%";
}

if ($city) {
    $query .= " AND wp.city LIKE ?";
    $params[] = "%$city%";
}

if ($availableOnly !== null) {
    $query .= " AND wp.is_available = ?";
    $params[] = $availableOnly;
}

$query .= " ORDER BY wp.rating DESC, wp.completed_jobs DESC";

$stmt = $pdo->prepare($query);
$stmt->execute($params);
$workers = $stmt->fetchAll();

// Attach verified skills and recent reviews
foreach ($workers as &$w) {
    $sStmt = $pdo->prepare("
        SELECT s.name, ws.is_verified, ws.proficiency_level
        FROM worker_skills ws
        JOIN skills s ON ws.skill_id = s.id
        WHERE ws.worker_profile_id = ?
    ");
    $sStmt->execute([$w['id']]);
    $w['skills'] = $sStmt->fetchAll();

    // Default match score for UI
    $w['match_score'] = min(98, 85 + ($w['years_experience'] * 2));
}

sendJsonResponse([
    'success' => true,
    'count' => count($workers),
    'workers' => $workers
]);
