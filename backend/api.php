<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/controllers/DepartmentController.php';

// Báo cho trình duyệt sắp gửi dữ liệu sang json
header('Content-Type: application/json');
/** @var PDO $pdo - Biến này được import từ config.php * */
$module = $_GET['module'] ?? "";
$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($module) {
        case "departments":
            $controller = new DepartmentController($pdo);
            if ($method === 'POST') {
                $controller->createDepartment();
            } elseif ($method === 'DELETE') {
                $controller->deleteDepartment();
            } elseif ($method === 'PUT') {
                $controller->updateDepartment();
            } else {
                $controller->getAllDepartments();
            }
            break;

        default:
            echo json_encode(['success' => false, 'message' => 'Hành Động không hợp lệ']);
            break;
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>