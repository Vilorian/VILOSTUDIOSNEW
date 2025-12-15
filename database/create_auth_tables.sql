-- Create tables for authentication system

-- Production Assistants Whitelist
CREATE TABLE IF NOT EXISTS `production_assistants` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Clients Table
CREATE TABLE IF NOT EXISTS `clients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `company` varchar(255) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_email` (`email`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add email column to freelancers if it doesn't exist
ALTER TABLE `freelancers` 
ADD COLUMN IF NOT EXISTS `email` varchar(255) DEFAULT NULL AFTER `name`,
ADD COLUMN IF NOT EXISTS `password_hash` varchar(255) DEFAULT NULL AFTER `email`,
ADD UNIQUE KEY IF NOT EXISTS `email` (`email`);

-- Update admin_users to use proper password hashing
-- Note: You should update existing passwords to use password_hash()
-- Example: UPDATE admin_users SET password_hash = password_hash('newpassword', PASSWORD_DEFAULT) WHERE id = 1;


