-- Projects Table
CREATE TABLE IF NOT EXISTS `projects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_name` varchar(255) NOT NULL,
  `client_id` int(11) DEFAULT NULL,
  `client_name` varchar(255) DEFAULT NULL,
  `cover_image_path` varchar(500) DEFAULT NULL,
  `creation_date` date DEFAULT NULL,
  `finished_date` date DEFAULT NULL,
  `nda_enabled` tinyint(1) NOT NULL DEFAULT 0,
  `nda_date` date DEFAULT NULL,
  `is_public` tinyint(1) NOT NULL DEFAULT 1,
  `is_locked` tinyint(1) NOT NULL DEFAULT 0,
  `is_hidden` tinyint(1) NOT NULL DEFAULT 0,
  `created_by` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_client_id` (`client_id`),
  KEY `idx_created_by` (`created_by`),
  KEY `idx_is_public` (`is_public`),
  KEY `idx_creation_date` (`creation_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Project Members Table (for team members/credits)
CREATE TABLE IF NOT EXISTS `project_members` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` varchar(255) DEFAULT NULL,
  `credits` varchar(500) DEFAULT NULL,
  `invited_at` timestamp NULL DEFAULT current_timestamp(),
  `joined_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_project_id` (`project_id`),
  KEY `idx_email` (`email`),
  CONSTRAINT `fk_project_members_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

