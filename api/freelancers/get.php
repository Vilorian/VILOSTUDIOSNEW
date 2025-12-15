<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../../database/config.php';

try {
    $id = $_GET['id'] ?? null;
    
    if (!$id) {
        echo json_encode(['success' => false, 'message' => 'Freelancer ID is required']);
        exit;
    }
    
    // Get freelancer with email
    $query = "SELECT 
        f.id,
        f.name,
        f.department,
        f.roles,
        f.departments,
        f.created_at,
        f.updated_at,
        fe.email
    FROM freelancers f
    LEFT JOIN freelancer_emails fe ON f.id = fe.freelancer_id
    WHERE f.id = ?";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute([$id]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$row) {
        echo json_encode(['success' => false, 'message' => 'Freelancer not found']);
        exit;
    }
    
    // Process departments
    $departments = !empty($row['departments']) ? explode(',', $row['departments']) : [];
    if (!empty($row['department']) && !in_array($row['department'], $departments)) {
        $departments[] = $row['department'];
    }
    
    $formattedResult = [
        'id' => $row['id'],
        'name' => $row['name'],
        'email' => $row['email'] ?? '',
        'department' => $row['department'] ?? '',
        'departments' => $departments,
        'roles' => $row['roles'] ?? '',
        'created_at' => $row['created_at'],
        'updated_at' => $row['updated_at']
    ];
    
    echo json_encode([
        'success' => true,
        'data' => $formattedResult
    ]);
    
} catch (PDOException $e) {
    error_log("Database error in freelancers/get.php: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Database error occurred']);
} catch (Exception $e) {
    error_log("Error in freelancers/get.php: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'An error occurred']);
}
?>

