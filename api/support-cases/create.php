<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../../database/config.php';
require_once '../../environments/email/send-discord-webhook.php';

try {
    if (!isset($pdo)) {
        throw new Exception('Database connection not available');
    }
    
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (!$data) {
        throw new Exception('Invalid JSON data');
    }
    
    // Required fields
    if (empty($data['user_email']) || empty($data['message'])) {
        throw new Exception('Missing required fields: user_email and message');
    }
    
    // Generate case ID
    $caseId = 'CASE-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -6));
    
    // Insert case
    $sql = "INSERT INTO support_cases (case_id, user_email, user_name, subject, message, status, assigned_to, created_at) 
            VALUES (?, ?, ?, ?, ?, 'open', ?, NOW())";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $caseId,
        $data['user_email'],
        $data['user_name'] ?? null,
        $data['subject'] ?? null,
        $data['message'],
        $data['assigned_to'] ?? null
    ]);
    
    $caseId_db = $pdo->lastInsertId();
    
    // Insert initial message as reply
    $replySql = "INSERT INTO support_case_replies (case_id, reply_type, from_email, to_email, subject, message, sent_by, created_at) 
                 VALUES (?, 'incoming', ?, ?, ?, ?, NULL, NOW())";
    $replyStmt = $pdo->prepare($replySql);
    $replyStmt->execute([
        $caseId,
        $data['user_email'],
        $supportEmail,
        $data['subject'] ?? 'Career Support Inquiry',
        $data['message'],
    ]);
    
    // Send Discord webhook
    $config = require '../../environments/email/config.php';
    $webhookMessage = "New support case created from {$data['user_email']}" . 
               ($data['subject'] ? ": {$data['subject']}" : '');
    require_once '../../environments/email/send-discord-webhook.php';
    sendDiscordWebhook($webhookMessage, $caseId, $data['user_email'], $data['assigned_to'] ?? null);
    
    echo json_encode([
        'success' => true,
        'message' => 'Support case created successfully',
        'case_id' => $caseId,
        'id' => $caseId_db
    ]);
    
} catch (Exception $e) {
    error_log("Error in support-cases/create.php: " . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>

