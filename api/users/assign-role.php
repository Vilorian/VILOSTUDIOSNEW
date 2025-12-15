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
$role = $input['role'] ?? '';
$tempPassword = $input['tempPassword'] ?? null;

// Validation
if (empty($username) || empty($email) || empty($role)) {
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
    
    // Use admin_users table (check if username column exists, if not add it)
    try {
        $pdo->query("SELECT username FROM admin_users LIMIT 1");
    } catch (PDOException $e) {
        // Add username column if it doesn't exist
        try {
            $pdo->exec("ALTER TABLE admin_users ADD COLUMN username VARCHAR(255) NULL AFTER id");
            $pdo->exec("ALTER TABLE admin_users ADD COLUMN password_changed TINYINT(1) DEFAULT 0 AFTER password_hash");
        } catch (PDOException $alterError) {
            // Column might already exist or table structure is different
        }
    }
    
    // Check if user already exists
    $stmt = $pdo->prepare("SELECT id FROM admin_users WHERE email = ?");
    $stmt->execute([$email]);
    $existingUser = $stmt->fetch();
    
    if ($existingUser) {
        // Update existing user
        $stmt = $pdo->prepare("UPDATE admin_users SET username = ?, role = ?, password_hash = ?, password_changed = 0 WHERE id = ?");
        $stmt->execute([$username, $role, $hashedPassword, $existingUser['id']]);
        $userId = $existingUser['id'];
    } else {
        // Create new user
        $stmt = $pdo->prepare("INSERT INTO admin_users (username, email, password_hash, role, password_changed, created_at) VALUES (?, ?, ?, ?, 0, NOW())");
        $stmt->execute([$username, $email, $hashedPassword, $role]);
        $userId = $pdo->lastInsertId();
    }
    
    // Send email with temporary password
    require_once '../../environments/email/send-temp-password.php';
    $emailSent = sendTempPasswordEmail($email, $username, $tempPassword);
    
    if ($emailSent) {
        echo json_encode([
            'success' => true,
            'message' => "Role assigned successfully. Temporary password sent to {$email}"
        ]);
    } else {
        echo json_encode([
            'success' => true,
            'message' => "Role assigned successfully, but email could not be sent. Temporary password: {$tempPassword}"
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

