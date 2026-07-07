import { useEffect, useState } from "react";

function AdminAttendancePage() {
    const API = "https://localhost:7019/api/admin/attendance";

    const [attendances, setAttendances] = useState([]);
    const [todayStatus, setTodayStatus] = useState(null);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");
    const admin = JSON.parse(localStorage.getItem("admin"));
    const role = admin?.role || "Staff";

    const isAdmin = role === "Admin";

    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    const loadData = async () => {
        try {
            const res = await fetch(API, config);

            if (res.ok) {
                const data = await res.json();
                setAttendances(Array.isArray(data) ? data : []);
            } else {
                const text = await res.text();
                console.log("Attendance list error:", text);
                setAttendances([]);
            }

            if (!isAdmin) {
                const todayRes = await fetch(`${API}/today`, config);

                if (todayRes.ok) {
                    const todayData = await todayRes.json();
                    setTodayStatus(todayData);
                } else {
                    const text = await todayRes.text();
                    console.log("Today attendance error:", text);
                    setTodayStatus(null);
                }
            }
        } catch (err) {
            console.log(err);
            alert("Không tải được dữ liệu chấm công");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const readResponse = async (res) => {
        const text = await res.text();

        try {
            return JSON.parse(text);
        } catch {
            return text;
        }
    };

    const checkIn = async () => {
        try {
            const res = await fetch(`${API}/check-in`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await readResponse(res);

            if (!res.ok) {
                alert(data?.message || data || "Không thể chấm công vào ca");
                return;
            }

            alert("Chấm công vào ca thành công");
            loadData();
        } catch (err) {
            console.log(err);
            alert("Lỗi chấm công vào ca");
        }
    };

    const checkOut = async () => {
        try {
            const res = await fetch(`${API}/check-out`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await readResponse(res);

            if (!res.ok) {
                alert(data?.message || data || "Không thể chấm công ra ca");
                return;
            }

            alert("Chấm công ra ca thành công");
            loadData();
        } catch (err) {
            console.log(err);
            alert("Lỗi chấm công ra ca");
        }
    };

    const formatDateTime = (value) => {
        if (!value) return "Chưa có";
        return new Date(value).toLocaleString("vi-VN");
    };

    const formatHours = (value) => {
        return Number(value || 0).toFixed(2);
    };

    const todayAttendance = todayStatus?.attendance;

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-danger" />
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1">
                        Chấm công nhân viên
                    </h2>

                    <div className="text-muted">
                        {isAdmin
                            ? "Admin xem lịch sử chấm công của nhân viên."
                            : "Staff chấm công vào ca, ra ca và xem lịch sử làm việc."}
                    </div>
                </div>

                <div className="fw-bold">
                    Role:{" "}
                    <span className="text-danger">
                        {role}
                    </span>
                </div>
            </div>

            {!isAdmin && (
                <>
                    <div className="row g-4 mb-4">
                        <div className="col-md-4">
                            <div className="card border-0 shadow-sm rounded-4 h-100">
                                <div className="card-body">
                                    <div className="text-muted mb-1">
                                        Nhân viên
                                    </div>

                                    <h4 className="fw-bold">
                                        {todayStatus?.fullName || admin?.fullName}
                                    </h4>

                                    <div className="text-muted">
                                        {todayStatus?.email || admin?.email}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="card border-0 shadow-sm rounded-4 h-100">
                                <div className="card-body">
                                    <div className="text-muted mb-1">
                                        Trạng thái hôm nay
                                    </div>

                                    {!todayAttendance ? (
                                        <h4 className="fw-bold text-secondary">
                                            Chưa vào ca
                                        </h4>
                                    ) : todayAttendance.status === "Working" ? (
                                        <h4 className="fw-bold text-primary">
                                            Đang làm việc
                                        </h4>
                                    ) : (
                                        <h4 className="fw-bold text-success">
                                            Đã tan ca
                                        </h4>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="card border-0 shadow-sm rounded-4 h-100">
                                <div className="card-body">
                                    <div className="text-muted mb-1">
                                        Thao tác
                                    </div>

                                    {!todayAttendance && (
                                        <button
                                            className="btn btn-success w-100 py-3 fw-bold"
                                            onClick={checkIn}
                                        >
                                            ✅ Chấm công vào ca
                                        </button>
                                    )}

                                    {todayAttendance?.status === "Working" && (
                                        <button
                                            className="btn btn-danger w-100 py-3 fw-bold"
                                            onClick={checkOut}
                                        >
                                            🚪 Chấm công ra ca
                                        </button>
                                    )}

                                    {todayAttendance?.status === "Completed" && (
                                        <button
                                            className="btn btn-secondary w-100 py-3 fw-bold"
                                            disabled
                                        >
                                            Đã hoàn thành ca hôm nay
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {todayAttendance && (
                        <div className="card border-0 shadow-sm rounded-4 mb-4">
                            <div className="card-body">
                                <h5 className="fw-bold mb-3">
                                    Ca làm hôm nay
                                </h5>

                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="text-muted">
                                            Vào ca
                                        </div>

                                        <div className="fw-bold">
                                            {formatDateTime(todayAttendance.checkInTime)}
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="text-muted">
                                            Ra ca
                                        </div>

                                        <div className="fw-bold">
                                            {formatDateTime(todayAttendance.checkOutTime)}
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="text-muted">
                                            Tổng giờ
                                        </div>

                                        <div className="fw-bold text-danger">
                                            {formatHours(todayAttendance.totalHours)} giờ
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            {isAdmin && (
                <div
                    className="alert alert-info rounded-4 border-0 shadow-sm"
                >
                    Admin không cần chấm công. Trang này chỉ dùng để xem lịch sử chấm công của Staff/Warehouse.
                </div>
            )}

            <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body">
                    <h5 className="fw-bold mb-3">
                        Lịch sử chấm công
                    </h5>

                    <div className="table-responsive">
                        <table className="table align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>Nhân viên</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Vào ca</th>
                                    <th>Ra ca</th>
                                    <th>Tổng giờ</th>
                                    <th>Trạng thái</th>
                                </tr>
                            </thead>

                            <tbody>
                                {attendances.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="text-center text-muted py-5"
                                        >
                                            Chưa có dữ liệu chấm công
                                        </td>
                                    </tr>
                                ) : (
                                    attendances.map((item) => (
                                        <tr key={item.id}>
                                            <td className="fw-bold">
                                                {item.employeeName}
                                            </td>

                                            <td>
                                                {item.employeeEmail}
                                            </td>

                                            <td>
                                                <span className="badge bg-primary">
                                                    {item.employeeRole}
                                                </span>
                                            </td>

                                            <td>
                                                {formatDateTime(item.checkInTime)}
                                            </td>

                                            <td>
                                                {formatDateTime(item.checkOutTime)}
                                            </td>

                                            <td className="fw-bold text-danger">
                                                {formatHours(item.totalHours)} giờ
                                            </td>

                                            <td>
                                                {item.status === "Working" ? (
                                                    <span className="badge bg-warning text-dark">
                                                        Đang làm
                                                    </span>
                                                ) : (
                                                    <span className="badge bg-success">
                                                        Hoàn thành
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminAttendancePage;