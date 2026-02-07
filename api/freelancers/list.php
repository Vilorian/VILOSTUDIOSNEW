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
    
    // Check if freelancer_emails exists; otherwise use freelancers.email if available
    $hasEmailsTable = false;
    try {
        $pdo->query("SELECT 1 FROM freelancer_emails LIMIT 1");
        $hasEmailsTable = true;
    } catch (PDOException $e) {
        // Table doesn't exist
    }
    
    if ($hasEmailsTable) {
        $query = "SELECT f.id, f.name, f.department, f.roles, f.departments, f.created_at, f.updated_at,
            (SELECT fe.email FROM freelancer_emails fe WHERE fe.freelancer_id = f.id LIMIT 1) as email
            FROM freelancers f WHERE 1=1";
    } else {
        $emailCol = '';
        try {
            $pdo->query("SELECT email FROM freelancers LIMIT 1");
            $emailCol = ', f.email';
        } catch (PDOException $e) { /* no email column */ }
        $query = "SELECT f.id, f.name, f.department, f.roles, f.departments, f.created_at, f.updated_at" . $emailCol . "
            FROM freelancers f WHERE 1=1";
        if (!$emailCol) {
            $query = str_replace('f.updated_at', "f.updated_at, '' as email", $query);
        }
    }
    $params = [];
    
    if (!empty($search)) {
        $searchParam = "%{$search}%";
        $searchParts = ["f.name LIKE ?", "f.roles LIKE ?", "f.department LIKE ?", "f.departments LIKE ?"];
        $searchParams = [$searchParam, $searchParam, $searchParam, $searchParam];
        if ($hasEmailsTable) {
            $query .= " AND (" . implode(' OR ', $searchParts) . " OR EXISTS (SELECT 1 FROM freelancer_emails fe2 WHERE fe2.freelancer_id = f.id AND fe2.email LIKE ?))";
            $searchParams[] = $searchParam;
        } else {
            $hasEmailCol = strpos($query, 'f.email') !== false;
            if ($hasEmailCol) {
                $searchParts[] = "f.email LIKE ?";
                $searchParams[] = $searchParam;
            }
            $query .= " AND (" . implode(' OR ', $searchParts) . ")";
        }
        $params = array_merge($params, $searchParams);
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

