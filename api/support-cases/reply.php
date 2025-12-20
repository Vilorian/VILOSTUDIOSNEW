<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../../database/config.php';
require_once '../../environments/email/send-support-reply.php';
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
    if (empty($data['case_id']) || empty($data['message']) || empty($data['to_email'])) {
        throw new Exception('Missing required fields: case_id, message, and to_email');
    }
    
    $caseId = $data['case_id'];
    $toEmail = $data['to_email'];
    $toName = $data['to_name'] ?? null;
    $subject = $data['subject'] ?? 'Re: Career Support Inquiry';
    $message = $data['message'];
    $recruiterName = $data['recruiter_name'] ?? null;
    $recruiterEmail = $data['recruiter_email'] ?? null;
    
    // Convert message to HTML if it's plain text (basic conversion)
    $htmlMessage = nl2br(htmlspecialchars($message));
    $htmlMessage = '<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">' . $htmlMessage . '</div>';
    
    // Get case info
    $caseSql = "SELECT * FROM support_cases WHERE case_id = ?";
    $caseStmt = $pdo->prepare($caseSql);
    $caseStmt->execute([$caseId]);
    $case = $caseStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$case) {
        throw new Exception('Support case not found');
    }
    
    // Send email
    $emailSent = sendSupportReplyEmail($toEmail, $toName, $subject, $htmlMessage, $caseId, $recruiterName, $recruiterEmail);
    
    if (!$emailSent) {
        throw new Exception('Failed to send email');
    }
    
    // Save reply to database
    $replySql = "INSERT INTO support_case_replies (case_id, reply_type, from_email, to_email, subject, message, sent_by, created_at) 
                 VALUES (?, 'outgoing', ?, ?, ?, ?, ?, NOW())";
    $replyStmt = $pdo->prepare($replySql);
    $config = require '../../environments/email/config.php';
    $supportEmail = $config['career_support_email'] ?? 'careersupport@vilostudios.com';
    
    $replyStmt->execute([
        $caseId,
        $recruiterEmail ?: $supportEmail,
        $toEmail,
        $subject,
        $message, // Store original message
        $recruiterName ?: ($recruiterEmail ?: 'System')
    ]);
    
    // Update case - change status from 'open' to 'in_progress' when recruiter replies
    // Assign to recruiter if not already assigned (first responder)
    $updateSql = "UPDATE support_cases SET 
                  last_reply_at = NOW(),
                  updated_at = NOW(),
                  status = CASE WHEN status = 'open' THEN 'in_progress' ELSE status END,
                  assigned_to = COALESCE(?, assigned_to)
                  WHERE case_id = ?";
    $updateStmt = $pdo->prepare($updateSql);
    $updateStmt->execute([
        $recruiterName ?: ($recruiterEmail ?: 'System'),
        $caseId
    ]);
    
    // Send Discord webhook
    $webhookMessage = "Reply sent to {$toEmail} for case {$caseId}";
    if ($recruiterName) {
        $webhookMessage .= " by {$recruiterName}";
    }
    sendDiscordWebhook($webhookMessage, $caseId, $toEmail, $recruiterName);
    
    echo json_encode([
        'success' => true,
        'message' => 'Reply sent successfully'
    ]);
    
} catch (Exception $e) {
    error_log("Error in support-cases/reply.php: " . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>

