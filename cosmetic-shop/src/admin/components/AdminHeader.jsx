import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminHeader() {
    const navigate = useNavigate();

    const [showMenu, setShowMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showMessages, setShowMessages] = useState(false);

    const [notifications, setNotifications] = useState([]);
    const [messages, setMessages] = useState([]);

    const [notificationCount, setNotificationCount] = useState(0);
    const [messageCount, setMessageCount] = useState(0);

    const [searchText, setSearchText] = useState("");

    const admin = JSON.parse(localStorage.getItem("admin"));

    const [avatar, setAvatar] = useState(
        admin?.avatarUrl ||
        localStorage.getItem("adminAvatar") ||
        ""
    );

    useEffect(() => {
        loadNotifications();
        loadMessages();
    }, []);

    const getToken = () => {
        return localStorage.getItem("token");
    };

    const authHeaders = () => {
        const token = getToken();

        return token
            ? {
                Authorization: `Bearer ${token}`
            }
            : {};
    };

    const loadNotifications = async () => {
        try {
            const res = await fetch(
                "https://localhost:7019/api/admin/notifications",
                {
                    headers: authHeaders()
                }
            );

            if (!res.ok) return;

            const data = await res.json();

            setNotifications(data.notifications || []);
            setNotificationCount(data.count || 0);
        } catch (error) {
            console.log(error);
        }
    };

    const markNotificationsAsRead = async () => {
        try {
            await fetch(
                "https://localhost:7019/api/admin/notifications/read-all",
                {
                    method: "PUT",
                    headers: authHeaders()
                }
            );

            setNotificationCount(0);
        } catch (error) {
            console.log(error);
        }
    };

    const markOneNotificationAsRead = async (item) => {
        try {
            await fetch(
                `https://localhost:7019/api/admin/notifications/${item.type}/${item.id}/read`,
                {
                    method: "PUT",
                    headers: authHeaders()
                }
            );

            setNotificationCount((prev) =>
                prev > 0 ? prev - 1 : 0
            );
        } catch (error) {
            console.log(error);
        }
    };

    const loadMessages = async () => {
        try {
            const res = await fetch(
                "https://localhost:7019/api/conversations/admin",
                {
                    headers: authHeaders()
                }
            );

            if (!res.ok) return;

            const data = await res.json();

            const conversationList = Array.isArray(data)
                ? data
                : data.conversations || [];

            setMessages(conversationList);
            setMessageCount(data.count || 0);
        } catch (error) {
            console.log(error);
        }
    };

    const markMessagesAsRead = async () => {
        try {
            await fetch(
                "https://localhost:7019/api/conversations/admin/read-all",
                {
                    method: "PUT",
                    headers: authHeaders()
                }
            );

            setMessageCount(0);
        } catch (error) {
            console.log(error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("admin");
        navigate("/admin/auth", { replace: true });
    };

    const handleSearch = (e) => {
        e.preventDefault();

        const value = searchText.trim();

        if (!value) return;

        const lower = value.toLowerCase();
        const query = encodeURIComponent(value);

        if (
            lower.includes("product") ||
            lower.includes("sản phẩm") ||
            lower.includes("san pham")
        ) {
            navigate(`/admin/products?search=${query}`);
            return;
        }

        if (
            lower.includes("order") ||
            lower.includes("đơn") ||
            lower.includes("don")
        ) {
            navigate(`/admin/orders?search=${query}`);
            return;
        }

        if (
            lower.includes("customer") ||
            lower.includes("khách") ||
            lower.includes("khach")
        ) {
            navigate(`/admin/customers?search=${query}`);
            return;
        }

        if (
            lower.includes("employee") ||
            lower.includes("nhân viên") ||
            lower.includes("nhan vien") ||
            lower.includes("staff")
        ) {
            navigate(`/admin/employees?search=${query}`);
            return;
        }

        if (
            lower.includes("brand") ||
            lower.includes("thương hiệu") ||
            lower.includes("thuong hieu")
        ) {
            navigate(`/admin/brands?search=${query}`);
            return;
        }

        if (
            lower.includes("review") ||
            lower.includes("đánh giá") ||
            lower.includes("danh gia")
        ) {
            navigate(`/admin/reviews?search=${query}`);
            return;
        }

        if (
            lower.includes("inventory") ||
            lower.includes("kho") ||
            lower.includes("tồn kho") ||
            lower.includes("ton kho")
        ) {
            navigate(`/admin/inventory?search=${query}`);
            return;
        }

        if (
            lower.includes("message") ||
            lower.includes("tin nhắn") ||
            lower.includes("tin nhan")
        ) {
            navigate(`/admin/messages?search=${query}`);
            return;
        }

        if (
            lower.includes("attendance") ||
            lower.includes("chấm công") ||
            lower.includes("cham cong")
        ) {
            navigate(`/admin/attendance?search=${query}`);
            return;
        }

        navigate(`/admin/products?search=${query}`);
    };

    const handleNotificationClick = async (item) => {
        await markOneNotificationAsRead(item);

        setShowNotifications(false);

        if (item.link) {
            navigate(item.link);
        } else {
            navigate("/admin");
        }
    };

    const handleViewAllNotifications = async () => {
        await markNotificationsAsRead();

        setShowNotifications(false);
        navigate("/admin");
    };

    const getLastMessage = (conversation) => {
        const list = conversation.messages || [];

        if (list.length === 0) return "";

        return list[list.length - 1].content;
    };

    const handleMessageClick = async () => {
        await markMessagesAsRead();

        setShowMessages(false);
        navigate("/admin/messages");
    };

    const roleLabel = () => {
        if (admin?.role === "Admin") return "👑 Quản trị viên";
        if (admin?.role === "Warehouse") return "📦 Nhân viên kho";
        return "🛒 Nhân viên bán hàng";
    };

    const roleColor = () => {
        if (admin?.role === "Admin") return "#dc3545";
        if (admin?.role === "Warehouse") return "#fd7e14";
        return "#0d6efd";
    };

    const getInitial = () => {
        const name = admin?.fullName || admin?.email || "A";
        return name.trim().charAt(0).toUpperCase();
    };

    const avatarFallback = () => {
        return (
            <div
                className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white"
                style={{
                    width: "45px",
                    height: "45px",
                    background: "linear-gradient(135deg,#ff758c,#ff7eb3)"
                }}
            >
                {getInitial()}
            </div>
        );
    };

    const largeAvatarFallback = () => {
        return (
            <div
                className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white border border-4 border-white mb-3 mx-auto"
                style={{
                    width: "80px",
                    height: "80px",
                    background: "linear-gradient(135deg,#ff758c,#ff7eb3)",
                    fontSize: "32px"
                }}
            >
                {getInitial()}
            </div>
        );
    };

    const handleChangeAvatar = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = () => {
            const imageBase64 = reader.result;

            localStorage.setItem("adminAvatar", imageBase64);
            setAvatar(imageBase64);
        };

        reader.readAsDataURL(file);
    };

    return (
        <div
            className="bg-white border-bottom shadow-sm px-4 py-3"
            style={{
                position: "sticky",
                top: 0,
                zIndex: 999
            }}
        >
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div>
                    <h3
                        className="fw-bold mb-1"
                        style={{ color: "#ff4d6d" }}
                    >
                        Quản trị CindyBeauty
                    </h3>

                    <div className="text-muted small">
                        Hệ thống quản lý cửa hàng mỹ phẩm
                    </div>
                </div>

                <form
                    onSubmit={handleSearch}
                    className="flex-grow-1 px-lg-5"
                    style={{ maxWidth: "650px" }}
                >
                    <div className="position-relative">
                        <input
                            type="text"
                            className="form-control rounded-pill border-0 shadow-sm py-2 px-5"
                            placeholder="Tìm kiếm sản phẩm, đơn hàng, khách hàng..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{ background: "#f5f6fa" }}
                        />

                        <span
                            className="position-absolute"
                            style={{
                                left: "20px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "#999"
                            }}
                        >
                            🔍
                        </span>
                    </div>
                </form>

                <div className="d-flex align-items-center gap-3 position-relative">
                    <div className="position-relative">
                        <button
                            className="btn position-relative rounded-circle"
                            style={{
                                width: "48px",
                                height: "48px",
                                background: "#fff0f3"
                            }}
                            onClick={async () => {
                                setShowNotifications(!showNotifications);
                                setShowMessages(false);
                            }}
                        >
                            🔔

                            {notificationCount > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    {notificationCount}
                                </span>
                            )}
                        </button>

                        {showNotifications && (
                            <div
                                className="position-absolute end-0 mt-3 bg-white shadow-lg rounded-4 border overflow-hidden"
                                style={{ width: "360px", zIndex: 9999 }}
                            >
                                <div
                                    className="px-3 py-3 border-bottom fw-bold"
                                    style={{
                                        background: "#fff0f3",
                                        color: "#ff4d6d"
                                    }}
                                >
                                    🔔 Thông báo
                                </div>

                                <div
                                    style={{
                                        maxHeight: "420px",
                                        overflowY: "auto"
                                    }}
                                >
                                    {notifications.length === 0 ? (
                                        <div className="p-4 text-center text-muted">
                                            Không có thông báo
                                        </div>
                                    ) : (
                                        notifications.map((item) => (
                                            <div
                                                key={`${item.type}-${item.id}`}
                                                className="px-3 py-3 border-bottom"
                                                style={{ cursor: "pointer" }}
                                                onClick={() =>
                                                    handleNotificationClick(item)
                                                }
                                            >
                                                <div className="fw-bold mb-1">
                                                    {item.title}
                                                </div>

                                                <div className="small text-muted">
                                                    {item.content}
                                                </div>

                                                <div className="small text-secondary mt-1">
                                                    {item.createdAt
                                                        ? new Date(
                                                            item.createdAt
                                                        ).toLocaleString("vi-VN")
                                                        : ""}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <button
                                    className="btn btn-light w-100 rounded-0"
                                    onClick={handleViewAllNotifications}
                                >
                                    Xem tất cả thông báo
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="position-relative">
                        <button
                            className="btn position-relative rounded-circle"
                            style={{
                                width: "48px",
                                height: "48px",
                                background: "#fff0f3"
                            }}
                            onClick={async () => {
                                setShowMessages(!showMessages);
                                setShowNotifications(false);
                            }}
                        >
                            💬

                            {messageCount > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success">
                                    {messageCount}
                                </span>
                            )}
                        </button>

                        {showMessages && (
                            <div
                                className="position-absolute end-0 mt-3 bg-white shadow-lg rounded-4 border overflow-hidden"
                                style={{ width: "360px", zIndex: 9999 }}
                            >
                                <div
                                    className="px-3 py-3 border-bottom fw-bold"
                                    style={{
                                        background: "#ecfdf3",
                                        color: "#198754"
                                    }}
                                >
                                    💬 Tin nhắn
                                </div>

                                <div
                                    style={{
                                        maxHeight: "420px",
                                        overflowY: "auto"
                                    }}
                                >
                                    {messages.length === 0 ? (
                                        <div className="p-4 text-center text-muted">
                                            Không có tin nhắn
                                        </div>
                                    ) : (
                                        messages.map((message) => (
                                            <div
                                                key={message.id}
                                                className="px-3 py-3 border-bottom"
                                                style={{
                                                    cursor: "pointer",
                                                    background: "#fff"
                                                }}
                                                onClick={handleMessageClick}
                                            >
                                                <div className="fw-bold mb-1">
                                                    {message.customerName}
                                                </div>

                                                {message.productName && (
                                                    <div className="small text-danger mb-1">
                                                        {message.productName}
                                                    </div>
                                                )}

                                                <div className="small text-muted">
                                                    {getLastMessage(message)}
                                                </div>

                                                <div className="small text-secondary mt-1">
                                                    {message.updatedAt
                                                        ? new Date(
                                                            message.updatedAt
                                                        ).toLocaleString("vi-VN")
                                                        : ""}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <button
                                    className="btn btn-light w-100 rounded-0"
                                    onClick={handleMessageClick}
                                >
                                    Xem tất cả tin nhắn
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="position-relative">
                        <button
                            className="btn bg-white border shadow-sm rounded-pill px-3 py-2 d-flex align-items-center gap-3"
                            onClick={() => setShowMenu(!showMenu)}
                        >
                            {avatar ? (
                                <img
                                    src={avatar}
                                    alt="Ảnh đại diện"
                                    className="rounded-circle"
                                    width="45"
                                    height="45"
                                    style={{
                                        objectFit: "cover"
                                    }}
                                />
                            ) : (
                                avatarFallback()
                            )}

                            <div className="text-start d-none d-md-block">
                                <div className="fw-bold">
                                    {admin?.fullName || "Người quản trị"}
                                </div>

                                <div
                                    className="small fw-bold"
                                    style={{ color: roleColor() }}
                                >
                                    {roleLabel()}
                                </div>
                            </div>

                            <span>▼</span>
                        </button>

                        {showMenu && (
                            <div
                                className="position-absolute end-0 mt-3 bg-white shadow-lg rounded-4 overflow-hidden border"
                                style={{ width: "280px", zIndex: 999 }}
                            >
                                <div
                                    className="p-4 text-center"
                                    style={{
                                        background:
                                            "linear-gradient(135deg,#ff758c,#ff7eb3)"
                                    }}
                                >
                                    {avatar ? (
                                        <img
                                            src={avatar}
                                            alt="Ảnh đại diện"
                                            className="rounded-circle border border-4 border-white mb-3"
                                            width="80"
                                            height="80"
                                            style={{
                                                objectFit: "cover"
                                            }}
                                        />
                                    ) : (
                                        largeAvatarFallback()
                                    )}

                                    <h5 className="fw-bold text-white mb-1">
                                        {admin?.fullName || "Người quản trị"}
                                    </h5>

                                    <div className="text-white-50 small">
                                        {admin?.email || "Chưa có email"}
                                    </div>
                                </div>

                                <div className="p-2">
                                    <label className="dropdown-item rounded-3 py-3">
                                        🖼️ Đổi ảnh đại diện
                                        <input
                                            type="file"
                                            accept="image/*"
                                            hidden
                                            onChange={handleChangeAvatar}
                                        />
                                    </label>

                                    <button
                                        className="dropdown-item rounded-3 py-3"
                                        onClick={() => {
                                            setShowMenu(false);
                                            navigate("/admin");
                                        }}
                                    >
                                        📊 Tổng quan
                                    </button>

                                    <button
                                        className="dropdown-item rounded-3 py-3"
                                        onClick={async () => {
                                            setShowNotifications(true);
                                            setShowMessages(false);
                                            setShowMenu(false);
                                        }}
                                    >
                                        🔔 Thông báo
                                    </button>

                                    <button
                                        className="dropdown-item rounded-3 py-3"
                                        onClick={async () => {
                                            setShowMenu(false);
                                            await markMessagesAsRead();
                                            navigate("/admin/messages");
                                        }}
                                    >
                                        💬 Tin nhắn khách hàng
                                    </button>

                                    <hr className="my-2" />

                                    <button
                                        className="dropdown-item text-danger rounded-3 py-3"
                                        onClick={handleLogout}
                                    >
                                        🚪 Đăng xuất
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminHeader;