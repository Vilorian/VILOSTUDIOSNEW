<?php
// Quick script to hash kevin's password
// Run this once: php api/auth/hash_password.php

$password = 'Tankcrev#1';
$hashed = password_hash($password, PASSWORD_DEFAULT);

echo "Password: $password\n";
echo "Hashed: $hashed\n";
echo "\nSQL Update:\n";
echo "UPDATE admin_users SET password_hash = '$hashed', role = 'manager' WHERE email = 'kevin@vilostudios.com';\n";
echo "\nOr if kevin doesn't exist:\n";
echo "INSERT INTO admin_users (email, password_hash, role, created_at) VALUES ('kevin@vilostudios.com', '$hashed', 'manager', NOW());\n";
?>


