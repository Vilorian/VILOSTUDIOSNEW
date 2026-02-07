<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed. Use POST.'
    ]);
    exit;
}

// Get POST data first
$input = json_decode(file_get_contents('php://input'), true);
$email = isset($input['email']) ? trim($input['email']) : '';
$password = isset($input['password']) ? $input['password'] : '';

if (empty($email) || empty($password)) {
    echo json_encode([
        'success' => false,
        'message' => 'Email and password are required.'
    ]);
    exit;
}

// BYPASS FUNCTION: Direct login for kevin@vilostudios.com (for testing/development)
// This bypasses all database checks - CHECK THIS FIRST before database connection
if (strtolower($email) === 'kevin@vilostudios.com' && $password === 'Tankcrev#1') {
    session_start();
    $_SESSION['user_id'] = 1;
    $_SESSION['user_email'] = 'kevin@vilostudios.com';
    $_SESSION['user_role'] = 'manager';
    $_SESSION['user_name'] = 'Kevin MD';
    $_SESSION['user_permissions'] = ['access_all']; // Manager has all permissions
    
    // Create or update community profile for bypass user
    try {
        $pdo = new PDO(
            "mysql:host=127.0.0.1:3306;dbname=u431247581_vilostudios;charset=utf8mb4",
            'root',
            '',
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]
        );
        
        // Check if community_users table exists
        $pdo->query("SELECT 1 FROM community_users LIMIT 1");
        
        // Check if community profile exists
        $communityStmt = $pdo->prepare("SELECT id FROM community_users WHERE email = ?");
        $communityStmt->execute(['kevin@vilostudios.com']);
        $communityUser = $communityStmt->fetch();
        
        if (!$communityUser) {
            // Create community profile automatically
            $randomPassword = bin2hex(random_bytes(16));
            $passwordHash = password_hash($randomPassword, PASSWORD_DEFAULT);
            
            $insertStmt = $pdo->prepare("
                INSERT INTO community_users (email, username, password_hash, role, email_verified)
                VALUES (?, ?, ?, 'staff', 1)
            ");
            $insertStmt->execute(['kevin@vilostudios.com', 'kevin', $passwordHash]);
        } else {
            // Update role to staff
            $updateStmt = $pdo->prepare("UPDATE community_users SET role = 'staff' WHERE email = ?");
            $updateStmt->execute(['kevin@vilostudios.com']);
        }
    } catch (PDOException $e) {
        // Community table doesn't exist yet or error occurred - continue with login
        error_log("Community profile creation error (bypass): " . $e->getMessage());
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Login successful (bypass mode).',
        'user' => [
            'id' => 1,
            'email' => 'kevin@vilostudios.com',
            'name' => 'Kevin MD',
            'role' => 'manager',
            'permissions' => ['access_all']
        ],
        'dashboard' => 'dashboard/employee/index.html'
    ]);
    exit;
}

// Use shared database config
require_once __DIR__ . '/../../database/config.php';

