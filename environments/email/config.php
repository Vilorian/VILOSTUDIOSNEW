<?php
// Load .env file if it exists
$envPath = __DIR__ . '/../.env';
if (file_exists($envPath)) {
    $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue; // Skip comments
        if (strpos($line, '=') !== false) {
            list($key, $value) = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value);
            if (!getenv($key)) {
                putenv("$key=$value");
                $_ENV[$key] = $value;
            }
        }
    }
}

// SMTP Configuration
return [
    'smtp_host' => getenv('SMTP_HOST') ?: 'smtp.gmail.com',
    'smtp_port' => getenv('SMTP_PORT') ?: 587,
    'smtp_username' => getenv('SMTP_USERNAME') ?: '',
    'smtp_password' => getenv('SMTP_PASSWORD') ?: '',
    'smtp_encryption' => getenv('SMTP_ENCRYPTION') ?: 'tls',
    'from_email' => getenv('FROM_EMAIL') ?: 'noreply@vilostudios.com',
    'from_name' => getenv('FROM_NAME') ?: 'VILOSTUDIOS',
    'career_support_email' => getenv('CAREER_SUPPORT_EMAIL') ?: 'careersupport@vilostudios.com',
    'discord_webhook_url' => getenv('DISCORD_WEBHOOK_URL') ?: '',
];
?>

