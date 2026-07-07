import { Link, useLocation } from "react-router-dom";

import {
    FaChartBar,
    FaBox,
    FaShoppingCart,
    FaUsers,
    FaTags,
    FaStar,
    FaUserTie,
    FaWarehouse,
    FaClock,
    FaComments
} from "react-icons/fa";

function Sidebar() {
    const location = useLocation();

    const admin = JSON.parse(
        localStorage.getItem("admin")
    );

    const role = admin?.role || "Staff";

    const isAdmin = role === "Admin";
    const isStaff = role === "Staff";
    const isWarehouse = role === "Warehouse";

    const menuItems = [
    {
        title: "Tổng quan",
        path: "/admin",
        icon: <FaChartBar />,
        roles: ["Admin"]
    },
    {
        title: "Sản phẩm",
        path: "/admin/products",
        icon: <FaBox />,
        roles: ["Admin"]
    },
    {
        title: "Đơn hàng",
        path: "/admin/orders",
        icon: <FaShoppingCart />,
        roles: ["Admin", "Staff"]
    },
    {
        title: "Khách hàng",
        path: "/admin/customers",
        icon: <FaUsers />,
        roles: ["Admin"]
    },
    {
        title: "Tin nhắn",
        path: "/admin/messages",
        icon: <FaComments />,
        roles: ["Admin", "Staff"]
    },
    {
        title: "Thương hiệu",
        path: "/admin/brands",
        icon: <FaTags />,
        roles: ["Admin"]
    },
    {
        title: "Đánh giá",
        path: "/admin/reviews",
        icon: <FaStar />,
        roles: ["Admin", "Staff"]
    },
    {
        title: "Kho hàng",
        path: "/admin/inventory",
        icon: <FaWarehouse />,
        roles: ["Admin", "Warehouse"]
    },
    {
        title: "Nhân viên",
        path: "/admin/employees",
        icon: <FaUserTie />,
        roles: ["Admin"]
    },
    {
        title: "Chấm công",
        path: "/admin/attendance",
        icon: <FaClock />,
        roles: ["Admin", "Staff", "Warehouse"]
    }
];

    const visibleMenus = menuItems.filter(item =>
        item.roles.includes(role)
    );

    const isActive = (path) => {
        if (path === "/admin") {
            return location.pathname === "/admin";
        }

        return location.pathname.startsWith(path);
    };

    const sidebarBg =
        isAdmin
            ? "linear-gradient(180deg,#1f2937,#111827)"
            : isWarehouse
                ? "linear-gradient(180deg,#ea580c,#c2410c)"
                : "linear-gradient(180deg,#2563eb,#1d4ed8)";

    const roleText =
        isAdmin
            ? "👑 QUẢN TRỊ VIÊN"
            : isWarehouse
                ? "📦 NHÂN VIÊN KHO"
                : "🛒 NHÂN VIÊN BÁN HÀNG";

    return (
        <aside
            className="text-white d-flex flex-column"
            style={{
                width: "270px",
                minWidth: "270px",
                height: "100vh",
                position: "sticky",
                top: 0,
                background: sidebarBg,
                overflowY: "auto"
            }}
        >
            <div className="p-4">
                <h3 className="fw-bold mb-1">
                    CindyBeauty
                </h3>

                <div
                    className="small mb-4"
                    style={{
                        color: "rgba(255,255,255,0.75)"
                    }}
                >
                    Hệ thống quản trị
                </div>

                <div
                    className="p-3 rounded-4 mb-4"
                    style={{
                        background: "rgba(255,255,255,0.12)"
                    }}
                >
                    <div className="fw-bold">
                        {admin?.fullName || "Administrator"}
                    </div>

                    <div
                        className="small mt-1"
                        style={{
                            color: "rgba(255,255,255,0.8)"
                        }}
                    >
                        {admin?.email || "No email"}
                    </div>

                    <div
                        className="small fw-bold mt-2"
                        style={{
                            color: "#fff"
                        }}
                    >
                        {roleText}
                    </div>
                </div>

                <ul className="list-unstyled m-0">
                    {visibleMenus.map(item => (
                        <li
                            key={item.path}
                            className="mb-2"
                        >
                            <Link
                                to={item.path}
                                className="text-white text-decoration-none d-flex align-items-center gap-3 px-3 py-3 rounded-4"
                                style={{
                                    background: isActive(item.path)
                                        ? "rgba(255,255,255,0.22)"
                                        : "transparent",
                                    fontWeight: isActive(item.path)
                                        ? "700"
                                        : "500",
                                    transition: "0.2s"
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: "18px"
                                    }}
                                >
                                    {item.icon}
                                </span>

                                <span>
                                    {item.title}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div
                className="mt-auto p-4"
                style={{
                    color: "rgba(255,255,255,0.75)"
                }}
            >
                <div
                    className="small"
                    style={{
                        borderTop: "1px solid rgba(255,255,255,0.2)",
                        paddingTop: "16px"
                    }}
                >
                    Vai trò:
{
    role === "Admin"
        ? " Quản trị viên"
        : role === "Staff"
            ? " Nhân viên bán hàng"
            : " Nhân viên kho"
}
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;