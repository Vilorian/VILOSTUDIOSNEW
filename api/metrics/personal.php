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
    
    // Get recruiter email/name from request (should come from session/auth in production)
    $recruiterEmail = $_GET['email'] ?? null;
    $recruiterName = $_GET['name'] ?? null;
    
    if (!$recruiterEmail && !$recruiterName) {
        throw new Exception('Recruiter identifier required');
    }
    
    // Get applications processed by this recruiter
    $query = "SELECT 
        COUNT(*) as total_processed,
        SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) as accepted,
        SUM(CASE WHEN status = 'declined' THEN 1 ELSE 0 END) as declined,
        SUM(CASE WHEN status = 'blocked' THEN 1 ELSE 0 END) as blocked,
        MIN(created_at) as first_processed,
        MAX(created_at) as last_processed
    FROM applications
    WHERE processed_by LIKE ? OR processed_by LIKE ?";
    
    $stmt = $pdo->prepare($query);
    $emailPattern = '%' . $recruiterEmail . '%';
    $namePattern = '%' . $recruiterName . '%';
    $stmt->execute([$emailPattern, $namePattern]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Get this month's stats
    $monthQuery = "SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) as accepted
    FROM applications
    WHERE (processed_by LIKE ? OR processed_by LIKE ?)
    AND MONTH(created_at) = MONTH(NOW())
    AND YEAR(created_at) = YEAR(NOW())";
    
    $monthStmt = $pdo->prepare($monthQuery);
    $monthStmt->execute([$emailPattern, $namePattern]);
    $monthResult = $monthStmt->fetch(PDO::FETCH_ASSOC);
    
    // Get today's stats
    $todayQuery = "SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) as accepted
    FROM applications
    WHERE (processed_by LIKE ? OR processed_by LIKE ?)
    AND DATE(created_at) = CURDATE()";
    
    $todayStmt = $pdo->prepare($todayQuery);
    $todayStmt->execute([$emailPattern, $namePattern]);
    $todayResult = $todayStmt->fetch(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'data' => [
            'total_processed' => (int)($result['total_processed'] ?? 0),
            'accepted' => (int)($result['accepted'] ?? 0),
            'declined' => (int)($result['declined'] ?? 0),
            'blocked' => (int)($result['blocked'] ?? 0),
            'first_processed' => $result['first_processed'] ?? null,
            'last_processed' => $result['last_processed'] ?? null,
            'this_month' => [
                'total' => (int)($monthResult['total'] ?? 0),
                'accepted' => (int)($monthResult['accepted'] ?? 0)
            ],
            'today' => [
                'total' => (int)($todayResult['total'] ?? 0),
                'accepted' => (int)($todayResult['accepted'] ?? 0)
            ]
        ]
    ]);
    
} catch (Exception $e) {
    error_log("Error in metrics/personal.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to load personal metrics: ' . $e->getMessage(),
        'data' => []
    ]);
}
?>

