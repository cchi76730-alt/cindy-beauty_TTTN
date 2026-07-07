import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getProducts } from "../services/productService";
import { getBrands } from "../services/brandService";
import {
    getPromotions,
    getPromotionById
} from "../services/promotionService";

const fallbackImage =
    "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect width='100%25' height='100%25' fill='%23eeeeee'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999999' font-size='32'%3ENo Image%3C/text%3E%3C/svg%3E";

const slides = [
    {
        id: 1,
        bg: "linear-gradient(135deg, #b3e8ff 0%, #e0f7ff 40%, #fce4f8 100%)",
        badge: "🚚 Giao siêu tốc",
        headline: ["FREESHIP 2H", "NỘI THÀNH"],
        sub: "GIAO NHANH TOÀN QUỐC",
        accent: "#ff6ec7"
    },
    {
        id: 2,
        bg: "linear-gradient(135deg, #bfefff 0%, #e0f7ff 40%, #fff0c8 100%)",
        badge: "☀️ Hè về cực chill",
        headline: ["RINH DEAL", "CỰC XỊN"],
        sub: "MUA 1 TẶNG 3 · SALE UP TO 50%",
        accent: "#f59e0b"
    },
    {
        id: 3,
        bg: "linear-gradient(135deg, #ffe4e6 0%, #fdf2f8 40%, #dbeafe 100%)",
        badge: "🔥 Hè cực cháy",
        headline: ["SALE CHẠM", "ĐÁY 7"],
        sub: "SALE UP TO 50% · MUA 1 TẶNG 3",
        accent: "#ef4444"
    }
];

const categories = [
    { id: 0, name: "Tất cả", icon: "🛍️" },
    { id: 1, name: "Son môi", icon: "💄" },
    { id: 2, name: "Skincare", icon: "✨" },
    { id: 3, name: "Nước hoa", icon: "🌸" },
    { id: 4, name: "Kem chống nắng", icon: "☀️" },
    { id: 5, name: "Makeup", icon: "🎨" }
];

const isValidImageValue = (value) => {
    if (value === null || value === undefined) {
        return false;
    }

    const text = String(value).trim();

    return (
        text !== "" &&
        text !== "null" &&
        text !== "undefined"
    );
};

const getImageUrl = (imageUrl, isBrandImage = false) => {
    if (!isValidImageValue(imageUrl)) {
        return fallbackImage;
    }

    const url = String(imageUrl).trim();

    if (url.startsWith("http")) {
        return url;
    }

    if (url.startsWith("/images/")) {
        return `https://localhost:7019${url}`;
    }

    if (url.startsWith("images/")) {
        return `https://localhost:7019/${url}`;
    }

    if (url.startsWith("brands/")) {
        return `https://localhost:7019/images/${url}`;
    }

    if (isBrandImage) {
        return `https://localhost:7019/images/brands/${url}`;
    }

    return `https://localhost:7019/images/${url}`;
};

const getBrandImage = (brand) => {
    const imageUrl =
        isValidImageValue(brand.thumbnailUrl)
            ? brand.thumbnailUrl
            : isValidImageValue(brand.logoUrl)
                ? brand.logoUrl
                : isValidImageValue(brand.bannerUrl)
                    ? brand.bannerUrl
                    : "";

    return getImageUrl(imageUrl, true);
};

