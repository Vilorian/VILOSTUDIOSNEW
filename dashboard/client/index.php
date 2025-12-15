<?php
session_start();

if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'client') {
    header('Location: ../../login.html');
    exit;
}

$userName = $_SESSION['user_name'] ?? $_SESSION['user_email'] ?? 'Client';
$userEmail = $_SESSION['user_email'] ?? '';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Client Dashboard - VILOSTUDIOS</title>
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
                <h1 class="welcome-message">Client Dashboard</h1>
                <div class="user-info">
                    <p>Welcome, <?php echo htmlspecialchars($userName); ?>!</p>
                    <p>Email: <?php echo htmlspecialchars($userEmail); ?></p>
                    <span class="role-badge">Client</span>
                </div>
                <p>Client dashboard content will be available here.</p>
                <a href="../../api/auth/logout.php" class="logout-btn">Logout</a>
            </div>
        </div>
    </div>
</body>
</html>


