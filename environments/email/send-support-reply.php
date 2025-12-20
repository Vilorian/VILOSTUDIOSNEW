<?php
/**
 * Send Support Case Reply Email
 */
require_once __DIR__ . '/config.php';

function sendSupportReplyEmail($toEmail, $toName, $subject, $htmlBody, $caseId, $recruiterName, $recruiterEmail) {
    $config = require __DIR__ . '/config.php';
    
    // Email subject with case ID
    $emailSubject = $subject . ' [Case: ' . $caseId . ']';
    
    // Use PHPMailer if available
    if (file_exists(__DIR__ . '/../../vendor/autoload.php') && class_exists('PHPMailer\PHPMailer\PHPMailer')) {
        return sendWithPHPMailer($toEmail, $toName, $emailSubject, $htmlBody, $config, $recruiterEmail, $recruiterName);
    } else {
        // Fallback to basic mail() function
        $headers = [
            'MIME-Version: 1.0',
            'Content-type: text/html; charset=UTF-8',
            'From: ' . ($recruiterName ?: $config['from_name']) . ' <' . ($recruiterEmail ?: $config['from_email']) . '>',
            'Reply-To: ' . ($recruiterEmail ?: $config['career_support_email']),
        ];
        
        return @mail($toEmail, $emailSubject, $htmlBody, implode("\r\n", $headers));
    }
}

function sendWithPHPMailer($toEmail, $toName, $subject, $htmlBody, $config, $recruiterEmail, $recruiterName) {
    require_once __DIR__ . '/../../vendor/autoload.php';
    
    try {
        $mail = new PHPMailer\PHPMailer\PHPMailer(true);
        
        // Server settings
        $mail->isSMTP();
        $mail->Host = $config['smtp_host'];
        $mail->SMTPAuth = true;
        $mail->Username = $config['smtp_username'];
        $mail->Password = $config['smtp_password'];
        $mail->SMTPSecure = $config['smtp_encryption'];
        $mail->Port = $config['smtp_port'];
        
        // Recipients
        $mail->setFrom($recruiterEmail ?: $config['from_email'], $recruiterName ?: $config['from_name']);
        $mail->addAddress($toEmail, $toName);
        $mail->addReplyTo($recruiterEmail ?: $config['career_support_email'], $recruiterName ?: $config['from_name']);
        
        // Content
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $htmlBody;
        $mail->AltBody = strip_tags($htmlBody);
        
        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Email error: " . $mail->ErrorInfo);
        return false;
    }
}
?>

