<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../../database/config.php';

try {
    if (!isset($pdo)) {
        throw new Exception('Database connection not available');
    }
    
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (!$data) {
        throw new Exception('Invalid JSON data');
    }
    
    // Validate required fields
    if (empty($data['name'])) {
        throw new Exception('Name is required');
    }
    
    // Start transaction
    $pdo->beginTransaction();
    
    // Insert freelancer
    $sql = "INSERT INTO freelancers (name, department, roles, departments, created_at, updated_at) 
            VALUES (?, ?, ?, ?, NOW(), NOW())";
    
    $name = $data['name'];
    $department = $data['department'] ?? null;
    $roles = $data['roles'] ?? null;
    $departments = !empty($data['departments']) ? implode(',', $data['departments']) : null;
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$name, $department, $roles, $departments]);
    
    $freelancerId = $pdo->lastInsertId();
    
    // Insert email if provided
    if (!empty($data['email'])) {
        $emailSql = "INSERT INTO freelancer_emails (freelancer_id, email, created_at) VALUES (?, ?, NOW())";
        $emailStmt = $pdo->prepare($emailSql);
        $emailStmt->execute([$freelancerId, $data['email']]);
    }
    
    // Commit transaction
    $pdo->commit();
    
    echo json_encode([
        'success' => true,
        'message' => 'Freelancer added successfully',
        'data' => [
            'id' => $freelancerId,
            'name' => $name,
            'email' => $data['email'] ?? '',
            'department' => $department,
            'departments' => $departments ? explode(',', $departments) : [],
            'roles' => $roles
        ]
    ]);
    
} catch (PDOException $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log("Database error in freelancers/create.php: " . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log("Error in freelancers/create.php: " . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>












