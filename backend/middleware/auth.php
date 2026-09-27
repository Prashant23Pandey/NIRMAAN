<?php
/**
 * NIRMAAN 2.0 Auth Middleware & Session Handler
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';

function getAuthenticatedUser() {
    $authHeader = '';
    if (!empty($_SERVER['HTTP_AUTHORIZATION'])) {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
    } elseif (!empty($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        $authHeader = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    } elseif (function_exists('getallheaders')) {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    } elseif (function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    }
    
    $token = '';
    // Check Bearer Token (token format: base64(userId:roleId:timestamp))
    if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
        $token = trim($matches[1]);
    } elseif (!empty($_GET['auth_token'])) {
        $token = trim($_GET['auth_token']);
    } elseif (!empty($_GET['token'])) {
        $token = trim($_GET['token']);
    } elseif (!empty($_COOKIE['nirmaan_auth_token'])) {
        $token = trim($_COOKIE['nirmaan_auth_token']);
    }

    if (!empty($token)) {
        $decoded = base64_decode($token);
        if ($decoded) {
            $parts = explode(':', $decoded);
            if (count($parts) >= 2) {
                $userId = intval($parts[0]);
                $pdo = getDbConnection();
                $stmt = $pdo->prepare("
                    SELECT 
                        u.id, 
                        u.registration_id,
                        u.role,
                        u.full_name,
                        u.name, 
                        u.email, 
                        u.phone, 
                        u.role_id, 
                        COALESCE(r.slug, UPPER(u.role)) as role_slug, 
                        u.status, 
                        u.profile_photo,
                        u.avatar
                    FROM users u
                    LEFT JOIN roles r ON u.role_id = r.id
                    WHERE u.id = ? AND u.status = 'active'
                ");
                $stmt->execute([$userId]);
                $user = $stmt->fetch();
                if ($user) {
                    return $user;
                }
            }
        }
    }
    
    return null;
}

function getAuthUser() {
    return getAuthenticatedUser();
}

function requireAuth($allowedRoles = []) {
    $user = getAuthenticatedUser();
    if (!$user) {
        sendJsonResponse([
            'success' => false,
            'error' => 'Authentication required. Please sign in.'
        ], 401);
    }
    
    if (!empty($allowedRoles)) {
        $userRole = strtoupper($user['role'] ?? '');
        $userSlug = strtoupper($user['role_slug'] ?? '');
        if ($userRole === 'CLIENT') $userRole = 'HOMEOWNER';
        if ($userSlug === 'CLIENT') $userSlug = 'HOMEOWNER';

        $matched = false;
        foreach ($allowedRoles as $allowed) {
            $upperAllowed = strtoupper($allowed);
            if ($upperAllowed === 'CLIENT') $upperAllowed = 'HOMEOWNER';
            if ($upperAllowed === $userRole || $upperAllowed === $userSlug) {
                $matched = true;
                break;
            }
            // Match admin / super_admin
            if (($upperAllowed === 'SUPER_ADMIN' || $upperAllowed === 'ADMIN') && ($userRole === 'ADMIN' || $userSlug === 'SUPER_ADMIN')) {
                $matched = true;
                break;
            }
        }
        if (!$matched) {
            sendJsonResponse([
                'success' => false,
                'error' => 'Access denied: Insufficient privileges for ' . ($user['role_slug'] ?? $user['role'])
            ], 403);
        }
    }
    
    return $user;
}

function requireRole($allowedRoles = []) {
    return requireAuth($allowedRoles);
}

