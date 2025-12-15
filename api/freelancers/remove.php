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

if (!$id) {
    echo json_encode(['success' => false, 'message' => 'Freelancer ID is required']);
    exit;
}

try {
    $pdo->beginTransaction();
    
    // Remove email first (foreign key constraint)
    $emailStmt = $pdo->prepare("DELETE FROM freelancer_emails WHERE freelancer_id = ?");
    $emailStmt->execute([$id]);
    
    // Remove department associations
    $deptStmt = $pdo->prepare("DELETE FROM freelancer_departments WHERE freelancer_id = ?");
    $deptStmt->execute([$id]);
    
    // Remove freelancer from database
    $stmt = $pdo->prepare("DELETE FROM freelancers WHERE id = ?");
    $stmt->execute([$id]);
    
    $pdo->commit();
    
    echo json_encode([
        'success' => true,
        'message' => "Freelancer has been removed from the database"
    ]);
    
} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Database error occurred']);
} catch (Exception $e) {
    error_log("Error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'An error occurred']);
}
?>

