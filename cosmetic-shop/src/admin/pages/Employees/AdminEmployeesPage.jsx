import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
    FaUserTie,
    FaPlus,
    FaSearch,
    FaEdit,
    FaTrash,
    FaLock,
    FaUnlock
} from "react-icons/fa";

function AdminEmployeesPage() {
    const API = "https://localhost:7019/api/admin/employees";

    const [employees, setEmployees] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [roleFilter, setRoleFilter] = useState("All");
    const [showForm, setShowForm] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        role: "Staff"
    });

    const loadEmployees = async () => {
        const res = await axios.get(API);
        setEmployees(res.data);
    };

    useEffect(() => {
        loadEmployees();
    }, []);

    const filteredEmployees = useMemo(() => {
        return employees.filter((e) => {
            const text = `${e.fullName} ${e.email} ${e.phone} ${e.role}`.toLowerCase();

            const matchSearch = text.includes(keyword.toLowerCase());
            const matchRole = roleFilter === "All" || e.role === roleFilter;

            return matchSearch && matchRole;
        });
    }, [employees, keyword, roleFilter]);

    const resetForm = () => {
        setForm({
            fullName: "",
            email: "",
            password: "",
            phone: "",
            role: "Staff"
        });

        setEditingEmployee(null);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingEmployee) {
                await axios.put(`${API}/${editingEmployee.id}`, form);
                alert("Cập nhật nhân viên thành công");
            } else {
                await axios.post(API, form);
                alert("Thêm nhân viên thành công");
            }

            resetForm();
            loadEmployees();
        } catch (err) {
            alert(err.response?.data || "Có lỗi xảy ra");
        }
    };

    const handleEdit = (employee) => {
        setEditingEmployee(employee);

        setForm({
            fullName: employee.fullName,
            email: employee.email,
            password: "",
            phone: employee.phone,
            role: employee.role
        });

        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Xóa nhân viên này?")) return;

        try {
            await axios.delete(`${API}/${id}`);
            loadEmployees();
        } catch (err) {
            alert(err.response?.data || "Không thể xóa nhân viên");
        }
    };

    const handleStatus = async (id) => {
        try {
            await axios.put(`${API}/${id}/status`);
            loadEmployees();
        } catch (err) {
            alert(err.response?.data || "Không thể đổi trạng thái");
        }
    };

    const roleBadge = (role) => {
        if (role === "Admin") {
            return <span className="badge bg-danger">Admin</span>;
        }

        if (role === "Warehouse") {
            return <span className="badge bg-primary">Warehouse</span>;
        }

        return <span className="badge bg-success">Staff</span>;
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1">Quản lý nhân viên</h2>
                    <p className="text-muted mb-0">
                        Thêm, sửa, khóa và quản lý tài khoản nhân viên.
                    </p>
                </div>

                <button
                    className="btn btn-danger rounded-3 px-4"
                    onClick={() => {
                        resetForm();
                        setShowForm(true);
                    }}
                >
                    <FaPlus /> Thêm nhân viên
                </button>
            </div>

            <div className="row g-4 mb-4">
                <StatCard title="Tổng nhân viên" value={employees.length} />
                <StatCard
                    title="Đang hoạt động"
                    value={employees.filter((x) => x.isActive).length}
                />
                <StatCard
                    title="Đã khóa"
                    value={employees.filter((x) => !x.isActive).length}
                />
                <StatCard
                    title="Admin"
                    value={employees.filter((x) => x.role === "Admin").length}
                />
            </div>

            <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-8">
                            <label className="form-label fw-semibold">
                                <FaSearch /> Tìm kiếm
                            </label>
                            <input
                                className="form-control"
                                placeholder="Tìm tên, email, số điện thoại..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label fw-semibold">
                                Lọc chức vụ
                            </label>
                            <select
                                className="form-select"
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                            >
                                <option value="All">Tất cả</option>
                                <option value="Admin">Admin</option>
                                <option value="Staff">Staff</option>
                                <option value="Warehouse">Warehouse</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body">
                    <h5 className="fw-bold mb-3">Danh sách nhân viên</h5>

                    <div className="table-responsive">
                        <table className="table align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>Nhân viên</th>
                                    <th>Email</th>
                                    <th>Số điện thoại</th>
                                    <th>Chức vụ</th>
                                    <th>Trạng thái</th>
                                    <th>Ngày tạo</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredEmployees.map((e) => (
                                    <tr key={e.id}>
                                        <td>
                                            <div className="d-flex align-items-center gap-3">
                                                <div
                                                    className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                                                    style={{
                                                        width: 45,
                                                        height: 45
                                                    }}
                                                >
                                                    <FaUserTie className="text-danger" />
                                                </div>

                                                <div className="fw-semibold">
                                                    {e.fullName}
                                                </div>
                                            </div>
                                        </td>

                                        <td>{e.email}</td>
                                        <td>{e.phone || "Chưa có"}</td>
                                        <td>{roleBadge(e.role)}</td>

                                        <td>
                                            {e.isActive ? (
                                                <span className="badge bg-success">
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="badge bg-secondary">
                                                    Locked
                                                </span>
                                            )}
                                        </td>

                                        <td>
                                            {new Date(e.createdAt).toLocaleDateString("vi-VN")}
                                        </td>

                                        <td>
                                            <div className="d-flex gap-2">
                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() => handleEdit(e)}
                                                >
                                                    <FaEdit />
                                                </button>

                                                <button
                                                    className={
                                                        e.isActive
                                                            ? "btn btn-sm btn-outline-warning"
                                                            : "btn btn-sm btn-outline-success"
                                                    }
                                                    onClick={() => handleStatus(e.id)}
                                                >
                                                    {e.isActive ? <FaLock /> : <FaUnlock />}
                                                </button>

                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleDelete(e.id)}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {showForm && (
                <div
                    className="modal fade show"
                    style={{
                        display: "block",
                        background: "rgba(0,0,0,0.45)"
                    }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 rounded-4 shadow">
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">
                                    {editingEmployee
                                        ? "Sửa nhân viên"
                                        : "Thêm nhân viên"}
                                </h5>

                                <button
                                    className="btn-close"
                                    onClick={resetForm}
                                ></button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">
                                            Họ tên
                                        </label>
                                        <input
                                            className="form-control"
                                            value={form.fullName}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    fullName: e.target.value
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            value={form.email}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    email: e.target.value
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">
                                            Mật khẩu
                                        </label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            placeholder={
                                                editingEmployee
                                                    ? "Để trống nếu không đổi"
                                                    : "Nhập mật khẩu"
                                            }
                                            value={form.password}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    password: e.target.value
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">
                                            Số điện thoại
                                        </label>
                                        <input
                                            className="form-control"
                                            value={form.phone}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    phone: e.target.value
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">
                                            Chức vụ
                                        </label>
                                        <select
                                            className="form-select"
                                            value={form.role}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    role: e.target.value
                                                })
                                            }
                                        >
                                            <option value="Admin">Admin</option>
                                            <option value="Staff">Staff</option>
                                            <option value="Warehouse">Warehouse</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-light"
                                        onClick={resetForm}
                                    >
                                        Hủy
                                    </button>

                                    <button
                                        type="submit"
                                        className="btn btn-danger"
                                    >
                                        Lưu
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatCard({ title, value }) {
    return (
        <div className="col-md-3">
            <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body">
                    <p className="text-muted mb-1">{title}</p>
                    <h3 className="fw-bold mb-0">{value}</h3>
                </div>
            </div>
        </div>
    );
}

export default AdminEmployeesPage;