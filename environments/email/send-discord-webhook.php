<?php
/**
 * Send Discord Webhook Notification
 */
require_once __DIR__ . '/config.php';

function sendDiscordWebhook($message, $caseId = null, $userEmail = null, $recruiterName = null) {
    $config = require __DIR__ . '/config.php';
    
    $webhookUrl = $config['discord_webhook_url'];
    
    if (empty($webhookUrl)) {
        error_log('Discord webhook URL not configured');
        return false;
    }
    
    $embed = [
        'title' => $caseId ? "Support Case: $caseId" : 'Support Case Update',
        'description' => $message,
        'color' => 15105570, // Orange color
        'timestamp' => date('c'),
        'fields' => []
    ];
    
    if ($userEmail) {
        $embed['fields'][] = [
            'name' => 'User Email',
            'value' => $userEmail,
            'inline' => true
        ];
    }
    
    if ($recruiterName) {
        $embed['fields'][] = [
            'name' => 'Recruiter',
            'value' => $recruiterName,
            'inline' => true
        ];
    }
    
    if ($caseId) {
        $embed['fields'][] = [
            'name' => 'Case ID',
            'value' => $caseId,
            'inline' => true
        ];
    }
    
    $payload = [
        'embeds' => [$embed]
    ];
    
    $ch = curl_init($webhookUrl);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode >= 200 && $httpCode < 300) {
        return true;
    } else {
        error_log("Discord webhook error: HTTP $httpCode - $response");
        return false;
    }
}
?>

