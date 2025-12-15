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
    $department = $_GET['department'] ?? '';
    
    // Verify database connection
    if (!isset($pdo)) {
        throw new Exception('Database connection not available');
    }
    
    // Build query joining freelancers with emails
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
    WHERE 1=1";
    $params = [];
    
    if (!empty($search)) {
        $query .= " AND (f.name LIKE ? OR fe.email LIKE ? OR f.roles LIKE ? OR f.department LIKE ? OR f.departments LIKE ?)";
        $searchParam = "%{$search}%";
        $params = array_merge($params, [$searchParam, $searchParam, $searchParam, $searchParam, $searchParam]);
    }
    
    if (!empty($department)) {
        $query .= " AND (f.department = ? OR f.departments LIKE ?)";
        $params[] = $department;
        $params[] = "%{$department}%";
    }
    
    $query .= " ORDER BY f.created_at DESC";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Process results to format them properly
    $formattedResults = [];
    foreach ($results as $row) {
        $departments = !empty($row['departments']) ? explode(',', $row['departments']) : [];
        if (!empty($row['department']) && !in_array($row['department'], $departments)) {
            $departments[] = $row['department'];
        }
        
        $formattedResults[] = [
            'id' => $row['id'],
            'name' => $row['name'],
            'email' => $row['email'] ?? '',
            'department' => $row['department'] ?? '',
            'departments' => $departments,
            'roles' => $row['roles'] ?? '',
            'created_at' => $row['created_at'],
            'updated_at' => $row['updated_at']
        ];
    }
    
    echo json_encode([
        'success' => true,
        'data' => $formattedResults
    ]);
    
} catch (PDOException $e) {
    error_log("Database error in freelancers/list.php: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage(),
        'data' => []
    ]);
} catch (Exception $e) {
    error_log("Error in freelancers/list.php: " . $e->getMessage());
    echo json_encode([
        'success' => false, 
        'message' => 'An error occurred: ' . $e->getMessage(),
        'data' => []
    ]);
}
?>

