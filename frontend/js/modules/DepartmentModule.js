export class DepartmentModule {
    view;
    pageTitle;
    navigateTo;

    constructor(view, pageTitle, navigateTo) {
        this.view = view;
        this.pageTitle = pageTitle;
        this.navigateTo = navigateTo;
    }

    async render() {
        this.pageTitle.textContent = "Quản lý Phòng ban";
        this.view.innerHTML = `
        <div class="card">
            <p>Đang tải dữ liệu...</p>
        </div>
            `;

        try {
            // Lấy (GET) dữ liệu
            const response = await fetch('../backend/api.php?module=departments');
            const result = await response.json();

            // Nếu (GET) thành công thì chạy
            if (result.success) {
                // Vẽ ra HTML
                this.renderView(result.data);
                // Xử lý attach các nút
                this.attachEventListeners();
            } else {
                this.view.innerHTML = `<div class="alert error">LỖI: ${result.message}</div>`;
            }
        } catch (error) {
            console.error("Lỗi khi tải module phòng ban: ", error)
            this.view.innerHTML = `<div class="alert error">LỖI kết nối: ${error.message}</div>`;
        }
    }

    // Hàm tạo ra giao diện HTML
    renderView(departments) {
        const departmentsHTML = departments.map((dept) => {
            return `
          <tr>
              <td>${dept.id}</td>
              <td>${dept.name}</td>
              <td>
                  <button class="secondary edit-btn" data-id="${dept.id}" data-name="${dept.name}">Sửa</button>
                  <button class="danger delete-btn" data-id="${dept.id}">Xóa</button>
              </td>
          </tr>
          `;
        })
            .join("");
        this.view.innerHTML = `
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
    }

    attachEventListeners() {
        // Logic Tạo thêm phòng ban
        const addForm = document.getElementById("addDepartmentForm");
        const nameInput = document.getElementById("departmentName");
        const saveButton = document.getElementById("addDeptSaveBtn");

        addForm.onsubmit = async (event) => {
            event.preventDefault(); // Ngăn trình duyệt tải lại trang
            const name = nameInput.value.trim(); // Lấy tên từ ô input

            if (name) {
                // Tắt nút button để tránh lưu 2 lần
                saveButton.disabled = true;
                saveButton.textContent = "Đang lưu...";

                const createResponse = await fetch("../backend/api.php?module=departments", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    }, body: JSON.stringify({name: name}),
                });
                const createResult = await createResponse.json();

                // Bật lại nút lưu
                saveButton.disabled = false;
                saveButton.innerHTML = '<i class="fas fa-plus"></i> Thêm';
                if (createResult.success) {
                    alert(createResult.message);
                    this.navigateTo("departments");
                } else {
                    alert(`LỖI: ${createResult.message}`);
                }
            }
        };

        // Xoá phòng ban
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
                            this.navigateTo("departments");
                        } else {
                            alert(`LỖI: ${deleteResult.message}`);
                        }
                    } catch (error) {
                        alert("Lỗi kết nối khi xoá: " + error.message);
                    }
                }
            });
        });

        // Sửa phòng ban
        const editModalOverlay = document.getElementById("editModalOverlay");
        const editModalTitle = document.getElementById("editModalTitle");
        const editModalCancelBtn = document.getElementById("editModalCancelBtn");
        const editDepartmentForm = document.getElementById("editDepartmentForm");
        const editDepartmentId = document.getElementById("editDepartmentId");
        const editDepartmentIdInput = document.getElementById("editDepartmentId");
        const editDepartmentNameInput = document.getElementById("editDepartmentName");
        const editDepartmentName = document.getElementById("editDepartmentName");
        const editModalSaveBtn = document.getElementById("editModalSaveBtn");

        const editButtons = document.querySelectorAll('.edit-btn');

        // Gắn chuông Click cho nút SỬA
        editButtons.forEach(button => {
            button.addEventListener('click', () => {
                const id = button.dataset.id;
                const name = button.dataset.name;

                editModalTitle.textContent = `Sửa phòng ban (ID: ${id})`;
                editDepartmentIdInput.value = id;
                editDepartmentNameInput.value = name;

                editModalOverlay.classList.add('active');
                editDepartmentNameInput.focus();
            });
        });
        //  Gắn chuông Click cho nút HUỶ
        editModalCancelBtn.onclick = () => {
            editModalOverlay.classList.remove('active');
        };

        // Gắn chuông submit cho form LƯU THAY ĐỔI
        editDepartmentForm.onsubmit = async (event) => {
            event.preventDefault(); // Ngăn form trang tải lại

            const id = editDepartmentIdInput.value;
            const newName = editDepartmentNameInput.value.trim();

            if (newName && id) {
                editModalSaveBtn.disabled = true;
                editModalSaveBtn.textContent = "Đang lưu...";

                const updateResponse = await fetch(`../backend/api.php?module=departments&id=${id}&name=${encodeURIComponent(newName)}`, {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({name: newName})
                });
                const updateResult = await updateResponse.json();

                editModalSaveBtn.disabled = false;
                editModalSaveBtn.textContent = "Lưu thay đổi";

                if (updateResult.success) {
                    alert(updateResult.message);
                    editModalOverlay.classList.remove('active');
                    this.navigateTo('departments');
                } else {
                    alert(`LỖI: ${updateResult.message}`);
                }
            }
        };
    }
}