import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import LoginPage from "../pages/LoginPage";

function Header() {
    const navigate = useNavigate();

    const [isLoginOpen, setIsLoginOpen] = useState(false);

    // ================= USER =================
    const [currentUser, setCurrentUser] = useState(null);

    // ================= SEARCH =================
    const [searchText, setSearchText] = useState("");
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const searchRef = useRef(null);

    // ================= CART =================
    const [cartCount, setCartCount] = useState(0);

    // ================= CUSTOMER NOTIFICATIONS =================
    const [notifications, setNotifications] = useState([]);
    const [notificationCount, setNotificationCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);

    // ================= LOAD USER =================
    useEffect(() => {
        const savedUser = localStorage.getItem("currentUser");

        if (savedUser) {
            setCurrentUser(JSON.parse(savedUser));
        }
    }, []);

    // ================= LOAD CART =================
    useEffect(() => {
        const updateCartCount = () => {
            const cart =
                JSON.parse(localStorage.getItem("cart")) || [];

            const totalQuantity = cart.reduce(
                (sum, item) => sum + item.quantity,
                0
            );

            setCartCount(totalQuantity);
        };

        updateCartCount();

        window.addEventListener(
            "cartUpdated",
            updateCartCount
        );

        return () => {
            window.removeEventListener(
                "cartUpdated",
                updateCartCount
            );
        };
    }, []);

    // ================= LOAD PRODUCTS =================
    useEffect(() => {
        fetch("https://localhost:7019/api/Products")
            .then((res) => res.json())
            .then((data) => {
                setProducts(data);
            })
            .catch((err) => console.log(err));
    }, []);

    // ================= LOAD CUSTOMER NOTIFICATIONS =================
    useEffect(() => {
        if (!currentUser) return;

        loadCustomerNotifications();
    }, [currentUser]);

    const getCustomerQuery = () => {
    const email =
        currentUser?.email
            ?.trim()
            .toLowerCase() || "";

    const phone =
        currentUser?.phone
            ?.trim() || "";

    const params = new URLSearchParams();

    if (email) {
        params.append("email", email);
    }

    if (phone) {
        params.append("phone", phone);
    }

    return params.toString();
};

    const loadCustomerNotifications = async () => {
    try {
        const query = getCustomerQuery();

        console.log("CURRENT USER:", currentUser);
        console.log("NOTIFICATION QUERY:", query);

        if (!query) {
            console.log("Không có email hoặc số điện thoại để lấy thông báo");
            return;
        }

        const res = await fetch(
            `https://localhost:7019/api/customer-notifications?${query}`
        );

        console.log("NOTIFICATION STATUS:", res.status);

        if (!res.ok) {
            const text = await res.text();
            console.log("NOTIFICATION ERROR:", text);
            return;
        }

        const data = await res.json();

        console.log("CUSTOMER NOTIFICATIONS:", data);

        setNotifications(data.notifications || []);
        setNotificationCount(data.count || 0);
    } catch (err) {
        console.log(err);
    }
};

    const markNotificationAsRead = async (notification) => {
        try {
            await fetch(
                `https://localhost:7019/api/customer-notifications/${notification.id}/read`,
                {
                    method: "PUT"
                }
            );

            setNotifications((prev) =>
                prev.map((item) =>
                    item.id === notification.id
                        ? { ...item, isRead: true }
                        : item
                )
            );

            setNotificationCount((prev) =>
                prev > 0 ? prev - 1 : 0
            );
        } catch (err) {
            console.log(err);
        }
    };

    const markAllNotificationsAsRead = async () => {
        try {
            const query = getCustomerQuery();

            if (!query) return;

            await fetch(
                `https://localhost:7019/api/customer-notifications/read-all?${query}`,
                {
                    method: "PUT"
                }
            );

            setNotifications((prev) =>
                prev.map((item) => ({
                    ...item,
                    isRead: true
                }))
            );

            setNotificationCount(0);
        } catch (err) {
            console.log(err);
        }
    };

    const handleNotificationClick = async (notification) => {
        await markNotificationAsRead(notification);

        setShowNotifications(false);

        if (notification.link) {
            navigate(notification.link);
        } else {
            navigate("/my-orders");
        }
    };

    const handleViewAllNotifications = async () => {
        await markAllNotificationsAsRead();

        setShowNotifications(false);

        navigate("/my-orders");
    };

    // ================= CLOSE SEARCH WHEN CLICK OUTSIDE =================
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target)
            ) {
                setFilteredProducts([]);
            }
        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    // ================= LOGIN SUCCESS =================
    const handleLoginSuccess = (user) => {
        localStorage.setItem(
            "currentUser",
            JSON.stringify(user)
        );

        setCurrentUser(user);
        setIsLoginOpen(false);
    };

    // ================= LOGOUT =================
    const handleLogout = () => {
        localStorage.removeItem("currentUser");
        localStorage.removeItem("isLoggedIn");

        setCurrentUser(null);
        setNotifications([]);
        setNotificationCount(0);
        setShowNotifications(false);
    };

    // ================= SEARCH =================
    const handleSearch = (value) => {
        setSearchText(value);

        if (value.trim() === "") {
            setFilteredProducts([]);
            return;
        }

        const result = products.filter((product) =>
            product.name
                ?.toLowerCase()
                .includes(value.toLowerCase())
            ||
            product.category?.name
                ?.toLowerCase()
                .includes(value.toLowerCase())
        );

        setFilteredProducts(result.slice(0, 8));
    };

   const getUserName = () => {
    return (
        currentUser?.fullName ||
        currentUser?.username ||
        currentUser?.name ||
        currentUser?.email ||
        "Khách hàng"
    );
};

    const getUserInitial = () => {
        return getUserName()
            .trim()
            .charAt(0)
            .toUpperCase();
    };

    const getNotificationIcon = (type) => {
        if (type === "order") return "📦";
        if (type === "message") return "💬";
        if (type === "promotion") return "🎁";
        return "🔔";
    };

    return (
        <>
            {/* HEADER TOP */}
            <div
                className="text-white py-3"
                style={{
                    background:
                        "linear-gradient(90deg, #7db7ff, #d78fff, #ffb7b7)"
                }}
            >
                <div className="container-fluid px-5">
                    <div className="d-flex justify-content-between align-items-center">

                        {/* LOGO */}
                        <Link
                            to="/"
                            className="text-white text-decoration-none"
                        >
                            <h2
                                className="fw-bold mb-0"
                                style={{
                                    fontSize: "38px"
                                }}
                            >
                                Cindybeauty Shop
                            </h2>
                        </Link>

                        {/* SEARCH */}
                        <div
                            ref={searchRef}
                            style={{
                                position: "relative",
                                width: "45%"
                            }}
                        >
                            <input
                                type="text"
                                className="form-control rounded-pill px-3 py-2"
                                placeholder="Tìm kiếm sản phẩm..."
                                value={searchText}
                                onChange={(e) =>
                                    handleSearch(e.target.value)
                                }
                            />

                            {filteredProducts.length > 0 && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "110%",
                                        left: 0,
                                        width: "100%",
                                        background: "#fff",
                                        borderRadius: "14px",
                                        boxShadow:
                                            "0 8px 30px rgba(0,0,0,0.15)",
                                        zIndex: 9999,
                                        overflow: "hidden",
                                        maxHeight: "550px",
                                        overflowY: "auto"
                                    }}
                                >
                                    <div
                                        style={{
                                            padding: "12px 18px",
                                            background: "#f5f5f5",
                                            fontWeight: "700",
                                            color: "#666",
                                            fontSize: "14px"
                                        }}
                                    >
                                        Sản phẩm gợi ý
                                    </div>

                                    {filteredProducts.map((product) => (
                                        <Link
                                            key={product.id}
                                            to={`/product/${product.id}`}
                                            className="text-decoration-none"
                                            onClick={() => {
                                                setSearchText("");
                                                setFilteredProducts([]);
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    gap: "14px",
                                                    padding: "14px 18px",
                                                    borderBottom:
                                                        "1px solid #f3f3f3",
                                                    alignItems: "center",
                                                    transition: "0.2s",
                                                    cursor: "pointer",
                                                    background: "#fff"
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background =
                                                        "#fafafa";
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background =
                                                        "#fff";
                                                }}
                                            >
                                                <img
                                                    src={`https://localhost:7019/images/${product.imageUrl}`}
                                                    alt={product.name}
                                                    style={{
                                                        width: "70px",
                                                        height: "70px",
                                                        objectFit: "cover",
                                                        borderRadius: "10px",
                                                        border:
                                                            "1px solid #eee"
                                                    }}
                                                />

                                                <div style={{ flex: 1 }}>
                                                    <div
                                                        style={{
                                                            color: "#333",
                                                            fontSize: "15px",
                                                            fontWeight: "500",
                                                            marginBottom: "6px",
                                                            lineHeight: "1.4"
                                                        }}
                                                    >
                                                        {product.name}
                                                    </div>

                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: "10px"
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                color: "#ff2d55",
                                                                fontWeight: "700",
                                                                fontSize: "18px"
                                                            }}
                                                        >
                                                            {product.price?.toLocaleString()}đ
                                                        </span>

                                                        {product.oldPrice && (
                                                            <span
                                                                style={{
                                                                    color: "#999",
                                                                    textDecoration:
                                                                        "line-through",
                                                                    fontSize: "14px"
                                                                }}
                                                            >
                                                                {product.oldPrice?.toLocaleString()}đ
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* MENU */}
                        <div className="d-flex align-items-center gap-4 fw-bold">

                            <Link
                                to="/"
                                className="text-white text-decoration-none"
                            >
                                Trang chủ
                            </Link>

                            <Link
                                to="/products"
                                className="text-white text-decoration-none"
                            >
                                Sản phẩm
                            </Link>

                            {currentUser && (
                                <Link
                                    to="/my-orders"
                                    className="text-white text-decoration-none"
                                >
                                    Đơn hàng
                                </Link>
                            )}

                            {!currentUser && (
                                <button
                                    onClick={() => setIsLoginOpen(true)}
                                    className="text-white text-decoration-none fw-bold"
                                    style={{
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        padding: 0,
                                        fontSize: "inherit"
                                    }}
                                >
                                    Đăng nhập
                                </button>
                            )}

                            {/* CUSTOMER NOTIFICATION */}
                            {currentUser && (
                                <div style={{ position: "relative" }}>
                                    <button
                                        className="btn border-0"
                                        onClick={() =>
                                            setShowNotifications(
                                                !showNotifications
                                            )
                                        }
                                        style={{
                                            background: "transparent",
                                            color: "#fff",
                                            fontSize: "25px",
                                            position: "relative"
                                        }}
                                    >
                                        🔔

                                        {notificationCount > 0 && (
                                            <span
                                                style={{
                                                    position: "absolute",
                                                    top: "-6px",
                                                    right: "-8px",
                                                    background: "#ff2d55",
                                                    color: "#fff",
                                                    borderRadius: "50%",
                                                    minWidth: "22px",
                                                    height: "22px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontSize: "12px",
                                                    fontWeight: "bold",
                                                    border: "2px solid white"
                                                }}
                                            >
                                                {notificationCount}
                                            </span>
                                        )}
                                    </button>

                                    {showNotifications && (
                                        <div
                                            className="shadow"
                                            style={{
                                                position: "absolute",
                                                top: "120%",
                                                right: 0,
                                                width: "360px",
                                                background: "#fff",
                                                borderRadius: "16px",
                                                zIndex: 9999,
                                                overflow: "hidden",
                                                color: "#333"
                                            }}
                                        >
                                            <div
                                                className="d-flex justify-content-between align-items-center"
                                                style={{
                                                    padding: "14px 18px",
                                                    background: "#fff0f3",
                                                    color: "#ff2d55",
                                                    fontWeight: "700",
                                                    borderBottom:
                                                        "1px solid #f1f1f1"
                                                }}
                                            >
                                                <span>
                                                    🔔 Thông báo
                                                </span>

                                                {notificationCount > 0 && (
                                                    <button
                                                        className="btn btn-sm btn-light"
                                                        onClick={
                                                            markAllNotificationsAsRead
                                                        }
                                                    >
                                                        Đã đọc tất cả
                                                    </button>
                                                )}
                                            </div>

                                            <div
                                                style={{
                                                    maxHeight: "430px",
                                                    overflowY: "auto"
                                                }}
                                            >
                                                {notifications.length === 0 ? (
                                                    <div className="p-4 text-center text-muted">
                                                        Chưa có thông báo
                                                    </div>
                                                ) : (
                                                    notifications.map((item) => (
                                                        <div
                                                            key={item.id}
                                                            onClick={() =>
                                                                handleNotificationClick(
                                                                    item
                                                                )
                                                            }
                                                            style={{
                                                                padding: "14px 18px",
                                                                borderBottom:
                                                                    "1px solid #f1f1f1",
                                                                cursor: "pointer",
                                                                background:
                                                                    item.isRead
                                                                        ? "#fff"
                                                                        : "#fff7fa"
                                                            }}
                                                        >
                                                            <div
                                                                className="d-flex gap-2"
                                                            >
                                                                <span>
                                                                    {getNotificationIcon(
                                                                        item.type
                                                                    )}
                                                                </span>

                                                                <div>
                                                                    <div
                                                                        className="fw-bold"
                                                                        style={{
                                                                            fontSize:
                                                                                "14px"
                                                                        }}
                                                                    >
                                                                        {item.title}
                                                                    </div>

                                                                    <div
                                                                        className="small text-muted"
                                                                        style={{
                                                                            lineHeight:
                                                                                "1.45"
                                                                        }}
                                                                    >
                                                                        {item.content}
                                                                    </div>

                                                                    <div className="small text-secondary mt-1">
                                                                        {item.createdAt
                                                                            ? new Date(
                                                                                item.createdAt
                                                                            ).toLocaleString(
                                                                                "vi-VN"
                                                                            )
                                                                            : ""}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>

                                            <button
                                                className="btn btn-light w-100 rounded-0"
                                                onClick={
                                                    handleViewAllNotifications
                                                }
                                            >
                                                Xem đơn hàng của tôi
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* LOGIN USER DROPDOWN */}
                            {currentUser && (
                                <div className="dropdown">
                                    <button
                                        className="btn border-0 d-flex align-items-center gap-2"
                                        data-bs-toggle="dropdown"
                                        style={{
                                            background: "transparent"
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: "42px",
                                                height: "42px",
                                                borderRadius: "50%",
                                                background:
                                                    "linear-gradient(135deg, #ff6ea8, #ff9ec9)",
                                                color: "#fff",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontWeight: "bold",
                                                fontSize: "18px",
                                                overflow: "hidden",
                                                border:
                                                    "2px solid rgba(255,255,255,0.7)"
                                            }}
                                        >
                                            {currentUser.avatar ? (
                                                <img
                                                    src={currentUser.avatar}
                                                    alt=""
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "cover"
                                                    }}
                                                />
                                            ) : (
                                                <span style={{ color: "#fff" }}>
                                                    {getUserInitial()}
                                                </span>
                                            )}
                                        </div>

                                        <span
                                            className="fw-bold"
                                            style={{
                                                color: "#fff"
                                            }}
                                        >
                                            {getUserName()}
                                        </span>
                                    </button>

                                    <ul
                                        className="dropdown-menu dropdown-menu-end border-0 shadow rounded-4 p-2"
                                        style={{
                                            minWidth: "220px"
                                        }}
                                    >
                                        <li className="px-3 py-2 border-bottom">
                                            <div className="fw-bold">
                                                {getUserName()}
                                            </div>

                                            <small className="text-muted">
                                                Xin chào 👋
                                            </small>
                                        </li>

                                        <li>
                                            <Link
                                                to="/my-orders"
                                                className="dropdown-item rounded-3 py-2"
                                            >
                                                📦 Đơn hàng của tôi
                                            </Link>
                                        </li>

                                        <li>
                                            <Link
                                                to="/my-messages"
                                                className="dropdown-item rounded-3 py-2"
                                            >
                                                💬 Tin nhắn của tôi
                                            </Link>
                                        </li>

                                        <li>
                                            <hr className="dropdown-divider" />
                                        </li>

                                        <li>
                                            <button
                                                className="dropdown-item rounded-3 py-2 text-danger"
                                                onClick={handleLogout}
                                            >
                                                🚪 Đăng xuất
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )}

                            {/* CART */}
                            <div
                                style={{
                                    position: "relative"
                                }}
                            >
                                <Link
                                    to="/cart"
                                    className="text-white text-decoration-none"
                                    style={{
                                        fontSize: "28px"
                                    }}
                                >
                                    🛒
                                </Link>

                                {cartCount > 0 && (
                                    <span
                                        style={{
                                            position: "absolute",
                                            top: "-8px",
                                            right: "-10px",
                                            background: "#ff2d55",
                                            color: "#fff",
                                            borderRadius: "50%",
                                            minWidth: "22px",
                                            height: "22px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "12px",
                                            fontWeight: "bold",
                                            padding: "0 6px",
                                            border: "2px solid white"
                                        }}
                                    >
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MENU BOTTOM */}
            <div className="bg-white shadow-sm">
                <div className="container-fluid px-5">
                    <div
                        className="d-flex justify-content-center align-items-center gap-5 py-3 fw-semibold"
                        style={{
                            overflowX: "auto",
                            whiteSpace: "nowrap"
                        }}
                    >
                        <Link
                            to="/products"
                            className="text-dark text-decoration-none"
                        >
                            Danh mục sản phẩm
                        </Link>

                        <Link
                            to="/promotion"
                            className="text-dark text-decoration-none"
                        >
                            Khuyến mại
                        </Link>

                        <Link
                            to="/flash-sale"
                            className="text-dark text-decoration-none"
                        >
                            Flash Sale ⚡
                        </Link>

                        <Link
                            to="/brands"
                            className="text-dark text-decoration-none"
                        >
                            Thương hiệu
                        </Link>

                        <Link
                            to="/beauty-blog"
                            className="text-dark text-decoration-none"
                        >
                            Blog làm đẹp
                        </Link>

                        <Link
                            to="/stores"
                            className="text-dark text-decoration-none"
                        >
                            Hệ thống cửa hàng
                        </Link>
                    </div>
                </div>
            </div>

            {/* LOGIN MODAL */}
            {isLoginOpen && (
                <LoginPage
                    onClose={() => setIsLoginOpen(false)}
                    onLoginSuccess={handleLoginSuccess}
                />
            )}
        </>
    );
}

export default Header;