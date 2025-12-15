<?php
session_start();

require_once '../../api/auth/check_permission.php';

// Check if user is logged in and has employee role (manager, ambassador, or internal_recruiter)
if (!isset($_SESSION['user_id'])) {
    header('Location: ../../login.html');
    exit;
}

$userRole = $_SESSION['user_role'] ?? '';
$allowedRoles = ['manager', 'ambassador', 'internal_recruiter'];

if (!in_array($userRole, $allowedRoles)) {
    header('Location: ../../login.html');
    exit;
}

$userName = $_SESSION['user_name'] ?? $_SESSION['user_email'] ?? 'Employee';
$userEmail = $_SESSION['user_email'] ?? '';
$permissions = $_SESSION['user_permissions'] ?? [];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Employee Dashboard - VILOSTUDIOS</title>
    <link rel="stylesheet" href="../../styles.css">
    <style>
        .dashboard-container {
            min-height: 100vh;
            padding: 2rem;
            padding-top: 120px;
        }
        .dashboard-card {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
            background: rgba(20, 20, 25, 0.4);
            backdrop-filter: blur(30px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 24px;
        }
        .welcome-message {
            font-size: 2rem;
            font-weight: 800;
            margin-bottom: 1rem;
        }
        .user-info {
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 2rem;
        }
        .role-badge {
            display: inline-block;
            padding: 0.5rem 1rem;
            background: #FF6B35;
            color: #000;
            border-radius: 8px;
            font-weight: 700;
            text-transform: uppercase;
            font-size: 0.875rem;
            margin-top: 0.5rem;
        }
        .logout-btn {
            display: inline-block;
            padding: 0.75rem 1.5rem;
            background: rgba(255, 107, 53, 0.2);
            border: 1px solid #FF6B35;
            color: #FF6B35;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 600;
            margin-top: 2rem;
            transition: all 0.3s ease;
        }
        .logout-btn:hover {
            background: #FF6B35;
            color: #000;
        }
    </style>
</head>
<body>
    <div class="app">
        <div class="dashboard-container">
            <div class="dashboard-card">
                <h1 class="welcome-message">Employee Dashboard</h1>
                <div class="user-info">
                    <p>Welcome, <?php echo htmlspecialchars($userName); ?>!</p>
                    <p>Email: <?php echo htmlspecialchars($userEmail); ?></p>
                    <span class="role-badge"><?php echo ucfirst(str_replace('_', ' ', $userRole)); ?></span>
                </div>
                
                <div style="margin-top: 2rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
                    <?php if (hasPermission('crm_clients') || hasPermission('access_all')): ?>
                    <div style="padding: 1.5rem; background: rgba(255, 107, 53, 0.1); border: 1px solid rgba(255, 107, 53, 0.3); border-radius: 12px;">
                        <h3 style="margin-bottom: 0.5rem; color: #FF6B35;">CRM - Clients</h3>
                        <p style="color: rgba(255, 255, 255, 0.7); font-size: 0.9rem;">Manage client list and relationships</p>
                        <a href="#" style="color: #FF6B35; text-decoration: none; font-weight: 600;">View Clients →</a>
                    </div>
                    <?php endif; ?>
                    
                    <?php if (hasPermission('crm_documents') || hasPermission('access_all')): ?>
                    <div style="padding: 1.5rem; background: rgba(255, 107, 53, 0.1); border: 1px solid rgba(255, 107, 53, 0.3); border-radius: 12px;">
                        <h3 style="margin-bottom: 0.5rem; color: #FF6B35;">Documents</h3>
                        <p style="color: rgba(255, 255, 255, 0.7); font-size: 0.9rem;">Access client documents</p>
                        <a href="#" style="color: #FF6B35; text-decoration: none; font-weight: 600;">View Documents →</a>
                    </div>
                    <?php endif; ?>
                    
                    <?php if (hasPermission('freelancer_database') || hasPermission('access_all')): ?>
                    <div style="padding: 1.5rem; background: rgba(255, 107, 53, 0.1); border: 1px solid rgba(255, 107, 53, 0.3); border-radius: 12px;">
                        <h3 style="margin-bottom: 0.5rem; color: #FF6B35;">Freelancer Database</h3>
                        <p style="color: rgba(255, 255, 255, 0.7); font-size: 0.9rem;">
                            <?php echo (hasPermission('freelancer_contacts') || hasPermission('access_all')) ? 'Full access with contacts' : 'View database (no contacts)'; ?>
                        </p>
                        <a href="#" style="color: #FF6B35; text-decoration: none; font-weight: 600;">View Database →</a>
                    </div>
                    <?php endif; ?>
                    
                    <?php if (hasPermission('applications_view') || hasPermission('access_all')): ?>
                    <div style="padding: 1.5rem; background: rgba(255, 107, 53, 0.1); border: 1px solid rgba(255, 107, 53, 0.3); border-radius: 12px;">
                        <h3 style="margin-bottom: 0.5rem; color: #FF6B35;">Applications</h3>
                        <p style="color: rgba(255, 255, 255, 0.7); font-size: 0.9rem;">View and manage job applications</p>
                        <a href="#" style="color: #FF6B35; text-decoration: none; font-weight: 600;">View Applications →</a>
                    </div>
                    <?php endif; ?>
                    
                    <?php if (hasPermission('positions_create') || hasPermission('access_all')): ?>
                    <div style="padding: 1.5rem; background: rgba(255, 107, 53, 0.1); border: 1px solid rgba(255, 107, 53, 0.3); border-radius: 12px;">
                        <h3 style="margin-bottom: 0.5rem; color: #FF6B35;">Create Position</h3>
                        <p style="color: rgba(255, 255, 255, 0.7); font-size: 0.9rem;">Create new job positions</p>
                        <a href="#" style="color: #FF6B35; text-decoration: none; font-weight: 600;">Create →</a>
                    </div>
                    <?php endif; ?>
                </div>
                
                <a href="../../api/auth/logout.php" class="logout-btn" style="margin-top: 2rem;">Logout</a>
            </div>
        </div>
    </div>
</body>
</html>

