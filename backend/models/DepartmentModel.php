<?php 

class DepartmentModel {
    private $pdo;

    public function __construct($pdo){
        $this->pdo = $pdo;
    }

    public function getAll(){
        $stmt = $this->pdo->query("SELECT * FROM departments ORDER BY name");
        return $stmt->fetchAll();
    }

    public function create($name){
        $sql = "INSERT INTO departments (name) VALUES (?)";
        $stmt = $this->pdo->prepare($sql);

        return $stmt->execute([$name]);
    }
}

?>