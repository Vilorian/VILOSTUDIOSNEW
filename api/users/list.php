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
    $filter = $_GET['filter'] ?? '';
    $bypass = isset($_GET['bypass']) && $_GET['bypass'] === '1';
    
    // Build query
    $query = "SELECT id, username, email, role, COALESCE(status, 'active') as status, created_at FROM admin_users WHERE 1=1";
    $params = [];
    
    // Check for status column, if not exists add it
    try {
        $pdo->query("SELECT status FROM admin_users LIMIT 1");
    } catch (PDOException $e) {
        try {
            $pdo->exec("ALTER TABLE admin_users ADD COLUMN status VARCHAR(20) DEFAULT 'active' AFTER role");
            $pdo->exec("ALTER TABLE admin_users ADD COLUMN banned_emails TEXT NULL");
        } catch (PDOException $alterError) {
            // Column might already exist
        }
    }
    
    // Check banned emails
    $bannedEmails = [];
    try {
        $banStmt = $pdo->query("SELECT email FROM banned_emails");
        $bannedEmails = $banStmt->fetchAll(PDO::FETCH_COLUMN);
    } catch (PDOException $e) {
        // Table doesn't exist yet, will be created when needed
    }
    
    if (!empty($search)) {
        $query .= " AND (username LIKE ? OR email LIKE ? OR role LIKE ?)";
        $searchParam = "%{$search}%";
        $params = array_merge($params, [$searchParam, $searchParam, $searchParam]);
    }
    
    if (!empty($filter)) {
        if ($filter === 'banned') {
            // Filter by banned status
            $query .= " AND status = 'banned'";
        } else {
            $query .= " AND role = ?";
            $params[] = $filter;
        }
    }
    
    $query .= " ORDER BY created_at DESC";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $results = $stmt->fetchAll();
    
    // Add status based on banned emails
    foreach ($results as &$user) {
        if (in_array($user['email'], $bannedEmails)) {
            $user['status'] = 'banned';
        } elseif (empty($user['status'])) {
            $user['status'] = 'active';
        }
    }
    
    echo json_encode([
        'success' => true,
        'data' => $results
    ]);
    
} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    echo json_encode([
        'success' => true,
        'data' => [] // Return empty array if table doesn't exist yet
    ]);
} catch (Exception $e) {
    error_log("Error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'An error occurred']);
}
?>

