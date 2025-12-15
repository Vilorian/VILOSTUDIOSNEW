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
$name = $input['name'] ?? '';
$email = $input['email'] ?? '';
$department = $input['department'] ?? '';
$departments = $input['departments'] ?? '';
$roles = $input['roles'] ?? '';

if (!$id || !$name) {
    echo json_encode(['success' => false, 'message' => 'ID and name are required']);
    exit;
}

try {
    $pdo->beginTransaction();
    
    // Update freelancer
    $stmt = $pdo->prepare("UPDATE freelancers SET name = ?, department = ?, departments = ?, roles = ?, updated_at = NOW() WHERE id = ?");
    $stmt->execute([$name, $department, $departments, $roles, $id]);
    
    // Update or insert email
    if (!empty($email)) {
        // Check if email exists for this freelancer
        $checkStmt = $pdo->prepare("SELECT id FROM freelancer_emails WHERE freelancer_id = ?");
        $checkStmt->execute([$id]);
        $existing = $checkStmt->fetch();
        
        if ($existing) {
            // Update existing email
            $emailStmt = $pdo->prepare("UPDATE freelancer_emails SET email = ?, updated_at = NOW() WHERE freelancer_id = ?");
            $emailStmt->execute([$email, $id]);
        } else {
            // Insert new email
            $emailStmt = $pdo->prepare("INSERT INTO freelancer_emails (freelancer_id, email) VALUES (?, ?)");
            $emailStmt->execute([$id, $email]);
        }
    }
    
    $pdo->commit();
    
    echo json_encode([
        'success' => true,
        'message' => 'Freelancer updated successfully'
    ]);
    
} catch (PDOException $e) {
    $pdo->rollBack();
    error_log("Database error in freelancers/update.php: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Database error occurred']);
} catch (Exception $e) {
    $pdo->rollBack();
    error_log("Error in freelancers/update.php: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'An error occurred']);
}
?>

