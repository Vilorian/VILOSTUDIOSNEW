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
    if (!isset($pdo)) {
        throw new Exception('Database connection not available');
    }
    
    // Filter by client email when provided (clients see only their projects)
    $clientEmail = isset($_GET['client_email']) ? trim($_GET['client_email']) : null;
    
    $query = "SELECT 
        p.*,
        COUNT(pm.id) as team_member_count
    FROM projects p
    LEFT JOIN project_members pm ON p.id = pm.project_id";
    
    $params = [];
    if (!empty($clientEmail)) {
        $query .= " WHERE p.client_email = ?";
        $params[] = $clientEmail;
    }
    
    $query .= " GROUP BY p.id ORDER BY p.created_at DESC";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'data' => $results
    ]);
    
} catch (Exception $e) {
    error_log("Error in projects/list.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to load projects: ' . $e->getMessage(),
        'data' => []
    ]);
}
?>












