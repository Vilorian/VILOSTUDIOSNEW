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
        throw new Exception('Invalid data or missing project_id');
    }
    
    $projectId = $data['project_id'];
    
    // Build update query dynamically
    $updates = [];
    $params = [];
    
    if (isset($data['project_name'])) {
        $updates[] = "project_name = ?";
        $params[] = $data['project_name'];
    }
    
    if (isset($data['client_name'])) {
        $updates[] = "client_name = ?";
        $params[] = $data['client_name'];
    }
    
    if (array_key_exists('client_email', $data)) {
        $updates[] = "client_email = ?";
        $params[] = $data['client_email'] ?: null;
    }
    
    if (isset($data['creation_date'])) {
        $updates[] = "creation_date = ?";
        $params[] = $data['creation_date'] ?: null;
    }
    
    if (isset($data['finished_date'])) {
        $updates[] = "finished_date = ?";
        $params[] = $data['finished_date'] ?: null;
    }
    
    if (isset($data['nda_enabled'])) {
        $updates[] = "nda_enabled = ?";
        $params[] = $data['nda_enabled'] ? 1 : 0;
    }
    
    if (isset($data['nda_date'])) {
        $updates[] = "nda_date = ?";
        $params[] = $data['nda_date'] ?: null;
    }
    
    if (isset($data['is_public'])) {
        $updates[] = "is_public = ?";
        $params[] = $data['is_public'] ? 1 : 0;
    }
    
    if (isset($data['is_locked'])) {
        $updates[] = "is_locked = ?";
        $params[] = $data['is_locked'] ? 1 : 0;
    }
    
    if (isset($data['is_hidden'])) {
        $updates[] = "is_hidden = ?";
        $params[] = $data['is_hidden'] ? 1 : 0;
    }
    
    // Handle cover image update
    if (!empty($data['cover_image'])) {
        $imageData = $data['cover_image'];
        if (preg_match('/^data:image\/(\w+);base64,/', $imageData, $type)) {
            $imageData = substr($imageData, strpos($imageData, ',') + 1);
            $type = strtolower($type[1]);
            
            if (in_array($type, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
                $imageData = base64_decode($imageData);
                if ($imageData !== false) {
                    $uploadDir = '../../uploads/projects/covers/';
                    if (!file_exists($uploadDir)) {
                        mkdir($uploadDir, 0755, true);
                    }
                    
                    $filename = uniqid('project_cover_', true) . '.' . $type;
                    $filepath = $uploadDir . $filename;
                    
                    if (file_put_contents($filepath, $imageData)) {
                        $updates[] = "cover_image_path = ?";
                        $params[] = 'uploads/projects/covers/' . $filename;
                    }
                }
            }
        }
    }
    
    if (empty($updates)) {
        throw new Exception('No fields to update');
    }
    
    $updates[] = "updated_at = NOW()";
    $params[] = $projectId;
    
    $sql = "UPDATE projects SET " . implode(', ', $updates) . " WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    
    echo json_encode([
        'success' => true,
        'message' => 'Project updated successfully'
    ]);
    
} catch (Exception $e) {
    error_log("Error in projects/update.php: " . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>

