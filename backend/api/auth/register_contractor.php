<?php
/**
 * NIRMAAN 2.0 — Contractor Registration API
 * POST /api/auth/register_contractor.php
 * Forwards to master register.php with role = contractor
 */

if (!isset($_POST['role'])) {
    $_POST['role'] = 'contractor';
}
require __DIR__ . '/register.php';