function HeroCarousel() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) =>
                (prev + 1) % slides.length
            );
        }, 4000);

        return () => clearInterval(timer);
    }, []);

    const slide = slides[current];

    return (
        <div
            style={{
                background: slide.bg,
                minHeight: "280px",
                borderRadius: "28px",
                overflow: "hidden",
                padding: "45px 70px",
                boxShadow: "0 8px 40px rgba(255,110,199,0.18)"
            }}
        >
            <div className="row align-items-center g-4">
                <div className="col-lg-7">
                    <span
                        className="badge mb-3 px-3 py-2"
                        style={{
                            background: "#fff",
                            color: slide.accent,
                            borderRadius: "999px"
                        }}
                    >
                        {slide.badge}
                    </span>

                    <h1
                        className="fw-bold mb-3"
                        style={{
                            fontSize: "46px",
                            color: slide.accent,
                            lineHeight: "1.1"
                        }}
                    >
                        {slide.headline.map((line, index) => (
                            <span
                                key={index}
                                className="d-block"
                            >
                                {line}
                            </span>
                        ))}
                    </h1>

                    <p className="fw-bold text-muted">
                        {slide.sub}
                    </p>

                    <Link
                        to="/products"
                        className="btn btn-dark rounded-pill px-4 mt-3"
                    >
                        Mua ngay
                    </Link>
                </div>

                <div className="col-lg-5 text-center">
                    <div
                        className="mx-auto d-flex align-items-center justify-content-center"
                        style={{
                            width: "250px",
                            height: "250px",
                            borderRadius: "50%",
                            background: "rgba(255,255,255,0.65)",
                            fontSize: "90px"
                        }}
                    >
                        💄
                    </div>
                </div>
            </div>

            <div className="d-flex justify-content-center gap-2 mt-4">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        style={{
                            width: index === current ? "28px" : "9px",
                            height: "9px",
                            borderRadius: "999px",
                            border: "none",
                            background:
                                index === current
                                    ? slide.accent
                                    : "#fff",
                            transition: "0.3s"
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

function AutoScrollRow({ children, speed = 1 }) {
    const scrollRef = useRef(null);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const el = scrollRef.current;

        if (!el) return;

        const timer = setInterval(() => {
            if (isPaused) return;

            el.scrollLeft += speed;

            if (
                el.scrollLeft + el.clientWidth
                >= el.scrollWidth - 2
            ) {
                el.scrollLeft = 0;
            }
        }, 25);

        return () => clearInterval(timer);
    }, [speed, isPaused]);

    return (
        <div
            ref={scrollRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="d-flex gap-4 pb-3 auto-scroll-row"
            style={{
                overflowX: "auto",
                scrollBehavior: "smooth",
                scrollbarWidth: "none"
            }}
        >
            <style>
                {`
                    .auto-scroll-card {
                        flex: 0 0 260px;
                    }

                    .auto-scroll-card .card {
                        transition: 0.3s;
                    }

                    .auto-scroll-card:hover .card {
                        transform: translateY(-6px);
                    }

                    .auto-scroll-img {
                        width: 100%;
                        display: block;
                    }

                    .auto-scroll-row::-webkit-scrollbar {
                        display: none;
                    }
                `}
            </style>

            {children}
        </div>
    );
}

function ProductCard({ product, sale = false }) {
    return (
        <div className="auto-scroll-card">
            <Link
                to={`/product/${product.id}`}
                className="text-decoration-none text-dark"
            >
                <div
                    className="card border-0 shadow-sm h-100 position-relative"
                    style={{
                        borderRadius: "22px",
                        overflow: "hidden"
                    }}
                >
                    {sale && (
                        <span className="badge bg-danger position-absolute top-0 end-0 m-3">
                            SALE
                        </span>
                    )}

                    <img
                        src={getImageUrl(product.imageUrl)}
                        alt={product.name}
                        className="auto-scroll-img"
                        style={{
                            height: "220px",
                            objectFit: "cover"
                        }}
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = fallbackImage;
                        }}
                    />

                    <div className="card-body text-center">
                        <h5 className="fw-bold">
                            {product.name}
                        </h5>

                        <p className="text-danger fw-bold mb-1">
                            {product.price?.toLocaleString()}đ
                        </p>

                        {product.rating && (
                            <small className="text-warning">
                                ⭐ {product.rating}
                            </small>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
}

function HomePage() {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [promotions, setPromotions] = useState([]);
    const [saleProducts, setSaleProducts] = useState([]);

    useEffect(() => {
        loadHomeData();
    }, []);

    const loadHomeData = async () => {
        try {
            const productResult = await getProducts();
            const brandResult = await getBrands();
            const promotionResult = await getPromotions();

            setProducts(productResult.data || []);
            setBrands(brandResult.data || []);
            setPromotions(promotionResult.data || []);

            if ((promotionResult.data || []).length > 0) {
                const firstPromotionId =
                    promotionResult.data[0].id;

                const promotionDetail =
                    await getPromotionById(firstPromotionId);

                setSaleProducts(
                    promotionDetail.data.products || []
                );
            }
        } catch (error) {
            console.log(error);
        }
    };

    const featuredProducts = products.filter(
        (p) => p.rating >= 4.7
    );

    return (
        <div
            style={{
                backgroundColor: "#f5f5f5",
                minHeight: "100vh"
            }}
        >
            <div className="container-fluid px-4 px-lg-5 mt-4">
                <HeroCarousel />
            </div>

            <div className="container-fluid px-4 px-lg-5 py-5">
                <div className="bg-white rounded-5 shadow-sm p-5">
                    <h2 className="fw-bold mb-5">
                        Danh mục nổi bật
                    </h2>

                    <AutoScrollRow speed={1}>
                        {categories.map((item) => (
                            <div
                                key={item.id}
                                style={{
                                    flex: "0 0 190px"
                                }}
                            >
                                <div
                                    className="bg-light rounded-5 p-4 h-100 shadow-sm text-center"
                                    style={{
                                        cursor: "pointer",
                                        transition: "0.3s"
                                    }}
                                    onClick={() => {
                                        if (item.id === 0) {
                                            navigate("/products");
                                        } else {
                                            navigate(
                                                `/products?categoryId=${item.id}`
                                            );
                                        }
                                    }}
                                >
                                    <div
                                        className="mx-auto mb-3 d-flex justify-content-center align-items-center shadow"
                                        style={{
                                            width: "95px",
                                            height: "95px",
                                            borderRadius: "50%",
                                            background:
                                                "linear-gradient(135deg, #8ec5ff, #f7a8ff)",
                                            fontSize: "40px",
                                            color: "white"
                                        }}
                                    >
                                        {item.icon}
                                    </div>

                                    <h5 className="fw-bold mb-0">
                                        {item.name}
                                    </h5>
                                </div>
                            </div>
                        ))}
                    </AutoScrollRow>
                </div>
            </div>

            <div className="container-fluid px-4 px-lg-5 pb-5">
                <div className="bg-white rounded-5 shadow-sm p-5">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="fw-bold">
                            Thương hiệu nổi bật
                        </h2>

                        <Link
                            to="/brands"
                            className="btn btn-dark rounded-pill px-4"
                        >
                            Xem tất cả
                        </Link>
                    </div>

                    <AutoScrollRow speed={1}>
                        {brands.map((brand) => (
                            <div
                                className="auto-scroll-card"
                                key={brand.id}
                            >
                                <Link
                                    to={`/products?brandId=${brand.id}`}
                                    className="text-decoration-none text-dark"
                                >
                                    <div
                                        className="card border-0 shadow-sm h-100"
                                        style={{
                                            borderRadius: "22px",
                                            overflow: "hidden"
                                        }}
                                    >
                                        <img
                                            src={getBrandImage(brand)}
                                            alt={brand.name}
                                            className="auto-scroll-img"
                                            style={{
                                                height: "180px",
                                                objectFit: "cover",
                                                backgroundColor: "#f5f5f5"
                                            }}
                                            onError={(e) => {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src =
                                                    fallbackImage;
                                            }}
                                        />

                                        <div className="card-body text-center">
                                            <h5 className="fw-bold">
                                                {brand.name}
                                            </h5>

                                            <span className="badge bg-dark">
                                                {brand.productCount || 0} sản phẩm
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </AutoScrollRow>
                </div>
            </div>

            <div className="container-fluid px-4 px-lg-5 pb-5">
                <div className="bg-white rounded-5 shadow-sm p-5">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="fw-bold">
                            Sản phẩm nổi bật
                        </h2>

                        <Link
                            to="/products"
                            className="btn btn-outline-dark rounded-pill px-4"
                        >
                            Xem thêm
                        </Link>
                    </div>

                    <AutoScrollRow speed={1}>
                        {featuredProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </AutoScrollRow>
                </div>
            </div>

            <div className="container-fluid px-4 px-lg-5 pb-5">
                <div className="bg-white rounded-5 shadow-sm p-5">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h2 className="fw-bold mb-1">
                                Chương trình khuyến mại
                            </h2>

                            <p className="text-muted mb-0">
                                Các ưu đãi nổi bật đang diễn ra tại Cindybeauty Shop
                            </p>
                        </div>

                        <Link
                            to="/promotion"
                            className="btn btn-danger rounded-pill px-4"
                        >
                            Xem tất cả
                        </Link>
                    </div>

                    <AutoScrollRow speed={1}>
                        {promotions.map((promotion) => (
                            <div
                                className="auto-scroll-card"
                                key={promotion.id}
                            >
                                <Link
                                    to={`/promotions/${promotion.id}`}
                                    className="text-decoration-none text-dark"
                                >
                                    <div
                                        className="card border-0 shadow-sm h-100"
                                        style={{
                                            borderRadius: "22px",
                                            overflow: "hidden"
                                        }}
                                    >
                                        <img
                                            src={getImageUrl(promotion.bannerUrl)}
                                            alt={promotion.title}
                                            className="auto-scroll-img"
                                            style={{
                                                height: "160px",
                                                objectFit: "cover",
                                                backgroundColor: "#f5f5f5"
                                            }}
                                            onError={(e) => {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src =
                                                    fallbackImage;
                                            }}
                                        />

                                        <div className="card-body p-3">
                                            <span className="badge bg-danger mb-2">
                                                Giảm {promotion.discountPercent}%
                                            </span>

                                            <h6 className="fw-bold mb-2">
                                                {promotion.title}
                                            </h6>

                                            <p
                                                className="text-muted small mb-0"
                                                style={{
                                                    minHeight: "38px"
                                                }}
                                            >
                                                {promotion.description}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </AutoScrollRow>
                </div>
            </div>

            <div className="container-fluid px-4 px-lg-5 pb-5">
                <div className="bg-white rounded-5 shadow-sm p-5">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="fw-bold">
                            Sản phẩm đang sale 🔥
                        </h2>

                        <Link
                            to="/flash-sale"
                            className="btn btn-dark rounded-pill px-4"
                        >
                            Săn sale
                        </Link>
                    </div>

                    {saleProducts.length > 0 ? (
                        <AutoScrollRow speed={1}>
                            {saleProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    sale
                                />
                            ))}
                        </AutoScrollRow>
                    ) : (
                        <p className="text-muted text-center mb-0">
                            Chưa có sản phẩm sale để hiển thị.
                        </p>
                    )}
                </div>
            </div>

            <div className="container-fluid px-4 px-lg-5 pb-5">
                <div className="bg-white rounded-5 shadow-sm p-5">
                    <div className="row g-4 align-items-center">
                        <div className="col-lg-6">
                            <h2 className="fw-bold mb-3">
                                Về Cindybeauty Shop
                            </h2>

                            <p className="text-muted">
                                Cindybeauty Shop chuyên cung cấp mỹ phẩm chính hãng, sản phẩm chăm sóc da,
                                trang điểm, nước hoa và các thương hiệu làm đẹp nổi bật trong nước và quốc tế.
                            </p>

                            <div className="row g-3 mt-3">
                                <div className="col-6">
                                    <div className="p-3 bg-light rounded-4">
                                        <h4 className="fw-bold mb-0">
                                            100%
                                        </h4>

                                        <small>
                                            Hàng chính hãng
                                        </small>
                                    </div>
                                </div>

                                <div className="col-6">
                                    <div className="p-3 bg-light rounded-4">
                                        <h4 className="fw-bold mb-0">
                                            {brands.length}+
                                        </h4>

                                        <small>
                                            Thương hiệu
                                        </small>
                                    </div>
                                </div>

                                <div className="col-6">
                                    <div className="p-3 bg-light rounded-4">
                                        <h4 className="fw-bold mb-0">
                                            {products.length}+
                                        </h4>

                                        <small>
                                            Sản phẩm
                                        </small>
                                    </div>
                                </div>

                                <div className="col-6">
                                    <div className="p-3 bg-light rounded-4">
                                        <h4 className="fw-bold mb-0">
                                            24/7
                                        </h4>

                                        <small>
                                            Hỗ trợ khách hàng
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div
                                className="p-4 rounded-5"
                                style={{
                                    background:
                                        "linear-gradient(135deg, #ffe6ef, #f4f8ff)"
                                }}
                            >
                                <h4 className="fw-bold mb-3">
                                    Thông tin liên hệ
                                </h4>

                                <p>
                                    <strong>Hotline:</strong> 0901 234 567
                                </p>

                                <p>
                                    <strong>Email:</strong> cindybeautyshop@gmail.com
                                </p>

                                <p>
                                    <strong>Facebook:</strong> Cindybeauty Shop
                                </p>

                                <p>
                                    <strong>Instagram:</strong> @cindybeautyshop
                                </p>

                                <p>
                                    <strong>Địa chỉ:</strong> Quận 1, TP. Hồ Chí Minh
                                </p>

                                <Link
                                    to="/stores"
                                    className="btn btn-dark rounded-pill px-4 mt-2"
                                >
                                    Xem hệ thống cửa hàng
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;