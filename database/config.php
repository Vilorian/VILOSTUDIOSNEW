<?php
// Load .env from environment folder if it exists
$envPaths = [
    __DIR__ . '/../environment/.env',
    __DIR__ . '/../environments/.env',
];
foreach ($envPaths as $p) {
    if (file_exists($p)) {
        $lines = @file($p, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [];
        foreach ($lines as $line) {
            $line = trim($line);
            if ($line === '' || strpos($line, '#') === 0) continue;
            if (strpos($line, '=') !== false) {
                list($k, $v) = explode('=', $line, 2);
                $k = trim($k); $v = trim($v);
                if (!getenv($k)) putenv("$k=$v");
            }
        }
        break;
    }
}

$host = getenv('DB_HOST') ?: 'localhost';
$dbname = getenv('DB_NAME') ?: 'u431247581_vilostudios';
$username = getenv('DB_USER') ?: 'u431247581_vilostudios';
$password = getenv('DB_PASSWORD') ?: '';
$port = getenv('DB_PORT') ?: '3306';

try {
    $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";
    if ($port && $port !== '3306') {
        $dsn .= ";port=$port";
    }
    $pdo = new PDO(
        $dsn,
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
    if (php_sapi_name() !== 'cli') {
        header('Content-Type: application/json');
        http_response_code(500);
    }
    die(json_encode([
        'success' => false,
        'message' => 'Database connection failed.'
    ]));
}
?>


