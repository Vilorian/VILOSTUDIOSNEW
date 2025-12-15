<?php
// Database configuration
$host = '127.0.0.1:3306';
$dbname = 'u431247581_vilostudios';
$username = 'root'; // Update with your database username
$password = ''; // Update with your database password

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $username,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );
} catch (PDOException $e) {
    error_log("Database connection error: " . $e->getMessage());
    die(json_encode([
        'success' => false,
        'message' => 'Database connection failed.'
    ]));
}
?>


