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
    
    // Extract recruiter names from processed_by field
    // Format is typically JSON or "Name (email)" or just "Name"
    $query = "SELECT 
        processed_by,
        COUNT(*) as total_processed,
        SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) as accepted,
        SUM(CASE WHEN status = 'declined' THEN 1 ELSE 0 END) as declined,
        MIN(created_at) as first_activity,
        MAX(created_at) as last_activity
    FROM applications
    WHERE processed_by IS NOT NULL 
    AND processed_by != ''
    AND status IN ('accepted', 'declined', 'blocked')
    GROUP BY processed_by
    ORDER BY accepted DESC, total_processed DESC
    LIMIT 20";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $leaderboard = [];
    foreach ($results as $row) {
        // Try to extract name from processed_by
        $processedBy = $row['processed_by'];
        $name = $processedBy;
        
        // If it's JSON, try to parse it
        $decoded = json_decode($processedBy, true);
        if ($decoded && isset($decoded['name'])) {
            $name = $decoded['name'];
        } else if (strpos($processedBy, '(') !== false) {
            // Format: "Name (email)"
            $name = trim(explode('(', $processedBy)[0]);
        }
        
        $leaderboard[] = [
            'name' => $name,
            'total_processed' => (int)$row['total_processed'],
            'accepted' => (int)$row['accepted'],
            'declined' => (int)$row['declined'],
            'acceptance_rate' => $row['total_processed'] > 0 
                ? round(($row['accepted'] / $row['total_processed']) * 100, 1) 
                : 0,
            'first_activity' => $row['first_activity'],
            'last_activity' => $row['last_activity']
        ];
    }
    
    echo json_encode([
        'success' => true,
        'data' => $leaderboard
    ]);
    
} catch (Exception $e) {
    error_log("Error in metrics/leaderboard.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to load leaderboard: ' . $e->getMessage(),
        'data' => []
    ]);
}
?>












