<?php 

require_once __DIR__ . '/../models/DepartmentModel.php';

class DepartmentController {
    private $model;

    public function __construct($pdo){
        $this->model = new DepartmentModel($pdo);
    }

    public function getAllDepartments(){
        $departments = $this->model->getAll();
        echo json_encode(['success' => true, 'data' => $departments]);
    }

    public function createDepartment(){
        $json_data = file_get_contents('php://input');
        $data = json_decode($json_data);

        if (!$data || empty($data->name)){
            echo json_encode(['success' => false, 'message' => 'Tên phòng ban là bắt buộc']);
            return;
        }

        $name = $data->name;
        $success = $this->model->create($name);

        if($success){
            echo json_encode(['success' => true, 'message' => "Đã tạo thành công phòng ban!"]);
            }
        else{
            echo json_encode(['success'=> false,'message'=> "LỖI: Không thể tạo phòng ban"]);
        }
    }

    public function deleteDepartment(){
        // Tìm GET cái id
        $id = $_GET["id"] ?? null;

        if(!$id){
            echo json_encode(["success"=> false,"message"=> "ID phòng ban là bắt buộc."]);
            return;
        }
        // Nếu success thì delete ID đó
        $success = $this->model->delete($id);

        if($success){
            echo json_encode(["success"=> true, "message"=> "Đã xoá thành công phòng ban"]);
        } else{
            echo json_encode(['success' => false, 'message'=> "LỖI: Không thể xoá phòng ban"]);
        }
    }
}

?>