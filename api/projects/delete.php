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
    
    if (!$data || empty($data['project_id'])) {
        throw new Exception('Project ID is required');
    }
    
    $projectId = $data['project_id'];
    
    // Delete project (cascade will delete project_members)
    $sql = "DELETE FROM projects WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$projectId]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Project deleted successfully'
    ]);
    
} catch (Exception $e) {
    error_log("Error in projects/delete.php: " . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>












