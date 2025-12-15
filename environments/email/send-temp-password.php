<?php
function sendTempPasswordEmail($toEmail, $username, $tempPassword) {
    $config = require __DIR__ . '/config.php';
    
    // Load email template
    $templatePath = __DIR__ . '/templates/temp-password.html';
    if (!file_exists($templatePath)) {
        error_log("Email template not found: " . $templatePath);
        return false;
    }
    
    $template = file_get_contents($templatePath);
    
    // Replace placeholders
    $template = str_replace('{{username}}', htmlspecialchars($username), $template);
    $template = str_replace('{{temp_password}}', htmlspecialchars($tempPassword), $template);
    $template = str_replace('{{login_url}}', (isset($_SERVER['HTTPS']) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . '/login.html', $template);
    
    // Email subject
    $subject = 'Your VILOSTUDIOS Account - Temporary Password';
    
    // Use PHPMailer if available
    if (file_exists(__DIR__ . '/../../vendor/autoload.php') && class_exists('PHPMailer\PHPMailer\PHPMailer')) {
        return sendWithPHPMailer($toEmail, $subject, $template, $config);
    } else {
        // Fallback to basic mail() function
        $headers = [
            'MIME-Version: 1.0',
            'Content-type: text/html; charset=UTF-8',
            'From: ' . $config['from_name'] . ' <' . $config['from_email'] . '>',
            'Reply-To: ' . $config['from_email'],
        ];
        
        return @mail($toEmail, $subject, $template, implode("\r\n", $headers));
    }
}

function sendWithPHPMailer($toEmail, $subject, $htmlBody, $config) {
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
        $mail->setFrom($config['from_email'], $config['from_name']);
        $mail->addAddress($toEmail);
        
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

