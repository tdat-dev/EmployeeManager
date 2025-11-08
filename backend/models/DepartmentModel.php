<?php

class DepartmentModel
{
    private $pdo;

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }

    public function getAll()
    {
        $stmt = $this->pdo->query("SELECT * FROM departments ORDER BY name");
        return $stmt->fetchAll();
    }

    public function create($name)
    {
        $sql = "INSERT INTO departments (name) VALUES (?)";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([$name]);
    }

    /*
     * @param $id - ID của phòng ban cần sửa
     * @param $name - Tên mới của phòng ban
     */
    public function update($id, $name)
    {
        $sql = "UPDATE departments SET name = ? WHERE id = ?";

        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([$name, $id]);
    }

    public function delete($id)
    {
        $sql = "DELETE FROM departments WHERE id = ?";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([$id]);
    }
}

?>