# Authentication System Setup Guide

## Overview

The login system authenticates users based on their email domain and whitelist status:

- **Employees**: Any email ending with `@vilostudios.com` or `.vilostudios.com`
- **Production Assistants**: Users in the `production_assistants` table
- **Clients**: Users in the `clients` table with `status = 'active'`
- **Freelancers**: Users in the `freelancers` table
- **All others**: Access denied

## Database Setup

1. **Run the SQL script** to create necessary tables:
   ```sql
   -- Run database/create_auth_tables.sql in your database
   ```

2. **Update database credentials** in `api/auth/login.php`:
   ```php
   $host = '127.0.0.1:3306';
   $dbname = 'u431247581_vilostudios';
   $username = 'your_username';
   $password = 'your_password';
   ```

3. **Add users to tables**:

   **For Employees** (already in `admin_users` table):
   ```sql
   INSERT INTO admin_users (email, password_hash) 
   VALUES ('employee@vilostudios.com', '$2y$10$...'); -- Use password_hash() in PHP
   ```

   **For Production Assistants**:
   ```sql
   INSERT INTO production_assistants (name, email, password_hash) 
   VALUES ('John Doe', 'john@example.com', '$2y$10$...');
   ```

   **For Clients**:
   ```sql
   INSERT INTO clients (name, email, company, password_hash, status) 
   VALUES ('Client Name', 'client@example.com', 'Company Name', '$2y$10$...', 'active');
   ```

   **For Freelancers** (update existing records):
   ```sql
   UPDATE freelancers SET email = 'freelancer@example.com', password_hash = '$2y$10$...' WHERE id = 1;
   ```

## Password Hashing

Use PHP's `password_hash()` function:
```php
$hashed = password_hash('your_password', PASSWORD_DEFAULT);
```

## Routes After Login

- **Employee**: `/dashboard/employee/index.php`
- **Production Assistant**: `/dashboard/production/index.php`
- **Client**: `/dashboard/client/index.php`
- **Freelancer**: `/dashboard/freelancer/index.php`

## Security Notes

1. **Update passwords**: The current system accepts plain text passwords for backward compatibility. Update all passwords to use `password_hash()`.

2. **HTTPS**: Use HTTPS in production.

3. **Session security**: Consider adding session timeout and CSRF protection.

4. **Rate limiting**: Add rate limiting to prevent brute force attacks.

## Testing

1. Access `login.html` in your browser
2. Try logging in with:
   - Employee email: `kevin@vilostudios.com` (from admin_users table)
   - Any email in the freelancers/clients/production_assistants tables

## Troubleshooting

- **"Database connection failed"**: Check database credentials in `api/auth/login.php`
- **"Access denied"**: Verify the email exists in the appropriate table
- **Table doesn't exist**: Run `database/create_auth_tables.sql`


