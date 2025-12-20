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
    
    $status = $_GET['status'] ?? 'all';
    $search = $_GET['search'] ?? '';
    $email = $_GET['email'] ?? '';
    
    $query = "SELECT 
        sc.id,
        sc.case_id,
        sc.user_email,
        sc.user_name,
        sc.subject,
        sc.message,
        sc.status,
        sc.assigned_to,
        sc.created_at,
        sc.updated_at,
        sc.last_reply_at,
        (SELECT COUNT(*) FROM support_case_replies scr WHERE scr.case_id = sc.case_id) as reply_count
    FROM support_cases sc
    WHERE 1=1";
    
    $params = [];
    
    if ($status !== 'all') {
        $query .= " AND sc.status = ?";
        $params[] = $status;
    }
    
    if ($email && $email !== 'all') {
        $query .= " AND sc.user_email = ?";
        $params[] = $email;
    }
    
    if ($search) {
        $query .= " AND (sc.user_email LIKE ? OR sc.user_name LIKE ? OR sc.subject LIKE ? OR sc.case_id LIKE ?)";
        $searchParam = "%$search%";
        $params[] = $searchParam;
        $params[] = $searchParam;
        $params[] = $searchParam;
        $params[] = $searchParam;
    }
    
    $query .= " ORDER BY sc.updated_at DESC, sc.created_at DESC";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'data' => $results
    ]);
    
} catch (Exception $e) {
    error_log("Error in support-cases/list.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to load support cases: ' . $e->getMessage()
    ]);
}
?>

