<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../middleware/auth.php';

$input = getJsonInput();
$milestoneId = intval($input['milestone_id'] ?? 2); // default demo milestone 2 (Tile work)

$pdo = getDbConnection();

try {
    $pdo->beginTransaction();

    // 1. Fetch Milestone
    $stmt = $pdo->prepare("SELECT * FROM milestones WHERE id = ?");
    $stmt->execute([$milestoneId]);
    $milestone = $stmt->fetch();

    if (!$milestone) {
        throw new Exception("Milestone not found");
    }

    // 2. Mark milestone as approved
    $stmt = $pdo->prepare("UPDATE milestones SET status = 'approved', completion_date = 'Today' WHERE id = ?");
    $stmt->execute([$milestoneId]);

    // 3. Update project spent & progress
    $stmt = $pdo->prepare("
        UPDATE projects 
        SET spent = spent + ?, progress_percent = LEAST(100, progress_percent + 20)
        WHERE id = ?
    ");
    $stmt->execute([$milestone['amount'], $milestone['project_id']]);

    // 4. Update / Insert Payment
    $stmt = $pdo->prepare("
        INSERT INTO payments (project_id, milestone_id, payer_user_id, payee_user_id, amount, status, utr_number)
        SELECT m.project_id, m.id, p.client_user_id, wp.user_id, m.amount, 'released', CONCAT('UPI/NIRM/', FLOOR(10000000 + RAND() * 90000000))
        FROM milestones m
        JOIN projects p ON m.project_id = p.id
        JOIN worker_profiles wp ON m.worker_profile_id = wp.id
        WHERE m.id = ?
    ");
    $stmt->execute([$milestoneId]);

    // 5. Upgrade Worker Passport
    $stmt = $pdo->prepare("
        UPDATE worker_profiles 
        SET completed_jobs = completed_jobs + 1, total_reviews = total_reviews + 1
        WHERE id = ?
    ");
    $stmt->execute([$milestone['worker_profile_id']]);

    // 6. Add Worker Notification
    $stmt = $pdo->prepare("
        INSERT INTO notifications (user_id, title, message, type, link)
        SELECT wp.user_id, 'Milestone Approved & Paid', CONCAT('Payment of ₹', FORMAT(?, 0), ' released for ', ?), 'milestone', '/worker/earnings'
        FROM worker_profiles wp
        WHERE wp.id = ?
    ");
    $stmt->execute([$milestone['amount'], $milestone['title'], $milestone['worker_profile_id']]);

    $pdo->commit();

    sendJsonResponse([
        'success' => true,
        'message' => '✓ Milestone approved! Payment released from Escrow and logged to Worker Work Passport in MySQL.',
        'milestone_id' => $milestoneId,
        'amount_released' => $milestone['amount']
    ]);

} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    sendJsonResponse(['success' => false, 'error' => $e->getMessage()], 500);
}
