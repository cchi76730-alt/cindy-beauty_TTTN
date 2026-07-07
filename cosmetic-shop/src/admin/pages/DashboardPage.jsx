import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function DashboardPage() {
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalCustomers: 0
    });

    const [latestOrders, setLatestOrders] = useState([]);
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const admin = JSON.parse(localStorage.getItem("admin"));
    const role = admin?.role || "Staff";

    const roleBox = {
        Admin: {
            title: "👑 SUPER ADMIN",
            desc: "Bạn có toàn quyền quản lý hệ thống.",
            bg: "#fff0f3",
            color: "#dc3545"
        },
        Staff: {
            title: "🛒 STAFF WORKSPACE",
            desc: "Bạn đang dùng tài khoản nhân viên bán hàng.",
            bg: "#eef6ff",
            color: "#0d6efd"
        },
        Warehouse: {
            title: "📦 WAREHOUSE WORKSPACE",
            desc: "Bạn đang dùng tài khoản quản lý kho.",
            bg: "#fff7ed",
            color: "#fd7e14"
        }
    };

    const currentRoleBox = roleBox[role] || roleBox.Staff;

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const response = await fetch(
                "https://localhost:7019/api/admin/dashboard"
            );

            const data = await response.json();

            setStats({
                totalRevenue: data.totalRevenue || 0,
                totalOrders: data.totalOrders || 0,
                totalProducts: data.totalProducts || 0,
                totalCustomers: data.totalCustomers || 0
            });

            setLatestOrders(data.latestOrders || []);
            setLowStockProducts(data.lowStockProducts || []);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const getImageSrc = (imageUrl) => {
        if (!imageUrl) return "/no-image.png";

        if (imageUrl.startsWith("http")) {
            return imageUrl;
        }

        if (imageUrl.startsWith("/images/")) {
            return `https://localhost:7019${imageUrl}`;
        }

        return `https://localhost:7019/images/${imageUrl}`;
    };

    const canSeeRevenue = role === "Admin";
    const canSeeCustomers = role === "Admin" || role === "Staff";
    const canSeeOrders = role === "Admin" || role === "Staff";
    const canSeeProducts = role === "Admin" || role === "Staff" || role === "Warehouse";
    const canSeeLowStock = role === "Admin" || role === "Warehouse";

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-danger" />
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <div className="mb-4">
                <h2 className="fw-bold mb-1">
                    Dashboard Overview
                </h2>

                <div className="text-muted">
                    Chào mừng quay lại hệ thống quản trị
                </div>
            </div>

            <div
                className="p-4 rounded-4 mb-4 shadow-sm"
                style={{
                    background: currentRoleBox.bg,
                    border: `1px solid ${currentRoleBox.color}`
                }}
            >
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <div>
                        <h4
                            className="fw-bold mb-1"
                            style={{
                                color: currentRoleBox.color
                            }}
                        >
                            {currentRoleBox.title}
                        </h4>

                        <div className="text-muted">
                            {currentRoleBox.desc}
                        </div>
                    </div>

                    <div
                        className="px-4 py-2 rounded-pill fw-bold"
                        style={{
                            background: "#fff",
                            color: currentRoleBox.color
                        }}
                    >
                        Role: {role}
                    </div>
                </div>
            </div>

            <div className="row g-4 mb-5">
                {canSeeRevenue && (
                    <DashboardCard
                        title="Tổng doanh thu"
                        value={`${stats.totalRevenue?.toLocaleString()}đ`}
                        icon="💰"
                        bg="#fff0f3"
                        color="#ff4d6d"
                        onClick={() => navigate("/admin/orders")}
                    />
                )}

                {canSeeOrders && (
                    <DashboardCard
                        title="Đơn hàng"
                        value={stats.totalOrders}
                        icon="📦"
                        bg="#eef2ff"
                        color="#111827"
                        onClick={() => navigate("/admin/orders")}
                    />
                )}

                {canSeeProducts && (
                    <DashboardCard
                        title="Sản phẩm"
                        value={stats.totalProducts}
                        icon="🛍️"
                        bg="#ecfdf3"
                        color="#111827"
                        onClick={() => navigate("/admin/products")}
                    />
                )}

                {canSeeCustomers && (
                    <DashboardCard
                        title="Khách hàng"
                        value={stats.totalCustomers}
                        icon="👥"
                        bg="#fff7ed"
                        color="#111827"
                        onClick={() => navigate("/admin/customers")}
                    />
                )}
            </div>

            <div className="row g-4">
                {canSeeOrders && (
                    <div className="col-lg-8">
                        <div
                            className="card border-0 shadow-lg"
                            style={{
                                borderRadius: "20px"
                            }}
                        >
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h5 className="fw-bold mb-0">
                                        Đơn hàng mới nhất
                                    </h5>

                                    <button
                                        className="btn btn-light"
                                        onClick={() => navigate("/admin/orders")}
                                    >
                                        Xem tất cả
                                    </button>
                                </div>

                                <div className="table-responsive">
                                    <table className="table align-middle">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Khách hàng</th>
                                                <th>Tổng tiền</th>
                                                <th>Trạng thái</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {latestOrders.length === 0 ? (
                                                <tr>
                                                    <td
                                                        colSpan="4"
                                                        className="text-center text-muted py-4"
                                                    >
                                                        Chưa có đơn hàng
                                                    </td>
                                                </tr>
                                            ) : (
                                                latestOrders.map(order => (
                                                    <tr
                                                        key={order.id}
                                                        style={{
                                                            cursor: "pointer"
                                                        }}
                                                        onClick={() =>
                                                            navigate("/admin/orders")
                                                        }
                                                    >
                                                        <td>#{order.id}</td>
                                                        <td>{order.customerName}</td>
                                                        <td>
                                                            {order.totalAmount?.toLocaleString()}đ
                                                        </td>
                                                        <td>
                                                            <span className="badge bg-success">
                                                                {order.status}
                                                            </span>
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
                )}

                {canSeeLowStock && (
                    <div className="col-lg-4">
                        <div
                            className="card border-0 shadow-lg"
                            style={{
                                borderRadius: "20px",
                                cursor: "pointer"
                            }}
                            onClick={() => navigate("/admin/inventory")}
                        >
                            <div className="card-body p-4">
                                <h5 className="fw-bold mb-4">
                                    Sắp hết hàng
                                </h5>

                                {lowStockProducts.length === 0 ? (
                                    <div className="text-muted">
                                        Không có sản phẩm sắp hết hàng
                                    </div>
                                ) : (
                                    lowStockProducts.map(product => (
                                        <div
                                            key={product.id}
                                            className="d-flex align-items-center justify-content-between mb-3"
                                        >
                                            <div className="d-flex align-items-center gap-3">
                                                <img
                                                    src={getImageSrc(product.imageUrl)}
                                                    alt=""
                                                    className="rounded"
                                                    width="55"
                                                    height="55"
                                                    style={{
                                                        objectFit: "cover"
                                                    }}
                                                    onError={(e) => {
                                                        e.currentTarget.src = "/no-image.png";
                                                    }}
                                                />

                                                <div>
                                                    <div className="fw-semibold">
                                                        {product.name}
                                                    </div>

                                                    <div className="text-muted small">
                                                        Còn: {product.stock}
                                                    </div>
                                                </div>
                                            </div>

                                            <span className="badge bg-danger">
                                                Low
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {role === "Staff" && (
                    <div className="col-lg-4">
                        <div
                            className="card border-0 shadow-lg"
                            style={{
                                borderRadius: "20px"
                            }}
                        >
                            <div className="card-body p-4">
                                <h5 className="fw-bold mb-3">
                                    Staff Quick Actions
                                </h5>

                                <button
                                    className="btn btn-primary w-100 mb-3"
                                    onClick={() => navigate("/admin/orders")}
                                >
                                    Xử lý đơn hàng
                                </button>

                                <button
                                    className="btn btn-outline-primary w-100 mb-3"
                                    onClick={() => navigate("/admin/customers")}
                                >
                                    Xem khách hàng
                                </button>

                                <button
                                    className="btn btn-outline-primary w-100"
                                    onClick={() => navigate("/admin/reviews")}
                                >
                                    Quản lý đánh giá
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {role === "Warehouse" && (
                    <div className="col-lg-8">
                        <div
                            className="card border-0 shadow-lg"
                            style={{
                                borderRadius: "20px"
                            }}
                        >
                            <div className="card-body p-4">
                                <h5 className="fw-bold mb-3">
                                    Warehouse Quick Actions
                                </h5>

                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <button
                                            className="btn btn-warning w-100 py-3"
                                            onClick={() => navigate("/admin/inventory")}
                                        >
                                            📦 Quản lý tồn kho
                                        </button>
                                    </div>

                                    <div className="col-md-6">
                                        <button
                                            className="btn btn-outline-warning w-100 py-3"
                                            onClick={() => navigate("/admin/products")}
                                        >
                                            🛍️ Xem sản phẩm
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function DashboardCard({ title, value, icon, bg, color, onClick }) {
    return (
        <div className="col-lg-3 col-md-6">
            <div
                className="card border-0 shadow-lg h-100"
                style={{
                    borderRadius: "20px",
                    cursor: "pointer"
                }}
                onClick={onClick}
            >
                <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <div className="text-muted mb-2">
                                {title}
                            </div>

                            <h3
                                className="fw-bold"
                                style={{
                                    color
                                }}
                            >
                                {value}
                            </h3>
                        </div>

                        <div
                            className="rounded-circle d-flex align-items-center justify-content-center"
                            style={{
                                width: "70px",
                                height: "70px",
                                background: bg,
                                fontSize: "30px"
                            }}
                        >
                            {icon}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;