# Environments Configuration

This directory contains environment-specific configuration files.

## Email Configuration

### Setup

1. Copy `.env.example` to `.env` in the root directory (if using environment variables)
2. Or edit `email/config.php` directly with your SMTP settings

### SMTP Settings

Edit `email/config.php` with your SMTP credentials:

```php
'smtp_host' => 'smtp.gmail.com',
'smtp_port' => 587,
'smtp_username' => 'your-email@gmail.com',
'smtp_password' => 'your-app-password',
'smtp_encryption' => 'tls',
'from_email' => 'noreply@vilostudios.com',
'from_name' => 'VILOSTUDIOS',
```

### Gmail Setup

For Gmail, you'll need to:
1. Enable 2-Step Verification
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the App Password in `smtp_password`

### Email Templates

Email templates are located in `email/templates/`:
- `temp-password.html` - Template for temporary password emails

### Testing

The email system will:
- Use PHPMailer if available (recommended)
- Fall back to PHP's `mail()` function if PHPMailer is not installed

To install PHPMailer:
```bash
composer require phpmailer/phpmailer
```

