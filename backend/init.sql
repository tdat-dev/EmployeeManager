CREATE DATABASE IF NOT EXISTS `hrm`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE `hrm`;

-- Parent table: departments (must exist before referencing it)
CREATE TABLE IF NOT EXISTS departments (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Users
CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Positions (references departments)
CREATE TABLE IF NOT EXISTS positions (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    base_salary DECIMAL(10,2),
    department_id INT DEFAULT NULL,
    PRIMARY KEY (id),
    INDEX idx_positions_department (department_id),
    CONSTRAINT fk_positions_department FOREIGN KEY (department_id)
      REFERENCES departments(id)
      ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Employees (references departments and positions)
CREATE TABLE IF NOT EXISTS employees (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    department_id INT DEFAULT NULL,
    position_id INT DEFAULT NULL,
    salary DECIMAL(10,2),
    hire_date DATE,
    PRIMARY KEY (id),
    INDEX idx_employees_department (department_id),
    INDEX idx_employees_position (position_id),
    CONSTRAINT fk_employees_department FOREIGN KEY (department_id)
      REFERENCES departments(id)
      ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT fk_employees_position FOREIGN KEY (position_id)
      REFERENCES positions(id)
      ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Attendance (references employees)
CREATE TABLE IF NOT EXISTS attendance (
    id INT NOT NULL AUTO_INCREMENT,
    employee_id INT NOT NULL,
    date DATE NOT NULL,
    check_in TIME,
    check_out TIME,
    PRIMARY KEY (id),
    INDEX idx_attendance_employee (employee_id),
    CONSTRAINT fk_attendance_employee FOREIGN KEY (employee_id)
      REFERENCES employees(id)
      ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Leaves (references employees)
CREATE TABLE IF NOT EXISTS leaves (
    id INT NOT NULL AUTO_INCREMENT,
    employee_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    PRIMARY KEY (id),
    INDEX idx_leaves_employee (employee_id),
    CONSTRAINT fk_leaves_employee FOREIGN KEY (employee_id)
      REFERENCES employees(id)
      ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Reviews (references employees)
CREATE TABLE IF NOT EXISTS reviews (
    id INT NOT NULL AUTO_INCREMENT,
    employee_id INT NOT NULL,
    rating INT,
    feedback TEXT,
    review_date DATE,
    PRIMARY KEY (id),
    INDEX idx_reviews_employee (employee_id),
    CONSTRAINT fk_reviews_employee FOREIGN KEY (employee_id)
      REFERENCES employees(id)
      ON UPDATE CASCADE ON DELETE CASCADE,
    CHECK (rating BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
