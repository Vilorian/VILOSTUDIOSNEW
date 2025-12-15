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
    $search = $_GET['search'] ?? '';
    $studio = $_GET['studio'] ?? '';
    
    // Build query
    $query = "SELECT id, name, username, email, studio, created_at FROM production_assistants WHERE 1=1";
    $params = [];
    
    if (!empty($search)) {
        $query .= " AND (name LIKE ? OR username LIKE ? OR email LIKE ? OR studio LIKE ?)";
        $searchParam = "%{$search}%";
        $params = array_merge($params, [$searchParam, $searchParam, $searchParam, $searchParam]);
    }
    
    if (!empty($studio)) {
        $query .= " AND studio = ?";
        $params[] = $studio;
    }
    
    $query .= " ORDER BY created_at DESC";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $results = $stmt->fetchAll();
    
    echo json_encode([
        'success' => true,
        'data' => $results
    ]);
    
} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    echo json_encode([
        'success' => true,
        'data' => [] // Return empty array if table doesn't exist yet
    ]);
} catch (Exception $e) {
    error_log("Error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'An error occurred']);
}
?>

