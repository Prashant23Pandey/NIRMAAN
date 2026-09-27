<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../middleware/auth.php';

$pdo = getDbConnection();

// Check if update/action request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = getJsonInput();
    $userId = intval($input['user_id'] ?? 0);
    $action = $input['action'] ?? ''; // 'suspend', 'activate', 'verify'

    if (!$userId || !$action) {
        sendJsonResponse(['success' => false, 'error' => 'User ID and Action required'], 400);
    }

    if ($action === 'suspend') {
        $stmt = $pdo->prepare("UPDATE users SET status = 'suspended' WHERE id = ?");
        $stmt->execute([$userId]);
    } else if ($action === 'activate') {
        $stmt = $pdo->prepare("UPDATE users SET status = 'active' WHERE id = ?");
        $stmt->execute([$userId]);
    } else if ($action === 'verify') {
        $stmt = $pdo->prepare("UPDATE worker_profiles SET is_verified = 1, verification_status = 'verified' WHERE user_id = ?");
        $stmt->execute([$userId]);
    }

    sendJsonResponse(['success' => true, 'message' => "User action '$action' executed successfully"]);
}

// GET list
$role = trim($_GET['role'] ?? '');
$search = trim($_GET['search'] ?? '');
$status = trim($_GET['status'] ?? '');
$profession = trim($_GET['profession'] ?? '');

$query = "
    SELECT 
        u.id,
        u.registration_id,
        u.role,
        u.full_name,
        u.name,
        u.email,
        u.phone,
        u.status,
        u.profile_photo,
        COALESCE(u.profile_photo, u.avatar) as avatar,
        u.created_at,
        u.created_at as joined_date,
        COALESCE(r.name, CONCAT(UPPER(SUBSTRING(u.role, 1, 1)), LOWER(SUBSTRING(u.role, 2)))) as role_name,
        COALESCE(r.slug, UPPER(u.role)) as role_slug,
        COALESCE(p.name, wp.profession) as profession_name,
        COALESCE(wp.nirmaan_id, u.registration_id) as nirmaan_id,
        COALESCE(wp.is_verified, 1) as is_verified,
        COALESCE(wp.rating, 4.8) as rating,
        COALESCE(wp.completed_jobs, 0) as completed_jobs,
        wp.document_type,
        wp.document_number,
        COALESCE(wp.document_url, cp.document_url) as document_url
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
    LEFT JOIN worker_profiles wp ON wp.user_id = u.id
    LEFT JOIN contractor_profiles cp ON cp.user_id = u.id
    LEFT JOIN professions p ON wp.profession_id = p.id
    WHERE 1=1
";

$params = [];

if ($role) {
    $query .= " AND (u.role = ? OR r.slug = ? OR r.name LIKE ?)";
    $params[] = strtolower($role);
    $params[] = strtoupper($role);
    $params[] = "%$role%";
}

if ($status) {
    $query .= " AND u.status = ?";
    $params[] = $status;
}

if ($profession) {
    $query .= " AND (p.slug = ? OR wp.profession LIKE ?)";
    $params[] = $profession;
    $params[] = "%$profession%";
}

if ($search) {
    $query .= " AND (u.registration_id LIKE ? OR u.full_name LIKE ? OR u.name LIKE ? OR u.phone LIKE ? OR u.email LIKE ? OR wp.nirmaan_id LIKE ?)";
    $params[] = "%$search%";
    $params[] = "%$search%";
    $params[] = "%$search%";
    $params[] = "%$search%";
    $params[] = "%$search%";
    $params[] = "%$search%";
}

$query .= " ORDER BY u.id DESC";

$stmt = $pdo->prepare($query);
$stmt->execute($params);
$users = $stmt->fetchAll();

sendJsonResponse([
    'success' => true,
    'count' => count($users),
    'users' => $users
]);
