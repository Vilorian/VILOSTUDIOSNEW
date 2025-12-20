<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

try {
    // Get disk space information
    $rootPath = $_SERVER['DOCUMENT_ROOT'] ?: dirname(__DIR__, 2);
    
    // Get total and free space
    $totalSpace = disk_total_space($rootPath);
    $freeSpace = disk_free_space($rootPath);
    $usedSpace = $totalSpace - $freeSpace;
    
    // Get inode information (Linux/Unix only)
    $inodeInfo = null;
    if (PHP_OS_FAMILY !== 'Windows') {
        $statvfs = statvfs($rootPath);
        if ($statvfs !== false) {
            $inodeInfo = [
                'total' => $statvfs['files'],
                'free' => $statvfs['ffree'],
                'used' => $statvfs['files'] - $statvfs['ffree']
            ];
        }
    }
    
    // Format bytes to human readable
    function formatBytes($bytes, $precision = 2) {
        $units = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= (1 << (10 * $pow));
        return round($bytes, $precision) . ' ' . $units[$pow];
    }
    
    // Calculate percentages
    $spaceUsedPercent = $totalSpace > 0 ? ($usedSpace / $totalSpace) * 100 : 0;
    $inodeUsedPercent = $inodeInfo && $inodeInfo['total'] > 0 
        ? ($inodeInfo['used'] / $inodeInfo['total']) * 100 
        : null;
    
    // Determine warning status (80% = warning, 90% = critical)
    $spaceWarning = $spaceUsedPercent >= 90 ? 'critical' : ($spaceUsedPercent >= 80 ? 'warning' : 'ok');
    $inodeWarning = $inodeUsedPercent !== null 
        ? ($inodeUsedPercent >= 90 ? 'critical' : ($inodeUsedPercent >= 80 ? 'warning' : 'ok'))
        : null;
    
    echo json_encode([
        'success' => true,
        'space' => [
            'total' => $totalSpace,
            'free' => $freeSpace,
            'used' => $usedSpace,
            'total_formatted' => formatBytes($totalSpace),
            'free_formatted' => formatBytes($freeSpace),
            'used_formatted' => formatBytes($usedSpace),
            'used_percent' => round($spaceUsedPercent, 2),
            'status' => $spaceWarning
        ],
        'inodes' => $inodeInfo ? [
            'total' => $inodeInfo['total'],
            'free' => $inodeInfo['free'],
            'used' => $inodeInfo['used'],
            'used_percent' => round($inodeUsedPercent, 2),
            'status' => $inodeWarning
        ] : null,
        'path' => $rootPath,
        'os' => PHP_OS_FAMILY
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to retrieve storage information: ' . $e->getMessage()
    ]);
}
?>

