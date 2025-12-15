<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../../database/config.php';

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
    exit;
}

$username = $input['username'] ?? '';
$email = $input['email'] ?? '';
$studio = $input['studio'] ?? '';
$tempPassword = $input['tempPassword'] ?? null;

// Validation
if (empty($username) || empty($email) || empty($studio)) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    exit;
}

try {
    // Generate temporary password if not provided
    if (empty($tempPassword)) {
        $tempPassword = bin2hex(random_bytes(8)); // 16 character password
    }
    
    // Hash password
    $hashedPassword = password_hash($tempPassword, PASSWORD_DEFAULT);
    
    // Check if production_assistants table exists, create if not
    try {
        $pdo->query("SELECT 1 FROM production_assistants LIMIT 1");
    } catch (PDOException $e) {
        // Create table if it doesn't exist
        $pdo->exec("CREATE TABLE IF NOT EXISTS production_assistants (
            id INT(11) NOT NULL AUTO_INCREMENT,
            name VARCHAR(255) NOT NULL,
            username VARCHAR(255) NULL,
            email VARCHAR(255) NOT NULL,
            studio VARCHAR(255) NOT NULL,
            password_hash VARCHAR(255) NULL,
            password_changed TINYINT(1) DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            UNIQUE KEY email (email),
            KEY idx_studio (studio)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    }
    
    // Check if user already exists
    $stmt = $pdo->prepare("SELECT id FROM production_assistants WHERE email = ?");
    $stmt->execute([$email]);
    $existingPA = $stmt->fetch();
    
    if ($existingPA) {
        // Update existing PA
        $stmt = $pdo->prepare("UPDATE production_assistants SET name = ?, username = ?, studio = ?, password_hash = ?, password_changed = 0 WHERE id = ?");
        $stmt->execute([$username, $username, $studio, $hashedPassword, $existingPA['id']]);
        $paId = $existingPA['id'];
    } else {
        // Create new PA
        $stmt = $pdo->prepare("INSERT INTO production_assistants (name, username, email, studio, password_hash, password_changed, created_at) VALUES (?, ?, ?, ?, ?, 0, NOW())");
        $stmt->execute([$username, $username, $email, $studio, $hashedPassword]);
        $paId = $pdo->lastInsertId();
    }
    
    // Send email with temporary password
    require_once '../../environments/email/send-temp-password.php';
    $emailSent = sendTempPasswordEmail($email, $username, $tempPassword);
    
    if ($emailSent) {
        echo json_encode([
            'success' => true,
            'message' => "Production assistant added successfully. Temporary password sent to {$email}"
        ]);
    } else {
        echo json_encode([
            'success' => true,
            'message' => "Production assistant added successfully, but email could not be sent. Temporary password: {$tempPassword}"
        ]);
    }
    
} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Database error occurred']);
} catch (Exception $e) {
    error_log("Error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'An error occurred']);
}
?>

