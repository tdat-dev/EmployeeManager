<?php 
require_once __DIR__ . '/config.php';
require_once __DIR__ .'/controllers/DepartmentController.php';

// Báo cho trình duyệt sắp gửi dữ liệu sang json
header('Content-Type: application/json');

$module = $_GET['module'] ?? "";

try{
switch ($module) {
    case "departments":
        $controller = new DepartmentController($pdo);
        if($_SERVER['REQUEST_METHOD'] === 'POST'){
            $controller->createDepartment();
        } else{
            $controller->getAllDepartments();
        }
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Hành Động không hợp lệ']);
        break;
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message'=> $e->getMessage()]);
}
?>