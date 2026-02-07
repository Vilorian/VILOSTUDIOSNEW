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
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        throw new Exception('Invalid JSON input');
    }
    
    // Validate required fields
    $required = ['role', 'branch', 'jobType', 'employmentType', 'description', 'requirements'];
    foreach ($required as $field) {
        if (empty($input[$field])) {
            throw new Exception("Missing required field: $field");
        }
    }
    
    // Validate jobType
    if (!in_array($input['jobType'], ['database', 'project'])) {
        throw new Exception('Invalid jobType. Must be "database" or "project"');
    }
    
    // Validate employmentType
    $validEmploymentTypes = ['part-time', 'permanent', 'contract'];
    if (!in_array($input['employmentType'], $validEmploymentTypes)) {
        throw new Exception('Invalid employmentType. Must be "part-time", "permanent", or "contract"');
    }
    
    // Sanitize inputs
    $role = trim($input['role']);
    $branch = trim($input['branch']);
    $jobType = $input['jobType'];
    $employmentType = $input['employmentType'];
    $description = $input['description']; // HTML from Quill
    $requirements = $input['requirements']; // HTML from Quill
    $pay = isset($input['pay']) && $input['pay'] !== '' ? floatval($input['pay']) : null;
    
    // Include employment type in description if column doesn't exist
    // For now, we'll prepend it to description
    $description = '<p><strong>Employment Type:</strong> ' . ucfirst($employmentType) . '</p>' . $description;
    
    // Verify database connection
    if (!isset($pdo)) {
        throw new Exception('Database connection not available');
    }
    
    // Insert job
    $stmt = $pdo->prepare("
        INSERT INTO jobs (role, branch, jobType, pay, description, requirements, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
    ");
    
    $stmt->execute([
        $role,
        $branch,
        $jobType,
        $pay,
        $description,
        $requirements
    ]);
    
    $jobId = $pdo->lastInsertId();
    
        echo json_encode([
            'success' => true,
            'message' => 'Position created successfully',
            'data' => [
                'id' => $jobId,
                'role' => $role,
                'branch' => $branch,
                'jobType' => $jobType,
                'pay' => $pay
            ]
        ]);
        
    } catch (Exception $e) {
        $pdo->rollBack();
        throw $e;
    }
    
} catch (PDOException $e) {
    error_log("Database error in jobs/create.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    error_log("Error in jobs/create.php: " . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>

