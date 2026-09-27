<?php
/**
 * NIRMAAN 2.0 — Worker Profile Photo Update API
 * POST /api/worker/update_photo.php
 * Handles changing/updating profile picture with strict MIME validation & safe file removal of old photo.
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../middleware/auth.php';

$user = getAuthUser();
if (!$user) {
    sendJsonResponse(['success' => false, 'message' => 'Unauthorized: Please log in.'], 401);
}

$userId = (int)$user['id'];
$pdo = getDbConnection();

$photoField = isset($_FILES['profile_photo']) ? 'profile_photo' : (isset($_FILES['photo']) ? 'photo' : null);
if (!$photoField || $_FILES[$photoField]['error'] === UPLOAD_ERR_NO_FILE) {
    sendJsonResponse(['success' => false, 'message' => 'No image file was provided.'], 400);
}

$file = $_FILES[$photoField];

if ($file['error'] !== UPLOAD_ERR_OK) {
    sendJsonResponse(['success' => false, 'message' => 'Upload error code: ' . $file['error']], 400);
}

// 5 MB max
$maxBytes = 5 * 1024 * 1024;
if ($file['size'] > $maxBytes) {
    sendJsonResponse(['success' => false, 'message' => 'Profile picture exceeds the maximum allowed size of 5 MB.'], 400);
}

// Validate extension
$origName = $file['name'] ?? '';
$ext = strtolower(pathinfo($origName, PATHINFO_EXTENSION));
$allowedExts = ['jpg', 'jpeg', 'png', 'webp'];
if (!in_array($ext, $allowedExts, true)) {
    sendJsonResponse(['success' => false, 'message' => 'Invalid image format. Allowed formats: JPG, JPEG, PNG, WEBP.'], 400);
}

// Validate MIME type with finfo
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mimeType = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

$allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
if (!in_array($mimeType, $allowedMimes, true)) {
    sendJsonResponse(['success' => false, 'message' => 'Security check rejected image. Only valid JPG, JPEG, PNG, or WEBP files are permitted.'], 400);
}

// Storage directory
$uploadDir = __DIR__ . '/../../uploads/profile_photos/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$safeName = 'PHOTO_' . $userId . '_' . bin2hex(random_bytes(6)) . '.' . $ext;
$destination = $uploadDir . $safeName;

if (!move_uploaded_file($file['tmp_name'], $destination)) {
    sendJsonResponse(['success' => false, 'message' => 'Could not save profile picture on server.'], 500);
}

$newPhotoPath = 'uploads/profile_photos/' . $safeName;

try {
    // 1. Get old photo path to delete later
    $stmtOld = $pdo->prepare("SELECT profile_photo FROM users WHERE id = ?");
    $stmtOld->execute([$userId]);
    $oldPhoto = $stmtOld->fetchColumn();

    // 2. Update users table
    $stmtUser = $pdo->prepare("UPDATE users SET profile_photo = ?, avatar = ? WHERE id = ?");
    $stmtUser->execute([$newPhotoPath, $newPhotoPath, $userId]);

    // 3. Update worker_profiles table
    $stmtWp = $pdo->prepare("UPDATE worker_profiles SET profile_photo = ? WHERE user_id = ?");
    $stmtWp->execute([$newPhotoPath, $userId]);

    // 4. Safely remove old photo file if it was a local uploaded file and not the same
    if ($oldPhoto && $oldPhoto !== $newPhotoPath && strncmp($oldPhoto, 'uploads/profile_photos/', 23) === 0) {
        $oldFileFullPath = __DIR__ . '/../../' . $oldPhoto;
        if (is_file($oldFileFullPath) && basename($oldFileFullPath) !== $safeName) {
            @unlink($oldFileFullPath);
        }
    }

    sendJsonResponse([
        'success' => true,
        'message' => 'Profile picture updated successfully in MySQL database.',
        'profile_photo' => $newPhotoPath,
        'avatar' => $newPhotoPath
    ]);
} catch (Exception $e) {
    // If db update failed, remove uploaded new file
    if (is_file($destination)) {
        @unlink($destination);
    }
    sendJsonResponse(['success' => false, 'message' => 'Database update failed: ' . $e->getMessage()], 500);
}
