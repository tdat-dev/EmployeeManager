// Lấy các element mà router cần
const view = document.getElementById("view");
const pageTitle = document.getElementById("pageTitle");
const menuItems = document.querySelectorAll(".menu-item[data-route]");

// Hàm chính để điều hướng
export async function navigateTo(route) {
    // Check route running?
    console.log(`Đang điều hướng đến: ${route}`);

    // Cập nhật class 'active' cho menu
    menuItems.forEach((item) => {
        item.classList.remove("active");
    });
    const activeItem = document.querySelector(`.menu-item[data-route="${route}"]`);
    if (activeItem) {
        activeItem.classList.add("active");
    }

    try {
        // Tải nội dung (View) dựa trên route
        switch (route) {
            case "dashboard":
                pageTitle.textContent = "Dashboard";
                view.innerHTML = `
    <div class = "card">
        <h2>Chào mừng đến với dashboard</h2>
        <p>Đây là trang tổng quan của hệ thống quản lý nhân sự</p>
    </div>
    `;
                break;

            case "employee-db":
                pageTitle.textContent = "Danh sách nhân viên";
                view.innerHTML = `
      <div class="card">
        <h2>Quản lý Nhân viên</h2>
        <p>Đây là nơi hiển thị bảng (table) danh sách nhân viên.</p>
      </div>
      `;
                break;
            case "employees-add":
                pageTitle.textContent = "Thêm nhân viên";
                view.innerHTML = `
        <div class="card">
            <h2>Thêm Nhân viên mới</h2>
            <p>Đây là nơi hiển thị form để thêm nhân viên.</p>
        </div>
            `;
                break;
            case "departments":
                pageTitle.textContent = "Quản lý Phòng ban";
                view.innerHTML = `
        <div class="card">
            <p>Đang tải dữ liệu...</p>
        </div>
            `;
                const response = await fetch("../backend/api.php?module=departments");
                const result = await response.json();
                if (result.success) {
                    const departmentsHTML = result.data
                        .map((dept) => {
                            return `
          <tr>
              <td>${dept.id}</td>
              <td>${dept.name}</td>
              <td>
                  <button class="secondary">Sửa</button>
                  <button class="danger delete-btn" data-id="${dept.id}">Xóa</button>
              </td>
          </tr>
          `;
                        })
                        .join("");
                    view.innerHTML = `
              <div class="card" style="margin-bottom: 24px;">
                  <h2>Thêm Phòng ban Mới</h2>
                  
                  <form id="addDepartmentForm">
                      <div style="display: flex; gap: 12px; align-items: flex-end;">
                          
                          <div style="flex-grow: 1;"> <label for="departmentName">Tên Phòng ban:</label>
                              <input type="text" placeholder="Ví dụ: Phòng Kế toán, Phòng Nhân sự..." id="departmentName" required>
                          </div>

                          <button type="submit" class="primary" id="addDeptSaveBtn">
                              <i class="fas fa-plus"></i> Thêm
                          </button>
                      </div>
                  </form>
              </div>

              <div class="card">
                  <h2>Danh sách Phòng ban</h2>
                  <table class="table">
                      <thead>
                          <tr><th>ID</th><th>Tên Phòng ban</th><th>Hành động</th></tr>
                      </thead>
                      <tbody>
                          ${departmentsHTML} 
                      </tbody>
                  </table>
              </div>
            `;

                    const addForm = document.getElementById("addDepartmentForm");
                    const nameInput = document.getElementById("departmentName");
                    const saveButton = document.getElementById("addDeptSaveBtn");
                    // Khi người dùng bấm "submit"
                    addForm.addEventListener("submit", async (event) => {
                        event.preventDefault(); // Ngăn trình duyệt tải lại trang
                        const name = nameInput.value.trim(); // Lấy tên từ ô input

                        if (name) {
                            // Tắt nút button để tránh lưu 2 lần
                            saveButton.disabled = true;
                            saveButton.textContent = "Đang lưu...";

                            const createResponse = await fetch("../backend/api.php?module=departments", {
                                method: "POST", headers: {
                                    "Content-Type": "application/json",
                                }, body: JSON.stringify({name: name}),
                            });
                            const createResult = await createResponse.json();

                            // Bật lại nút lưu
                            saveButton.disabled = false;
                            saveButton.innerHTML = '<i class="fas fa-plus"></i> Thêm';
                            if (createResult.success) {
                                alert(createResult.message);
                                navigateTo("departments");
                            } else {
                                alert(`LỖI: ${createResult.message}`);
                            }
                        }
                    });

                    const deleteButtons = document.querySelectorAll(".delete-btn");
                    deleteButtons.forEach(button => {
                        button.addEventListener("click", async () => {
                            const id = button.dataset.id;

                            const isConfirmed = confirm(`Bạn có CHẮC CHẮN muốn xoá phòng ban (ID: ${id}) này không?`);
                            if (isConfirmed) {
                                try {
                                    const deleteResponse = await fetch(`../backend/api.php?module=departments&id=${id}`, {
                                        method: "DELETE",
                                    });
                                    const deleteResult = await deleteResponse.json();
                                    if (deleteResult.success) {
                                        alert(deleteResult.message);
                                        navigateTo("departments");
                                    } else {
                                        alert(`LỖI: ${deleteResult.message}`);
                                    }
                                } catch (error) {
                                    alert("Lỗi kết nối khi xoá: " + error.message);
                                }
                            }
                        });
                    });
                } else {
                    view.innerHTML = `<div class="alert error">Lỗi: ${result.message}</div>`;
                }
                break;

            // If no matching route is found
            default:
                pageTitle.textContent = "Lỗi 404";
                view.innerHTML = `
        <div class="card">
            <h2>Trang không tìm thấy!</h2>
            <p>Route '${route}' không hợp lệ.</p>
        </div>
    `;
        }
    } catch (error) {
        console.error("Lỗi khi điều hướng:", error);

        pageTitle.textContent = "Lỗi";
        view.innerHTML = `
      <div class="card">
        <h2>Đã xảy ra lỗi!</h2>
        <p>${error.message}</p>
        <button class="primary" onclick="location.reload()">Tải lại trang</button>
      </div>
    `;
    }
}
