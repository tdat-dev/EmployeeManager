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
echo "Đã kết nối thành công tới database '$db_name' thành công. ";
} catch(PDOException $e) {
    // Dừng chương trình và báo lỗi
    die("LỖI: Không thể kết nối tới database. ". $e ->getMessage());
}

// Test truy vấn
try{
    echo "<h2>Bắt đầu thử nghiệm truy vấn...</h2>";

    $pdo->exec("INSERT IGNORE INTO departments (id, name) VALUES (1, 'Phòng kỹ thuật'),(2, 'Phòng Kế toán');");
    $pdo->exec("INSERT IGNORE INTO positions (id, title, base_salary) VALUES (1, 'Trưởng phòng', 20000), (2, 'Nhân viên', 10000);");
    echo "<p>Đã thêm dữ liệu mẫu (hoặc đã tồn tại)</p>";
    echo "<h3>Danh sách Phòng ban (lấy từ MySQL):</h3>";

    $stmt = $pdo->query("SELECT * FROM departments");

    echo "<ul>";

    // Lặp qua từng kết quả
    while ($row = $stmt->fetch()) {
        echo "<li>ID: ". $row['id'] . "- Tên: ". $row['name']. "</li>";
    }
    echo "</ul>";

    echo "<h3>Test thành công!</h3>";
} catch(PDOException $e){
    die("LỖI TRUY VẤN SQL: ". $e->getMessage());
}
?>