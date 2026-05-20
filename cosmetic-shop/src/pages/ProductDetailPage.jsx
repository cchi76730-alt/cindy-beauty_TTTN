import { useEffect, useState, useContext } from "react";

import {
    useParams,
    useNavigate
} from "react-router-dom";

import { CartContext } from "../context/CartContext";

import { toast } from "react-toastify";

function ProductDetailPage() {

    const { id } = useParams();

    const navigate = useNavigate();

    const { addToCart } = useContext(CartContext);

    const [product, setProduct] = useState(null);

    const [quantity, setQuantity] = useState(1);

    // reviews
    const [reviews, setReviews] = useState([]);

    const [comment, setComment] = useState("");

    const [rating, setRating] = useState(5);

    // media
    const [selectedFile, setSelectedFile] = useState(null);

    const [previewUrl, setPreviewUrl] = useState("");

    const [fileType, setFileType] = useState("");

    // user login
    const currentUser =
        JSON.parse(localStorage.getItem("currentUser"));

    // load product + reviews
    useEffect(() => {

        // product
        fetch(`http://localhost:5114/api/Products/${id}`)
            .then(res => res.json())
            .then(data => {
                setProduct(data);
            })
            .catch(err => console.log(err));

        // reviews
        fetch(`http://localhost:5114/api/Reviews/product/${id}`)
            .then(res => res.json())
            .then(data => {
                setReviews(data);
            })
            .catch(err => console.log(err));

    }, [id]);

    // loading
    if (!product) {
        return <h3>Đang tải...</h3>;
    }

    // tăng số lượng
    const increase = () => {
        setQuantity(prev => prev + 1);
    };

    // giảm số lượng
    const decrease = () => {

        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    // thêm giỏ hàng
    const handleAddToCart = () => {

        addToCart(product, quantity);

        toast.success("Đã thêm vào giỏ hàng!");
    };

    // mua ngay
    const handleBuyNow = () => {

        navigate("/checkout", {
            state: {
                product: {
                    ...product,
                    finalPrice:
                        product.finalPrice || product.price
                },
                quantity: quantity
            }
        });
    };

    // chọn file
    const handleFileChange = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        setSelectedFile(file);

        // preview local
        const fileURL = URL.createObjectURL(file);

        setPreviewUrl(fileURL);

        // check type
        if (file.type.startsWith("image/")) {

            setFileType("image");

        } else if (file.type.startsWith("video/")) {

            setFileType("video");
        }
    };

    // gửi đánh giá
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

        const reviewData = {

    productId: Number(id),

    userName:
        currentUser.username ||
        currentUser.fullName ||
        currentUser.email ||
        "Khách hàng",

    rating: rating,

    comment: comment,

    mediaUrl: previewUrl || "",

    mediaType: fileType || ""
};

        console.log(reviewData);

        try {

            const response = await fetch(
                "http://localhost:5114/api/Reviews",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(reviewData)
                }
            );

            if (response.ok) {

                const newReview = await response.json();

                setReviews([newReview, ...reviews]);

                setComment("");

                setRating(5);

                setSelectedFile(null);

                setPreviewUrl("");

                setFileType("");

                toast.success(
                    "🎉 Đánh giá thành công!",
                    {
                        position: "top-right",
                        autoClose: 2500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        theme: "colored"
                    }
                );

            } else {

                const errorText =
                    await response.text();

                console.log(errorText);

                toast.error(
                    "Không thể gửi đánh giá!"
                );
            }

        } catch (error) {

            console.log(error);

            toast.error("Lỗi kết nối API!");
        }
    };

    // render sao
    const renderStars = (starCount) => {

        return (
            <span className="text-warning fs-5">

                {"★".repeat(starCount)}

                {"☆".repeat(5 - starCount)}

            </span>
        );
    };

    return (

        <div className="container py-5">

            {/* PRODUCT DETAIL */}
            <div className="row g-5">

                {/* IMAGE */}
                <div className="col-md-5">

                    <img
                        src={`http://localhost:5114/images/${product.imageUrl}`}
                        alt={product.name}
                        className="img-fluid rounded shadow"
                        style={{
                            width: "100%",
                            objectFit: "cover"
                        }}
                    />

                </div>

                {/* INFO */}
                <div className="col-md-7">

                    <h2 className="fw-bold mb-3">
                        {product.name}
                    </h2>

                    <div className="mb-4">

                        {product.discountPercent &&
                            product.discountPercent > 0 && (

                                <div
                                    className="badge bg-danger mb-3"
                                    style={{
                                        fontSize: "15px",
                                        padding: "10px 14px"
                                    }}
                                >
                                    SALE {product.discountPercent}%
                                </div>

                            )}

                        {product.finalPrice ? (

                            <>

                                <h3 className="text-danger fw-bold mb-1">

                                    {product.finalPrice?.toLocaleString()}đ

                                </h3>

                                <div
                                    style={{
                                        textDecoration:
                                            "line-through",
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

                        {product.origin}

                    </div>

                    <div className="mb-3">

                        <strong>Còn lại:</strong>{" "}

                        {product.stock}

                    </div>

                    <div className="mb-4">

                        <strong>Mô tả sản phẩm:</strong>

                        <p className="mt-2 text-secondary">
                            {product.description}
                        </p>

                    </div>

                    {/* quantity */}
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

                    {/* BUTTONS */}
                    <div className="d-flex gap-3">

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

            {/* REVIEW SECTION */}
            <div className="mt-5">

                <h3 className="fw-bold mb-4">
                    Đánh giá sản phẩm
                </h3>

                {/* form review */}
                <div className="card shadow-sm border-0 p-4 mb-5">

                    <h5 className="fw-bold mb-3">
                        Viết đánh giá
                    </h5>

                    {/* chọn sao */}
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

                    {/* comment */}
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

                    {/* upload media */}
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

                    {/* preview */}
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

                {/* review list */}
                <div>

                    {reviews.length === 0 ? (

                        <p className="text-muted">
                            Chưa có đánh giá nào.
                        </p>

                    ) : (

                        reviews.map(review => (

                            <div
                                key={review.id}
                                className="card border-0 shadow-sm mb-3 p-3"
                            >

                                <div className="d-flex justify-content-between align-items-center mb-2">

                                    <h6 className="fw-bold mb-0">

                                        {review.userName}

                                    </h6>

                                    {renderStars(review.rating)}

                                </div>

                                <p className="text-secondary">

                                    {review.comment}

                                </p>

                                {/* media review */}
                                {review.mediaUrl && (

                                    <div className="mt-3">

                                        {review.mediaType?.includes("image") ||
                                            review.mediaType === "image" ? (

                                            <img
                                                src={review.mediaUrl}
                                                alt="review"
                                                className="img-fluid rounded"
                                                style={{
                                                    maxWidth: "250px"
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

                            </div>

                        ))

                    )}

                </div>

            </div>

        </div>
    );
}

export default ProductDetailPage;