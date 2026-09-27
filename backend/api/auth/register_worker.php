<?php
/**
 * NIRMAAN 2.0 — Worker Registration API
 * POST /api/auth/register_worker.php
 * Forwards to master register.php with role = worker
 */

if (!isset($_POST['role'])) {
    $_POST['role'] = 'worker';
}
require __DIR__ . '/register.php';
