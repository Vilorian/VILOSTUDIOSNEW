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
    
    $caseId = $_GET['case_id'] ?? null;
    
    if (!$caseId) {
        throw new Exception('case_id parameter is required');
    }
    
    // Get case
    $caseSql = "SELECT * FROM support_cases WHERE case_id = ?";
    $caseStmt = $pdo->prepare($caseSql);
    $caseStmt->execute([$caseId]);
    $case = $caseStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$case) {
        throw new Exception('Support case not found');
    }
    
    // Get replies - order by created_at so conversation flows chronologically
    $repliesSql = "SELECT * FROM support_case_replies WHERE case_id = ? ORDER BY created_at ASC";
    $repliesStmt = $pdo->prepare($repliesSql);
    $repliesStmt->execute([$caseId]);
    $replies = $repliesStmt->fetchAll(PDO::FETCH_ASSOC);
    
    $case['replies'] = $replies;
    
    // Get all unique recruiters who have replied (for display purposes)
    $recruitersSql = "SELECT DISTINCT sent_by FROM support_case_replies WHERE case_id = ? AND reply_type = 'outgoing' AND sent_by IS NOT NULL AND sent_by != ''";
    $recruitersStmt = $pdo->prepare($recruitersSql);
    $recruitersStmt->execute([$caseId]);
    $recruiters = $recruitersStmt->fetchAll(PDO::FETCH_COLUMN);
    $case['recruiters_replied'] = $recruiters;
    
    echo json_encode([
        'success' => true,
        'data' => $case
    ]);
    
} catch (Exception $e) {
    error_log("Error in support-cases/get.php: " . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>

