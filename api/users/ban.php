<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../../database/config.php';

$input = json_decode(file_get_contents('php://input'), true);
$id = $input['id'] ?? null;
$email = $input['email'] ?? '';

if (!$id || !$email) {
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
    exit;
}

try {
    // Create banned_emails table if it doesn't exist
    try {
        $pdo->query("SELECT 1 FROM banned_emails LIMIT 1");
    } catch (PDOException $e) {
        $pdo->exec("CREATE TABLE IF NOT EXISTS banned_emails (
            id INT(11) NOT NULL AUTO_INCREMENT,
            email VARCHAR(255) NOT NULL,
            banned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            UNIQUE KEY email (email)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    }
    
    // Add to banned emails
    $stmt = $pdo->prepare("INSERT INTO banned_emails (email) VALUES (?) ON DUPLICATE KEY UPDATE email = email");
    $stmt->execute([$email]);
    
    // Update user status
    try {
        $stmt = $pdo->prepare("UPDATE admin_users SET status = 'banned' WHERE id = ?");
        $stmt->execute([$id]);
    } catch (PDOException $e) {
        // Status column might not exist, that's okay
    }
    
    echo json_encode([
        'success' => true,
        'message' => "User {$email} has been banned and added to blacklist"
    ]);
    
} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Database error occurred']);
} catch (Exception $e) {
    error_log("Error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'An error occurred']);
}
?>

