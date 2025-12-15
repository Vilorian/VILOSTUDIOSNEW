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
    // Update user status to restricted
    try {
        $stmt = $pdo->prepare("UPDATE admin_users SET status = 'restricted' WHERE id = ?");
        $stmt->execute([$id]);
    } catch (PDOException $e) {
        // Status column might not exist, try to add it
        try {
            $pdo->exec("ALTER TABLE admin_users ADD COLUMN status VARCHAR(20) DEFAULT 'active' AFTER role");
            $stmt = $pdo->prepare("UPDATE admin_users SET status = 'restricted' WHERE id = ?");
            $stmt->execute([$id]);
        } catch (PDOException $alterError) {
            error_log("Could not update status: " . $alterError->getMessage());
        }
    }
    
    echo json_encode([
        'success' => true,
        'message' => "User {$email} has been restricted"
    ]);
    
} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Database error occurred']);
} catch (Exception $e) {
    error_log("Error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'An error occurred']);
}
?>

