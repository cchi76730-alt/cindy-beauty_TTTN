import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import LoginPage from "../pages/LoginPage";


function Header() {

    const [isLoginOpen, setIsLoginOpen] = useState(false);

    // ================= USER =================
    const [currentUser, setCurrentUser] = useState(null);

    // ================= SEARCH =================
    const [searchText, setSearchText] = useState("");

    const [products, setProducts] = useState([]);

    const [filteredProducts, setFilteredProducts] = useState([]);

    const searchRef = useRef(null);

    // ================= LOAD USER =================
    useEffect(() => {

        const savedUser =
            localStorage.getItem("currentUser");

        if (savedUser) {

            setCurrentUser(JSON.parse(savedUser));
        }

    }, []);

    // ================= LOAD PRODUCTS =================
    useEffect(() => {

        fetch("http://localhost:5114/api/Products")
            .then((res) => res.json())
            .then((data) => {

                setProducts(data);

            })
            .catch((err) => console.log(err));

    }, []);

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

                            {/* INPUT SEARCH */}
                            <input
                                type="text"
                                className="form-control rounded-pill px-3 py-2"
                                placeholder="Tìm kiếm sản phẩm..."
                                value={searchText}
                                onChange={(e) =>
                                    handleSearch(e.target.value)
                                }
                            />

                            {/* SEARCH DROPDOWN */}
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

                                    {/* title */}
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

                                    {/* items */}
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

                                                {/* image */}
                                                <img
                                                    src={`http://localhost:5114/images/${product.imageUrl}`}
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

                                                {/* info */}
                                                <div
                                                    style={{
                                                        flex: 1
                                                    }}
                                                >

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

                            {/* NEW: MY ORDERS */}
                            <Link
                                to="/my-orders"
                                className="text-white text-decoration-none"
                            >
                                Đơn hàng
                            </Link>

                            {/* NOT LOGIN */}
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

                            {/* LOGIN */}
{currentUser && (

    <div className="dropdown">

        <button
            className="btn border-0 d-flex align-items-center gap-2"
            data-bs-toggle="dropdown"
            style={{
                background: "transparent"
            }}
        >

            {/* AVATAR */}
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
        border: "2px solid rgba(255,255,255,0.7)"
    }}
>

                {/* nếu có avatar */}
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

                    <span style={{ color: "#ff4d8d" }}>
    {currentUser.username
    ?.charAt(0)
    ?.toUpperCase()}
</span>

                )}

            </div>

            {/* USERNAME */}
            <span
    className="fw-bold"
    style={{
        color: "#fff"
    }}
>
    {currentUser.username}
</span>

        </button>

        {/* DROPDOWN */}
        <ul
            className="dropdown-menu dropdown-menu-end border-0 shadow rounded-4 p-2"
            style={{
                minWidth: "220px"
            }}
        >

            <li className="px-3 py-2 border-bottom">

                <div className="fw-bold">
                    {currentUser.username}
                </div>

                <small className="text-muted">
                    Xin chào 👋
                </small>

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
                            <Link
                                to="/cart"
                                className="text-white text-decoration-none"
                                style={{
                                    fontSize: "28px"
                                }}
                            >
                                🛒
                            </Link>

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