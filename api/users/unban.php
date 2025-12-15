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
    // Remove from banned emails
    $stmt = $pdo->prepare("DELETE FROM banned_emails WHERE email = ?");
    $stmt->execute([$email]);
    
    // Update user status
    try {
        $stmt = $pdo->prepare("UPDATE admin_users SET status = 'active' WHERE id = ?");
        $stmt->execute([$id]);
    } catch (PDOException $e) {
        // Status column might not exist
    }
    
    echo json_encode([
        'success' => true,
        'message' => "User {$email} has been unbanned and removed from blacklist"
    ]);
    
} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Database error occurred']);
} catch (Exception $e) {
    error_log("Error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'An error occurred']);
}
?>

