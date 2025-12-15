-- Quick setup script to make kevin@vilostudios.com a manager
-- Run this after setup_roles_permissions.sql

-- First, hash the password (run: php api/auth/hash_password.php to get the hash)
-- For now, we'll use the plain text temporarily, but you should hash it

-- Update kevin to be a manager
UPDATE `admin_users` 
SET `role` = 'manager',
    `password_hash` = 'Tankcrev#1'  -- Replace with hashed version: $2y$10$...
WHERE `email` = 'kevin@vilostudios.com';

-- If kevin doesn't exist, insert them
INSERT INTO `admin_users` (`email`, `password_hash`, `role`, `created_at`)
SELECT 'kevin@vilostudios.com', 'Tankcrev#1', 'manager', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM `admin_users` WHERE `email` = 'kevin@vilostudios.com'
);

-- Verify kevin is set up correctly
SELECT id, email, role, created_at FROM `admin_users` WHERE `email` = 'kevin@vilostudios.com';


