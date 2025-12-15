-- Role-Based Permissions System Setup
-- Run this after creating the auth tables

-- Add role column to admin_users table
ALTER TABLE `admin_users` 
ADD COLUMN IF NOT EXISTS `role` enum('manager','ambassador','internal_recruiter','production_assistant','client','freelancer') DEFAULT 'production_assistant' AFTER `email`,
ADD COLUMN IF NOT EXISTS `permissions` text DEFAULT NULL COMMENT 'JSON string of specific permissions' AFTER `role`;

-- Update kevin@vilostudios.com to be a manager
UPDATE `admin_users` 
SET `role` = 'manager', 
    `password_hash` = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' -- This is a placeholder, update with actual hash
WHERE `email` = 'kevin@vilostudios.com';

-- If kevin doesn't exist, insert them
INSERT INTO `admin_users` (`email`, `password_hash`, `role`, `created_at`)
SELECT 'kevin@vilostudios.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'manager', NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM `admin_users` WHERE `email` = 'kevin@vilostudios.com'
);

-- Add role to production_assistants
ALTER TABLE `production_assistants` 
ADD COLUMN IF NOT EXISTS `role` enum('production_assistant') DEFAULT 'production_assistant' AFTER `email`;

-- Add role to clients
ALTER TABLE `clients` 
ADD COLUMN IF NOT EXISTS `role` enum('client') DEFAULT 'client' AFTER `email`;

-- Add role to freelancers (if email column exists)
ALTER TABLE `freelancers` 
ADD COLUMN IF NOT EXISTS `role` enum('freelancer') DEFAULT 'freelancer' AFTER `email`;

-- Create permissions reference table
CREATE TABLE IF NOT EXISTS `permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `permission_key` varchar(100) NOT NULL,
  `permission_name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permission_key` (`permission_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert permission definitions
INSERT INTO `permissions` (`permission_key`, `permission_name`, `description`, `category`) VALUES
('access_all', 'Access All', 'Full access to all features', 'general'),
('crm_clients', 'CRM - Client List', 'View and manage client list', 'crm'),
('crm_documents', 'CRM - Documents', 'Access client documents', 'crm'),
('freelancer_database', 'Freelancer Database', 'View freelancer database', 'freelancers'),
('freelancer_contacts', 'Freelancer Contacts', 'View freelancer contact information and emails', 'freelancers'),
('freelancer_numbers', 'Freelancer Numbers', 'View freelancer statistics and numbers', 'freelancers'),
('applications_view', 'View Applications', 'View job applications', 'recruiting'),
('applications_manage', 'Manage Applications', 'Accept/decline applications', 'recruiting'),
('positions_create', 'Create Positions', 'Create new job positions', 'recruiting'),
('positions_manage', 'Manage Positions', 'Edit and manage job positions', 'recruiting'),
('projects_own', 'Own Projects', 'View and manage own projects', 'projects'),
('projects_all', 'All Projects', 'View and manage all projects', 'projects')
ON DUPLICATE KEY UPDATE `permission_name` = VALUES(`permission_name`);

-- Create role_permissions mapping table
CREATE TABLE IF NOT EXISTS `role_permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role` enum('manager','ambassador','internal_recruiter','production_assistant','client','freelancer') NOT NULL,
  `permission_key` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `role_permission` (`role`, `permission_key`),
  KEY `idx_role` (`role`),
  KEY `idx_permission` (`permission_key`),
  FOREIGN KEY (`permission_key`) REFERENCES `permissions`(`permission_key`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Manager permissions (all access)
INSERT INTO `role_permissions` (`role`, `permission_key`) VALUES
('manager', 'access_all'),
('manager', 'crm_clients'),
('manager', 'crm_documents'),
('manager', 'freelancer_database'),
('manager', 'freelancer_contacts'),
('manager', 'freelancer_numbers'),
('manager', 'applications_view'),
('manager', 'applications_manage'),
('manager', 'positions_create'),
('manager', 'positions_manage'),
('manager', 'projects_own'),
('manager', 'projects_all')
ON DUPLICATE KEY UPDATE `permission_key` = VALUES(`permission_key`);

-- Ambassador permissions
INSERT INTO `role_permissions` (`role`, `permission_key`) VALUES
('ambassador', 'crm_clients'),
('ambassador', 'crm_documents'),
('ambassador', 'freelancer_database'),
('ambassador', 'freelancer_contacts'),
('ambassador', 'freelancer_numbers')
ON DUPLICATE KEY UPDATE `permission_key` = VALUES(`permission_key`);

-- Internal Recruiter permissions
INSERT INTO `role_permissions` (`role`, `permission_key`) VALUES
('internal_recruiter', 'applications_view'),
('internal_recruiter', 'applications_manage'),
('internal_recruiter', 'positions_create'),
('internal_recruiter', 'positions_manage'),
('internal_recruiter', 'freelancer_database')
ON DUPLICATE KEY UPDATE `permission_key` = VALUES(`permission_key`);

-- Production Assistant permissions (no contact info)
INSERT INTO `role_permissions` (`role`, `permission_key`) VALUES
('production_assistant', 'freelancer_database'),
('production_assistant', 'freelancer_numbers')
ON DUPLICATE KEY UPDATE `permission_key` = VALUES(`permission_key`);

-- Client permissions
INSERT INTO `role_permissions` (`role`, `permission_key`) VALUES
('client', 'projects_own')
ON DUPLICATE KEY UPDATE `permission_key` = VALUES(`permission_key`);

-- Freelancer permissions (if needed)
INSERT INTO `role_permissions` (`role`, `permission_key`) VALUES
('freelancer', 'projects_own')
ON DUPLICATE KEY UPDATE `permission_key` = VALUES(`permission_key`);


