import { useEffect, useState } from "react";

import {
    Link,
    useNavigate
} from "react-router-dom";

function FlashSalePage() {

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);

    // countdown
    const [timeLeft, setTimeLeft] = useState({
        hours: 3,
        minutes: 15,
        seconds: 19
    });

    // ================= IMAGE =================
    const getImageSrc = (imageUrl) => {

        if (!imageUrl) {
            return "/no-image.png";
        }

        // đã là full url
        if (imageUrl.startsWith("http")) {
            return imageUrl;
        }

        // chỉ là tên file
        return `https://localhost:7019/images/${imageUrl}`;
    };

    // ================= LOAD PRODUCTS =================
    useEffect(() => {

        fetch("https://localhost:7019/api/Products")
            .then(res => res.json())
            .then(data => {

                const flashSaleProducts = data.map(item => {

                    // nếu backend đã có discount
                    const discount =
                        item.discountPercent > 0
                            ? item.discountPercent
                            : Math.floor(Math.random() * 35) + 5;

                    const finalPrice =
                        item.finalPrice ||
                        Math.floor(
                            item.price -
                            (item.price * discount / 100)
                        );

                    return {

                        ...item,

                        discountPercent: discount,

                        finalPrice: finalPrice
                    };
                });

                setProducts(flashSaleProducts);

            })
            .catch(err => console.log(err));

    }, []);

    // ================= COUNTDOWN =================
    useEffect(() => {

        const timer = setInterval(() => {

            setTimeLeft(prev => {

                let {
                    hours,
                    minutes,
                    seconds
                } = prev;

                if (seconds > 0) {

                    seconds--;

                } else {

                    if (minutes > 0) {

                        minutes--;

                        seconds = 59;

                    } else {

                        if (hours > 0) {

                            hours--;

                            minutes = 59;

                            seconds = 59;
                        }
                    }
                }

                return {
                    hours,
                    minutes,
                    seconds
                };
            });

        }, 1000);

        return () => clearInterval(timer);

    }, []);

    return (

        <div
            style={{
                background:
                    "linear-gradient(135deg,#7cb7ff,#d38fff,#f7c191)",
                minHeight: "100vh",
                paddingBottom: "50px"
            }}
        >

            {/* HEADER */}
            <div
                style={{
                    background:
                        "linear-gradient(90deg,#ff006a,#8f00ff)",
                    padding: "18px 0",
                    textAlign: "center",
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "52px"
                }}
            >
                ⚡ FLASH SALE ⚡
            </div>

            {/* TABS */}
            <div className="row g-0">

                <div
                    className="col-6 text-center py-3 fw-bold"
                    style={{
                        background: "#fff",
                        color: "#ff1976",
                        fontSize: "24px"
                    }}
                >
                    Đang diễn ra
                </div>

                <div
                    className="col-6 text-center py-3 fw-bold"
                    style={{
                        background: "rgba(255,255,255,0.25)",
                        color: "#fff",
                        fontSize: "24px"
                    }}
                >
                    Sắp diễn ra
                </div>

            </div>

            {/* COUNTDOWN */}
            <div className="text-center py-4">

                <span
                    className="fw-bold me-3"
                    style={{
                        color: "#fff",
                        fontSize: "22px"
                    }}
                >
                    Thời gian còn lại :
                </span>

                {[
                    timeLeft.hours,
                    timeLeft.minutes,
                    timeLeft.seconds
                ].map((time, index) => (

                    <span
                        key={index}
                        style={{
                            background: "#fff",
                            color: "#ff1976",
                            padding: "10px 14px",
                            borderRadius: "10px",
                            fontWeight: "bold",
                            fontSize: "22px",
                            margin: "0 5px"
                        }}
                    >
                        {String(time).padStart(2, "0")}
                    </span>

                ))}

            </div>

            {/* PRODUCTS */}
            <div className="container-fluid px-4">

                <h2 className="text-white fw-bold mb-4">
                    • Tất cả sản phẩm Flash Sale
                </h2>

                {products.length === 0 ? (

                    <div className="text-center text-white fs-4 py-5">
                        Không có sản phẩm flash sale
                    </div>

                ) : (

                    <div className="row g-4">

                        {products.map(product => (

                            <div
                                key={product.id}
                                className="col-xl-2 col-lg-3 col-md-4 col-sm-6"
                            >

                                <Link
                                    to={`/product/${product.id}`}
                                    className="text-decoration-none"
                                >

                                    <div
                                        className="card border-0 shadow-sm h-100 overflow-hidden"
                                        style={{
                                            borderRadius: "18px"
                                        }}
                                    >

                                        {/* SALE BADGE */}
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: 0,
                                                right: 0,
                                                background: "#ff1d25",
                                                color: "#fff",
                                                padding: "4px 12px",
                                                fontWeight: "bold",
                                                fontSize: "16px",
                                                borderBottomLeftRadius: "12px",
                                                zIndex: 10
                                            }}
                                        >
                                            -{product.discountPercent}%
                                        </div>

                                        {/* IMAGE */}
                                        <div
                                            style={{
                                                background: "#fff",
                                                padding: "10px"
                                            }}
                                        >

                                            <img
                                                src={getImageSrc(product.imageUrl)}
                                                alt={product.name}
                                                style={{
                                                    width: "100%",
                                                    height: "280px",
                                                    objectFit: "contain"
                                                }}
                                                onError={(e) => {
                                                    e.currentTarget.src =
                                                        "/no-image.png";
                                                }}
                                            />

                                        </div>

                                        {/* INFO */}
                                        <div className="p-3">

                                            <h5
                                                style={{
                                                    color: "#333",
                                                    minHeight: "58px",
                                                    fontSize: "17px",
                                                    lineHeight: "1.4"
                                                }}
                                            >
                                                {product.name}
                                            </h5>

                                            {/* PRICE */}
                                            <div className="mb-3">

                                                <span
                                                    className="fw-bold"
                                                    style={{
                                                        color: "#ff1976",
                                                        fontSize: "30px"
                                                    }}
                                                >
                                                    {product.finalPrice?.toLocaleString()}đ
                                                </span>

                                                <span
                                                    className="ms-2"
                                                    style={{
                                                        color: "#999",
                                                        textDecoration:
                                                            "line-through",
                                                        fontSize: "15px"
                                                    }}
                                                >
                                                    {product.price?.toLocaleString()}đ
                                                </span>

                                            </div>

                                            {/* BUY NOW */}
                                            <button
                                                className="btn w-100 fw-bold"
                                                style={{
                                                    background:
                                                        "linear-gradient(135deg,#ff1976,#ff5fa2)",
                                                    color: "#fff",
                                                    border: "none",
                                                    borderRadius: "12px",
                                                    padding: "10px",
                                                    fontSize: "16px"
                                                }}
                                                onClick={(e) => {

                                                    e.preventDefault();

                                                    navigate("/checkout", {
                                                        state: {
                                                            product: product,
                                                            quantity: 1,
                                                            finalPrice:
                                                                product.finalPrice
                                                        }
                                                    });
                                                }}
                                            >
                                                Mua ngay giá sale
                                            </button>

                                        </div>

                                    </div>

                                </Link>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}

export default FlashSalePage;