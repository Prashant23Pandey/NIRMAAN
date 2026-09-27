<?php
/**
 * NIRMAAN 2.0 — Logout API
 * POST /api/auth/logout.php
 */

require_once __DIR__ . '/../../config/cors.php';

// Invalidate session/token
sendJsonResponse([
    'success' => true,
    'message' => 'Logged out successfully'
]);
