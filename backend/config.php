<?php 

$host = 'localhost';
$db_name = 'hrm';
$username = 'root';
$password = '';

// Tạo kết nối PDO
try {
    $pdo = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8",
    $username,
    $password
);

// Thiết lập cho PDO xử lý lỗi
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    // Dừng chương trình và báo lỗi
    die("LỖI: Không thể kết nối tới database. ". $e ->getMessage());
}
?>