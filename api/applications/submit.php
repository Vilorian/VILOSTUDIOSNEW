<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../../database/config.php';

// Verify database connection (uses PDO)
if (!isset($pdo)) {
    http_response_code(500);
    die(json_encode(['success' => false, 'message' => 'Database connection failed']));
}

// Bot Detection Functions
function detectBot($data) {
    $errors = [];
    
    // 1. Honeypot field check
    if (isset($data['website']) && !empty($data['website'])) {
        $errors[] = 'Honeypot field filled';
    }
    
    // 2. Time-based validation (too fast = bot)
    if (isset($data['form_start_time'])) {
        $timeElapsed = time() - intval($data['form_start_time']);
        if ($timeElapsed < 3) {
            $errors[] = 'Form submitted too quickly';
        }
        // Also check if too slow (more than 24 hours = suspicious)
        if ($timeElapsed > 86400) {
            $errors[] = 'Form submission timeout';
        }
    }
    
    // 3. Check for suspicious patterns
    if (isset($data['email'])) {
        $email = $data['email'];
        // Check for common spam patterns
        $spamPatterns = ['test@test.com', 'spam', 'bot@', '@fake', 'noreply@'];
        foreach ($spamPatterns as $pattern) {
            if (stripos($email, $pattern) !== false) {
                $errors[] = 'Suspicious email pattern';
                break;
            }
        }
    }
    
    // 4. Check for empty required fields that might indicate bot
    $requiredFields = ['name', 'email', 'role', 'department'];
    foreach ($requiredFields as $field) {
        if (!isset($data[$field]) || empty(trim($data[$field]))) {
            $errors[] = "Missing required field: $field";
        }
    }
    
    return $errors;
}

// Rate limiting check (simple in-memory, consider Redis for production)
function checkRateLimit($email) {
    $rateLimitFile = sys_get_temp_dir() . '/vilostudios_rate_limit_' . md5($email) . '.txt';
    $maxSubmissions = 3;
    $timeWindow = 3600; // 1 hour
    
    if (file_exists($rateLimitFile)) {
        $data = json_decode(file_get_contents($rateLimitFile), true);
        $currentTime = time();
        
        // Clean old submissions outside time window
        $data['submissions'] = array_filter($data['submissions'], function($timestamp) use ($currentTime, $timeWindow) {
            return ($currentTime - $timestamp) < $timeWindow;
        });
        
        if (count($data['submissions']) >= $maxSubmissions) {
            return false; // Rate limit exceeded
        }
        
        $data['submissions'][] = $currentTime;
        file_put_contents($rateLimitFile, json_encode($data));
    } else {
        file_put_contents($rateLimitFile, json_encode([
            'submissions' => [time()]
        ]));
    }
    
    return true;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (!$data) {
        throw new Exception('Invalid JSON data');
    }
    
    // Bot detection
    $botErrors = detectBot($data);
    if (!empty($botErrors)) {
        error_log('Bot detected: ' . implode(', ', $botErrors));
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'message' => 'Submission blocked for security reasons.'
        ]);
        exit;
    }
    
    // Rate limiting
    $email = $data['email'] ?? '';
    if (!checkRateLimit($email)) {
        http_response_code(429);
        echo json_encode([
            'success' => false,
            'message' => 'Too many submissions. Please try again later.'
        ]);
        exit;
    }
    
    // Validate required fields
    $required = ['name', 'email', 'role', 'department'];
    foreach ($required as $field) {
        if (empty($data[$field])) {
            throw new Exception("Missing required field: $field");
        }
    }
    
    // Sanitize input (using prepared statements, so minimal sanitization needed)
    $name = trim($data['name']);
    $email = trim($data['email']);
    $phone = isset($data['phone']) ? trim($data['phone']) : null;
    $role = trim($data['role']);
    $department = trim($data['department']);
    $coverLetter = isset($data['coverLetter']) ? trim($data['coverLetter']) : null;
    $portfolio_url = isset($data['portfolio_url']) ? trim($data['portfolio_url']) : null;
    
    // Handle CV file upload if provided
    $cv_path = null;
    if (isset($data['cv_base64']) && !empty($data['cv_base64'])) {
        // Decode base64 and save file
        $uploadDir = '../../uploads/cvs/';
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }
        
        $cvData = base64_decode($data['cv_base64']);
        $cvExtension = $data['cv_extension'] ?? 'pdf';
        $cvFilename = uniqid('cv_') . '_' . preg_replace('/[^a-zA-Z0-9]/', '_', $name) . '.' . $cvExtension;
        $cv_path = 'uploads/cvs/' . $cvFilename;
        
        if (file_put_contents('../../' . $cv_path, $cvData) === false) {
            throw new Exception('Failed to save CV file');
        }
    }
    
    // Insert into database (check if portfolio_url column exists first)
    try {
        $checkColumn = $pdo->query("SHOW COLUMNS FROM applications LIKE 'portfolio_url'");
        $hasPortfolioColumn = $checkColumn->rowCount() > 0;
    } catch (Exception $e) {
        $hasPortfolioColumn = false; // Default to false if check fails
    }
    
    if ($hasPortfolioColumn) {
        $sql = "INSERT INTO applications (name, email, phone, role, department, coverLetter, cv_path, portfolio_url, status, submitted_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$name, $email, $phone, $role, $department, $coverLetter, $cv_path, $portfolio_url]);
    } else {
        // Fallback if portfolio_url column doesn't exist
        $sql = "INSERT INTO applications (name, email, phone, role, department, coverLetter, cv_path, status, submitted_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', NOW())";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$name, $email, $phone, $role, $department, $coverLetter, $cv_path]);
    }
    
    $applicationId = $pdo->lastInsertId();
    
    echo json_encode([
        'success' => true,
        'message' => 'Application submitted successfully',
        'id' => $applicationId
    ]);
    
} catch (Exception $e) {
    error_log('Application submission error: ' . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
?>