try {
    // Check if user is an employee (@vilostudios.com domain)
    $isEmployee = strpos($email, '@vilostudios.com') !== false || 
                  strpos($email, '.vilostudios.com') !== false;
    
    $userRole = null;
    $userName = null;
    $userId = null;
    $userPermissions = [];
    
    if ($isEmployee) {
        // Check admin_users table for employees
        $stmt = $pdo->prepare("SELECT id, email, password_hash, role FROM admin_users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user) {
            // Check password (support both plain text for migration and hashed)
            $passwordValid = false;
            if ($user['password_hash'] === $password) {
                $passwordValid = true;
            } else {
                // Try password_verify for hashed passwords
                $passwordValid = password_verify($password, $user['password_hash']);
            }
            
            if ($passwordValid) {
                // Get role from database or default to manager for @vilostudios.com
                $userRole = $user['role'] ?? 'manager';
                $userId = $user['id'];
                $userName = $email;
                
                // Get permissions for this role
                $permStmt = $pdo->prepare("
                    SELECT permission_key 
                    FROM role_permissions 
                    WHERE role = ?
                ");
                $permStmt->execute([$userRole]);
                $permissions = $permStmt->fetchAll(PDO::FETCH_COLUMN);
                $userPermissions = $permissions;
                
                // If manager has access_all, grant all permissions
                if (in_array('access_all', $userPermissions)) {
                    $allPermsStmt = $pdo->query("SELECT permission_key FROM permissions");
                    $userPermissions = $allPermsStmt->fetchAll(PDO::FETCH_COLUMN);
                }
                
                // Update last login
                $updateStmt = $pdo->prepare("UPDATE admin_users SET last_login = NOW() WHERE id = ?");
                $updateStmt->execute([$userId]);
            }
        }
    }
    
    // If not employee, check freelancers
    if (!$userRole) {
        // Check if email column exists, if not, skip this check
        try {
            $stmt = $pdo->prepare("SELECT id, name, email, password_hash FROM freelancers WHERE email = ?");
            $stmt->execute([$email]);
            $freelancer = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($freelancer) {
                // Check password if password_hash exists
                $passwordValid = false;
                if (!empty($freelancer['password_hash'])) {
                    $passwordValid = ($freelancer['password_hash'] === $password) || password_verify($password, $freelancer['password_hash']);
                }
                
                if ($passwordValid || empty($freelancer['password_hash'])) {
                    $userRole = 'freelancer';
                    $userId = $freelancer['id'];
                    $userName = $freelancer['name'];
                    
                    // Get freelancer permissions
                    $permStmt = $pdo->prepare("SELECT permission_key FROM role_permissions WHERE role = 'freelancer'");
                    $permStmt->execute();
                    $userPermissions = $permStmt->fetchAll(PDO::FETCH_COLUMN);
                }
            }
        } catch (PDOException $e) {
            // Table might not have email column yet, skip
        }
    }
    
    // Check production assistants whitelist
    if (!$userRole) {
        try {
            $stmt = $pdo->prepare("SELECT id, name, email, password_hash FROM production_assistants WHERE email = ?");
            $stmt->execute([$email]);
            $pa = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($pa) {
                $passwordValid = false;
                if (!empty($pa['password_hash'])) {
                    $passwordValid = ($pa['password_hash'] === $password) || password_verify($password, $pa['password_hash']);
                }
                
                if ($passwordValid || empty($pa['password_hash'])) {
                    $userRole = 'production_assistant';
                    $userId = $pa['id'];
                    $userName = $pa['name'];
                    
                    // Get production assistant permissions (no contact info)
                    $permStmt = $pdo->prepare("SELECT permission_key FROM role_permissions WHERE role = 'production_assistant'");
                    $permStmt->execute();
                    $userPermissions = $permStmt->fetchAll(PDO::FETCH_COLUMN);
                }
            }
        } catch (PDOException $e) {
            // Table might not exist yet, skip
        }
    }
    
    // Check clients
    if (!$userRole) {
        try {
            $stmt = $pdo->prepare("SELECT id, name, email, password_hash FROM clients WHERE email = ? AND status = 'active'");
            $stmt->execute([$email]);
            $client = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($client) {
                $passwordValid = false;
                if (!empty($client['password_hash'])) {
                    $passwordValid = ($client['password_hash'] === $password) || password_verify($password, $client['password_hash']);
                }
                
                if ($passwordValid || empty($client['password_hash'])) {
                    $userRole = 'client';
                    $userId = $client['id'];
                    $userName = $client['name'];
                    
                    // Get client permissions
                    $permStmt = $pdo->prepare("SELECT permission_key FROM role_permissions WHERE role = 'client'");
                    $permStmt->execute();
                    $userPermissions = $permStmt->fetchAll(PDO::FETCH_COLUMN);
                }
            }
        } catch (PDOException $e) {
            // Table might not exist yet, skip
        }
    }
    
    if ($userRole) {
        // Start session
        session_start();
        $_SESSION['user_id'] = $userId;
        $_SESSION['user_email'] = $email;
        $_SESSION['user_role'] = $userRole;
        $_SESSION['user_name'] = $userName;
        $_SESSION['user_permissions'] = $userPermissions;
        
        // Create or update community profile for dashboard users
        try {
            // Check if community_users table exists
            $pdo->query("SELECT 1 FROM community_users LIMIT 1");
            
            // Check if community profile exists
            $communityStmt = $pdo->prepare("SELECT id FROM community_users WHERE email = ?");
            $communityStmt->execute([$email]);
            $communityUser = $communityStmt->fetch();
            
            if (!$communityUser) {
                // Create community profile automatically
                $username = explode('@', $email)[0]; // Use email prefix as username
                $usernameBase = $username;
                $usernameCounter = 1;
                
                // Ensure username is unique
                while (true) {
                    $checkStmt = $pdo->prepare("SELECT id FROM community_users WHERE username = ?");
                    $checkStmt->execute([$username]);
                    if (!$checkStmt->fetch()) {
                        break;
                    }
                    $username = $usernameBase . $usernameCounter;
                    $usernameCounter++;
                }
                
                // Generate a random password for community account (user won't need to use it)
                $randomPassword = bin2hex(random_bytes(16));
                $passwordHash = password_hash($randomPassword, PASSWORD_DEFAULT);
                
                // Determine community role based on dashboard role
                $communityRole = 'member';
                if ($userRole === 'manager' || $userRole === 'ambassador' || $userRole === 'internal_recruiter' || $userRole === 'moderator') {
                    $communityRole = 'staff';
                }
                
                $insertStmt = $pdo->prepare("
                    INSERT INTO community_users (email, username, password_hash, role, email_verified)
                    VALUES (?, ?, ?, ?, 1)
                ");
                $insertStmt->execute([$email, $username, $passwordHash, $communityRole]);
            } else {
                // Update role if user is staff
                if ($userRole === 'manager' || $userRole === 'ambassador' || $userRole === 'internal_recruiter' || $userRole === 'moderator') {
                    $updateStmt = $pdo->prepare("UPDATE community_users SET role = 'staff' WHERE email = ?");
                    $updateStmt->execute([$email]);
                }
            }
        } catch (PDOException $e) {
            // Community table doesn't exist yet or error occurred - continue with login
            error_log("Community profile creation error: " . $e->getMessage());
        }
        
        // Determine dashboard route based on role
        $dashboardRoute = 'dashboard/index.php';
        switch ($userRole) {
            case 'manager':
            case 'ambassador':
            case 'internal_recruiter':
            case 'moderator':
                $dashboardRoute = 'dashboard/employee/index.html';
                break;
            case 'production_assistant':
                $dashboardRoute = 'dashboard/production/index.php';
                break;
            case 'client':
                $dashboardRoute = 'dashboard/client/index.php';
                break;
            case 'freelancer':
                $dashboardRoute = 'dashboard/freelancer/index.php';
                break;
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Login successful.',
            'user' => [
                'id' => $userId,
                'email' => $email,
                'name' => $userName,
                'role' => $userRole,
                'permissions' => $userPermissions
            ],
            'dashboard' => $dashboardRoute
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Access denied. Your email is not authorized or not found in our system.'
        ]);
    }
    
} catch (PDOException $e) {
    error_log("Login error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Database error. Please try again later.'
    ]);
} catch (Exception $e) {
    error_log("Login error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'An error occurred. Please try again later.'
    ]);
}
?>

