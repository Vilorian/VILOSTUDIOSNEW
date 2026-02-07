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
    
    $type = $_GET['type'] ?? 'monthly'; // monthly, daily
    $period = $_GET['period'] ?? 'all'; // all, accepted
    
    $data = [];
    
    if ($type === 'monthly') {
        // Get monthly applicants
        $query = "SELECT 
            DATE_FORMAT(created_at, '%Y-%m') as month,
            COUNT(*) as count
        FROM applications
        WHERE 1=1";
        
        if ($period === 'accepted') {
            $query .= " AND status = 'accepted'";
        }
        
        $query .= " GROUP BY DATE_FORMAT(created_at, '%Y-%m')
        ORDER BY month DESC
        LIMIT 12";
        
        $stmt = $pdo->prepare($query);
        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        foreach ($results as $row) {
            $data[] = [
                'label' => date('M Y', strtotime($row['month'] . '-01')),
                'value' => (int)$row['count']
            ];
        }
        
        // Reverse to show oldest first
        $data = array_reverse($data);
        
    } else if ($type === 'daily') {
        // Get daily applicants for last 30 days
        $query = "SELECT 
            DATE(created_at) as date,
            COUNT(*) as count
        FROM applications
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
        
        if ($period === 'accepted') {
            $query .= " AND status = 'accepted'";
        }
        
        $query .= " GROUP BY DATE(created_at)
        ORDER BY date ASC";
        
        $stmt = $pdo->prepare($query);
        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Fill in missing dates with 0
        $startDate = date('Y-m-d', strtotime('-30 days'));
        $endDate = date('Y-m-d');
        $dateRange = [];
        
        $current = strtotime($startDate);
        $end = strtotime($endDate);
        
        while ($current <= $end) {
            $dateStr = date('Y-m-d', $current);
            $dateRange[$dateStr] = 0;
            $current = strtotime('+1 day', $current);
        }
        
        foreach ($results as $row) {
            $dateRange[$row['date']] = (int)$row['count'];
        }
        
        foreach ($dateRange as $date => $count) {
            $data[] = [
                'label' => date('M d', strtotime($date)),
                'value' => $count
            ];
        }
    }
    
    echo json_encode([
        'success' => true,
        'data' => $data
    ]);
    
} catch (Exception $e) {
    error_log("Error in metrics/applicants.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to load metrics: ' . $e->getMessage(),
        'data' => []
    ]);
}
?>












