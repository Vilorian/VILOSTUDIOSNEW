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
    $category = $_GET['category'] ?? 'all'; // database, project, internship, tech, management, sound, all
    $status = $_GET['status'] ?? 'all'; // pending, accepted, declined, all
    $search = $_GET['search'] ?? '';
    
    // Verify database connection
    if (!isset($pdo)) {
        throw new Exception('Database connection not available');
    }
    
    // Base query
    $query = "SELECT 
        a.id,
        a.name,
        a.email,
        a.phone,
        a.role,
        a.department,
        a.coverLetter,
        a.cv_path,
        a.status,
        a.submitted_at,
        a.processed_at
    FROM applications a
    WHERE 1=1";
    $params = [];
    
    // Filter by status
    if ($status !== 'all') {
        $query .= " AND a.status = ?";
        $params[] = $status;
    }
    
    // Filter by category
    if ($category !== 'all') {
        switch ($category) {
            case 'database':
                // Applications where role matches a database job
                $query .= " AND EXISTS (
                    SELECT 1 FROM jobs j 
                    WHERE j.role = a.role 
                    AND j.jobType = 'database'
                )";
                break;
                
            case 'project':
                // Applications where role matches a project-specific job
                $query .= " AND EXISTS (
                    SELECT 1 FROM jobs j 
                    WHERE j.role = a.role 
                    AND j.jobType = 'project'
                )";
                break;
                
            case 'internship':
                // Applications for internship positions (check if role contains 'intern' or 'internship')
                $query .= " AND (LOWER(a.role) LIKE ? OR LOWER(a.role) LIKE ?)";
                $params[] = '%intern%';
                $params[] = '%internship%';
                break;
                
            case 'tech':
                // Tech positions - 3D/CG related departments → Vilostudios Technologies
                $query .= " AND a.department IN ('3d-cgi', 'cg', '3d')";
                break;
                
            case 'management':
                // Management positions - production, planning departments → Vilostudios
                $query .= " AND a.department IN ('production', 'planning', 'planning-production')";
                break;
                
            case 'sound':
                // Sound positions → Hex Archive
                $query .= " AND a.department IN ('sound', 'sound-music', 'music')";
                break;
        }
    }
    
    // Search filter
    if (!empty($search)) {
        $query .= " AND (
            a.name LIKE ? OR 
            a.email LIKE ? OR 
            a.role LIKE ? OR 
            a.department LIKE ?
        )";
        $searchParam = "%{$search}%";
        $params = array_merge($params, [$searchParam, $searchParam, $searchParam, $searchParam]);
    }
    
    $query .= " ORDER BY a.submitted_at DESC";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Determine company name based on category/department
    foreach ($results as &$result) {
        $result['company'] = 'Vilostudios'; // Default
        
        // Override based on department
        if (in_array($result['department'], ['3d-cgi', 'cg', '3d'])) {
            $result['company'] = 'Vilostudios Technologies';
        } elseif (in_array($result['department'], ['sound', 'sound-music', 'music'])) {
            $result['company'] = 'Hex Archive';
        } elseif (in_array($result['department'], ['production', 'planning', 'planning-production'])) {
            $result['company'] = 'Vilostudios';
        }
    }
    
    echo json_encode([
        'success' => true,
        'data' => $results,
        'count' => count($results)
    ]);
    
} catch (PDOException $e) {
    error_log("Database error in applications/list.php: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage(),
        'data' => [],
        'count' => 0
    ]);
} catch (Exception $e) {
    error_log("Error in applications/list.php: " . $e->getMessage());
    echo json_encode([
        'success' => false, 
        'message' => 'An error occurred: ' . $e->getMessage(),
        'data' => [],
        'count' => 0
    ]);
}
?>

