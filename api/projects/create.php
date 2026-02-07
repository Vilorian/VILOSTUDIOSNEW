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
    
    // Required fields
    if (empty($data['project_name'])) {
        throw new Exception('Project name is required');
    }
    
    // Handle cover image upload
    $coverPath = null;
    if (!empty($data['cover_image'])) {
        // Decode base64 image
        $imageData = $data['cover_image'];
        if (preg_match('/^data:image\/(\w+);base64,/', $imageData, $type)) {
            $imageData = substr($imageData, strpos($imageData, ',') + 1);
            $type = strtolower($type[1]);
            
            if (!in_array($type, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
                throw new Exception('Invalid image type');
            }
            
            $imageData = base64_decode($imageData);
            if ($imageData === false) {
                throw new Exception('Failed to decode image');
            }
            
            // Create uploads directory if it doesn't exist
            $uploadDir = '../../uploads/projects/covers/';
            if (!file_exists($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }
            
            // Generate unique filename
            $filename = uniqid('project_cover_', true) . '.' . $type;
            $filepath = $uploadDir . $filename;
            
            if (file_put_contents($filepath, $imageData)) {
                $coverPath = 'uploads/projects/covers/' . $filename;
            }
        }
    }
    
    // Insert project
    $sql = "INSERT INTO projects (
        project_name, 
        client_id, 
        client_name,
        client_email,
        cover_image_path,
        creation_date,
        finished_date,
        nda_enabled,
        nda_date,
        is_public,
        is_locked,
        is_hidden,
        created_by,
        created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";
    
    $stmt = $pdo->prepare($sql);
    
    // Determine public status: portfolio visible AND not under NDA
    $portfolioVisible = isset($data['portfolio_visible']) ? (bool)$data['portfolio_visible'] : true;
    $isPublic = $portfolioVisible ? 1 : 0;
    
    if ($portfolioVisible && $data['nda_enabled']) {
        if (!empty($data['nda_date'])) {
            $ndaDate = new DateTime($data['nda_date']);
            $now = new DateTime();
            if ($ndaDate > $now) {
                $isPublic = 0; // Not public until NDA date
            }
        } else {
            $isPublic = 0; // Not public if NDA enabled without date
        }
    }
    
    $stmt->execute([
        $data['project_name'],
        $data['client_id'] ?? null,
        $data['client_name'] ?? null,
        $data['client_email'] ?? null,
        $coverPath,
        $data['creation_date'] ?? null,
        $data['finished_date'] ?? null,
        $data['nda_enabled'] ? 1 : 0,
        $data['nda_date'] ?? null,
        $isPublic,
        0, // is_locked
        0, // is_hidden
        $data['created_by'] ?? 'System'
    ]);
    
    $projectId = $pdo->lastInsertId();
    
    // Handle team members/credits
    if (!empty($data['team_members']) && is_array($data['team_members'])) {
        $memberSql = "INSERT INTO project_members (project_id, email, role, credits, invited_at) VALUES (?, ?, ?, ?, NOW())";
        $memberStmt = $pdo->prepare($memberSql);
        
        foreach ($data['team_members'] as $member) {
            if (!empty($member['email'])) {
                $memberStmt->execute([
                    $projectId,
                    $member['email'],
                    $member['role'] ?? null,
                    $member['credits'] ?? 0
                ]);
            }
        }
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Project created successfully',
        'project_id' => $projectId
    ]);
    
} catch (Exception $e) {
    error_log("Error in projects/create.php: " . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>

