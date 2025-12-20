-- Support Cases Table for Career Support Emails
CREATE TABLE IF NOT EXISTS `support_cases` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `case_id` varchar(50) NOT NULL,
  `user_email` varchar(255) NOT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  `subject` varchar(500) DEFAULT NULL,
  `message` text NOT NULL,
  `status` enum('open','in_progress','resolved','closed') NOT NULL DEFAULT 'open',
  `assigned_to` varchar(255) DEFAULT NULL COMMENT 'Recruiter email/name',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `last_reply_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `case_id` (`case_id`),
  KEY `idx_user_email` (`user_email`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Support Case Replies Table
CREATE TABLE IF NOT EXISTS `support_case_replies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `case_id` varchar(50) NOT NULL,
  `reply_type` enum('incoming','outgoing') NOT NULL DEFAULT 'incoming',
  `from_email` varchar(255) NOT NULL,
  `to_email` varchar(255) NOT NULL,
  `subject` varchar(500) DEFAULT NULL,
  `message` text NOT NULL,
  `sent_by` varchar(255) DEFAULT NULL COMMENT 'Recruiter email/name for outgoing',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_case_id` (`case_id`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `fk_support_case_replies_case` FOREIGN KEY (`case_id`) REFERENCES `support_cases` (`case_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

