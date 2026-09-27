<?php
/**
 * NIRMAAN 2.0 — Homeowner Registration API
 * POST /api/auth/register_homeowner.php
 * Forwards to master register.php with role = client
 */

if (!isset($_POST['role'])) {
    $_POST['role'] = 'client';
}
require __DIR__ . '/register.php';
