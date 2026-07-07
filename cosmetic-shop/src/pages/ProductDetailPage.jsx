import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { toast } from "react-toastify";

function ProductDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { addToCart } = useContext(CartContext);

    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const [reviews, setReviews] = useState([]);
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(5);

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [fileType, setFileType] = useState("");

    const [timeLeft, setTimeLeft] = useState({
        hours: 3,
        minutes: 15,
        seconds: 19
    });

    const currentUser = JSON.parse(
        localStorage.getItem("currentUser")
    );

    useEffect(() => {
        loadProduct();
        loadReviews();
    }, [id]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                let { hours, minutes, seconds } = prev;

                if (seconds > 0) {
                    seconds--;
                } else if (minutes > 0) {
                    minutes--;
                    seconds = 59;
                } else if (hours > 0) {
                    hours--;
                    minutes = 59;
                    seconds = 59;
                }

                return { hours, minutes, seconds };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const loadProduct = async () => {
        try {
            const response = await fetch(
                `https://localhost:7019/api/Products/${id}`
            );

            if (!response.ok) {
                console.log(await response.text());
                return;
            }

            const data = await response.json();
            setProduct(data);
        } catch (error) {
            console.log(error);
            toast.error("Không tải được sản phẩm");
        }
    };

    const loadReviews = async () => {
        try {
            const response = await fetch(
                `https://localhost:7019/api/Reviews/product/${id}`
            );

            if (!response.ok) {
                console.log(await response.text());
                return;
            }

            const data = await response.json();
            setReviews(data);
        } catch (error) {
            console.log(error);
        }
    };

    const getImageSrc = (imageUrl) => {
        if (!imageUrl) return "/no-image.png";

        if (imageUrl.startsWith("http")) {
            return imageUrl;
        }

        return `https://localhost:7019/images/${imageUrl}`;
    };

    const increase = () => {
        setQuantity(prev => prev + 1);
    };

    const decrease = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const handleAddToCart = () => {

    if (!currentUser) {

        toast.warning(
            "Vui lòng đăng nhập trước"
        );

        return;
    }

    addToCart(product, quantity);

    toast.success(
        "Đã thêm vào giỏ hàng!"
    );
};

    const handleBuyNow = () => {

    if (!currentUser) {

        toast.warning(
            "Vui lòng đăng nhập trước khi mua hàng"
        );

        return;
    }

    navigate("/checkout", {
        state: {
            product: {
                ...product,
                finalPrice:
                    product.finalPrice ||
                    product.price
            },
            quantity
        }
    });
};

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        setSelectedFile(file);

        const fileURL = URL.createObjectURL(file);
        setPreviewUrl(fileURL);

        if (file.type.startsWith("image/")) {
            setFileType("image");
        } else if (file.type.startsWith("video/")) {
            setFileType("video");
        } else {
            setFileType("");
        }
    };

    const handleSubmitReview = async () => {
        if (!currentUser) {
            toast.warning("Vui lòng đăng nhập để đánh giá!");
            navigate("/login");
            return;
        }

        if (comment.trim() === "") {
            toast.error("Vui lòng nhập nội dung đánh giá!");
            return;
        }

        const formData = new FormData();

        formData.append("productId", Number(id));
        formData.append(
            "userName",
            currentUser.username ||
            currentUser.fullName ||
            currentUser.email ||
            "Khách hàng"
        );
        formData.append("userEmail", currentUser.email || "");
        formData.append("rating", rating);
        formData.append("comment", comment.trim());

        if (selectedFile) {
            formData.append("media", selectedFile);
        }

        try {
            const response = await fetch(
                "https://localhost:7019/api/Reviews",
                {
                    method: "POST",
                    body: formData
                }
            );

            if (response.ok) {
                setComment("");
                setRating(5);
                setSelectedFile(null);
                setPreviewUrl("");
                setFileType("");

                toast.success("Đánh giá thành công!");
                loadReviews();
            } else {
                const errorText = await response.text();
                console.log(errorText);
                toast.error(errorText || "Không thể gửi đánh giá!");
            }
        } catch (error) {
            console.log(error);
            toast.error("Lỗi kết nối API!");
        }
    };

    const renderStars = (starCount) => {
        return (
            <span className="text-warning fs-5">
                {"★".repeat(starCount)}
                {"☆".repeat(5 - starCount)}
            </span>
        );
    };

    if (!product) {
        return (
            <div className="container py-5">
                <h3>Đang tải...</h3>
            </div>
        );
    }

    const hasDiscount =
        product.discountPercent &&
        product.discountPercent > 0;

    const finalPrice = hasDiscount
        ? product.finalPrice ||
          product.price - (product.price * product.discountPercent / 100)
        : product.price;

    return (
        <div className="container py-5">
            <div className="row g-5">
                <div className="col-md-5">
                    <img
                        src={getImageSrc(product.imageUrl)}
                        alt={product.name}
                        className="img-fluid rounded shadow"
                        style={{
                            width: "100%",
                            maxHeight: "520px",
                            objectFit: "cover"
                        }}
                        onError={(e) => {
                            e.currentTarget.src = "/no-image.png";
                        }}
                    />
                </div>

                <div className="col-md-7">
                    <h2 className="fw-bold mb-3">
                        {product.name}
                    </h2>

                    {hasDiscount && (
                        <div
                            className="mb-4 p-3 rounded"
                            style={{
                                background:
                                    "linear-gradient(90deg,#ff006a,#8f00ff)",
                                color: "#fff"
                            }}
                        >
                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                                <div>
                                    <span
                                        className="badge bg-warning text-dark me-2"
                                        style={{ fontSize: "15px" }}
                                    >
                                        FLASH SALE
                                    </span>

                                    <span className="fw-bold">
                                        Giảm {product.discountPercent}%
                                    </span>
                                </div>

                                <div className="fw-bold">
                                    Kết thúc sau:{" "}
                                    <span className="bg-white text-danger px-2 py-1 rounded">
                                        {String(timeLeft.hours).padStart(2, "0")}
                                    </span>
                                    {" : "}
                                    <span className="bg-white text-danger px-2 py-1 rounded">
                                        {String(timeLeft.minutes).padStart(2, "0")}
                                    </span>
                                    {" : "}
                                    <span className="bg-white text-danger px-2 py-1 rounded">
                                        {String(timeLeft.seconds).padStart(2, "0")}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mb-4">
                        {hasDiscount ? (
                            <>
                                <h3 className="text-danger fw-bold mb-1">
                                    {finalPrice?.toLocaleString()}đ
                                </h3>

                                <div
                                    style={{
                                        textDecoration: "line-through",
                                        color: "#999"
                                    }}
                                >
                                    {product.price?.toLocaleString()}đ
                                </div>
                            </>
                        ) : (
                            <h3 className="text-danger fw-bold mb-0">
                                {product.price?.toLocaleString()}đ
                            </h3>
                        )}
                    </div>

                    <div className="mb-3 fs-5">
                        ⭐ {product.rating || 5}/5
                    </div>

                    <div className="mb-3">
                        <strong>Xuất xứ:</strong>{" "}
                        {product.origin || "Đang cập nhật"}
                    </div>

                    <div className="mb-3">
                        <strong>Còn lại:</strong> {product.stock}
                    </div>

                    <div className="mb-4">
                        <strong>Mô tả sản phẩm:</strong>

                        <p className="mt-2 text-secondary">
                            {product.description}
                        </p>
                    </div>

                    <div className="d-flex align-items-center gap-3 mb-4">
                        <strong>Số lượng:</strong>

                        <button
                            className="btn btn-outline-secondary"
                            onClick={decrease}
                        >
                            -
                        </button>

                        <span className="fs-5 fw-bold">
                            {quantity}
                        </span>

                        <button
                            className="btn btn-outline-secondary"
                            onClick={increase}
                        >
                            +
                        </button>
                    </div>

                    <div className="d-flex gap-3 flex-wrap">
                        <button
                            className="btn btn-outline-danger px-4 py-3 fw-bold"
                            onClick={handleAddToCart}
                        >
                            🛒 Thêm vào giỏ hàng
                        </button>

                        <button
                            className="btn btn-danger px-5 py-3 fw-bold"
                            onClick={handleBuyNow}
                        >
                            Mua ngay
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-5">
                <h3 className="fw-bold mb-4">
                    Đánh giá sản phẩm
                </h3>

                <div className="card shadow-sm border-0 p-4 mb-5">
                    <h5 className="fw-bold mb-3">
                        Viết đánh giá
                    </h5>

                    <div className="mb-3">
                        <label className="fw-bold mb-2 d-block">
                            Đánh giá của bạn
                        </label>

                        <div className="fs-2">
                            {[1, 2, 3, 4, 5].map(star => (
                                <span
                                    key={star}
                                    onClick={() => setRating(star)}
                                    style={{
                                        cursor: "pointer",
                                        color:
                                            star <= rating
                                                ? "#ffc107"
                                                : "#ccc",
                                        transition: "0.2s"
                                    }}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="mb-3">
                        <textarea
                            className="form-control"
                            rows="4"
                            placeholder="Nhập đánh giá của bạn..."
                            value={comment}
                            onChange={(e) =>
                                setComment(e.target.value)
                            }
                        />
                    </div>

                    <div className="mb-4">
                        <label className="fw-bold mb-3 d-block">
                            Thêm hình ảnh / video
                        </label>

                        <input
                            type="file"
                            accept="image/*,video/*"
                            className="form-control"
                            onChange={handleFileChange}
                        />
                    </div>

                    {previewUrl && (
                        <div className="mb-4">
                            {fileType === "image" ? (
                                <img
                                    src={previewUrl}
                                    alt="preview"
                                    className="img-fluid rounded shadow"
                                    style={{
                                        maxWidth: "300px"
                                    }}
                                />
                            ) : (
                                <video
                                    src={previewUrl}
                                    controls
                                    preload="metadata"
                                    className="rounded shadow"
                                    style={{
                                        width: "300px"
                                    }}
                                />
                            )}
                        </div>
                    )}

                    <button
                        className="btn btn-danger"
                        onClick={handleSubmitReview}
                    >
                        Gửi đánh giá
                    </button>
                </div>

                <div>
                    {reviews.length === 0 ? (
                        <p className="text-muted">
                            Chưa có đánh giá nào.
                        </p>
                    ) : (
                        reviews.map(review => (
                            <div
                                key={review.id}
                                className="card border-0 shadow-sm mb-3 p-4 rounded-4"
                            >
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h6 className="fw-bold mb-0">
                                        {review.userName}
                                    </h6>

                                    {renderStars(review.rating)}
                                </div>

                                <p className="text-secondary mb-2">
                                    {review.comment}
                                </p>

                                {review.mediaUrl && (
                                    <div className="mt-3">
                                        {review.mediaType === "image" ? (
                                            <img
                                                src={review.mediaUrl}
                                                alt="review"
                                                className="img-fluid rounded"
                                                style={{
                                                    maxWidth: "250px"
                                                }}
                                                onError={(e) => {
                                                    e.currentTarget.src = "/no-image.png";
                                                }}
                                            />
                                        ) : (
                                            <video
                                                src={review.mediaUrl}
                                                controls
                                                preload="metadata"
                                                className="rounded"
                                                style={{
                                                    width: "300px"
                                                }}
                                            />
                                        )}
                                    </div>
                                )}

                                {review.adminReply && (
                                    <div
                                        className="mt-3 p-3 rounded-4"
                                        style={{
                                            background: "#f0fdf4",
                                            border: "1px solid #bbf7d0"
                                        }}
                                    >
                                        <div className="fw-bold text-success mb-1">
                                            Phản hồi từ CindyBeauty
                                        </div>

                                        <div className="text-secondary">
                                            {review.adminReply}
                                        </div>
                                    </div>
                                )}

                                <small className="text-muted mt-3 d-block">
                                    {review.createdAt
                                        ? new Date(review.createdAt).toLocaleString()
                                        : ""}
                                </small>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductDetailPage;