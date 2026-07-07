import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function ReviewListPage() {
    const [reviews, setReviews] = useState([]);
    const [search, setSearch] = useState("");
    const [ratingFilter, setRatingFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [replyingId, setReplyingId] = useState(null);
    const [replyText, setReplyText] = useState("");

    useEffect(() => {
        loadReviews();
    }, []);

    const loadReviews = async () => {
        try {
            const res = await fetch(
                "https://localhost:7019/api/admin/reviews"
            );

            if (!res.ok) {
                toast.error("Không tải được đánh giá");
                return;
            }

            const data = await res.json();
            setReviews(data);
        } catch (err) {
            console.log(err);
            toast.error("Lỗi kết nối API");
        }
    };

    const getImageSrc = (imageUrl) => {
        if (!imageUrl) return "/no-image.png";

        if (imageUrl.startsWith("http")) {
            return imageUrl;
        }

        return `https://localhost:7019/images/${imageUrl}`;
    };

    const renderStars = (rating) => {
        return "★".repeat(rating) + "☆".repeat(5 - rating);
    };

    const toggleHide = async (id) => {
        try {
            const res = await fetch(
                `https://localhost:7019/api/admin/reviews/${id}/hide`,
                {
                    method: "PUT"
                }
            );

            if (!res.ok) {
                toast.error("Không thể cập nhật trạng thái ẩn");
                return;
            }

            toast.success("Đã cập nhật trạng thái");
            loadReviews();
        } catch (err) {
            console.log(err);
            toast.error("Lỗi kết nối API");
        }
    };

    const toggleSpam = async (id) => {
        try {
            const res = await fetch(
                `https://localhost:7019/api/admin/reviews/${id}/spam`,
                {
                    method: "PUT"
                }
            );

            if (!res.ok) {
                toast.error("Không thể cập nhật spam");
                return;
            }

            toast.success("Đã cập nhật spam");
            loadReviews();
        } catch (err) {
            console.log(err);
            toast.error("Lỗi kết nối API");
        }
    };

    const deleteReview = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa đánh giá này?")) {
            return;
        }

        try {
            const res = await fetch(
                `https://localhost:7019/api/admin/reviews/${id}`,
                {
                    method: "DELETE"
                }
            );

            if (!res.ok) {
                toast.error("Không thể xóa đánh giá");
                return;
            }

            toast.success("Đã xóa đánh giá");
            loadReviews();
        } catch (err) {
            console.log(err);
            toast.error("Lỗi kết nối API");
        }
    };

    const startReply = (review) => {
        setReplyingId(review.id);
        setReplyText(review.adminReply || "");
    };

    const sendReply = async (id) => {
        if (!replyText.trim()) {
            toast.error("Nhập nội dung phản hồi");
            return;
        }

        try {
            const res = await fetch(
                `https://localhost:7019/api/admin/reviews/${id}/reply`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        reply: replyText
                    })
                }
            );

            if (!res.ok) {
                const text = await res.text();
                toast.error(text || "Không thể phản hồi");
                return;
            }

            toast.success("Đã phản hồi đánh giá");
            setReplyingId(null);
            setReplyText("");
            loadReviews();
        } catch (err) {
            console.log(err);
            toast.error("Lỗi kết nối API");
        }
    };

    const filteredReviews = reviews.filter(review => {
        const matchSearch =
            review.userName?.toLowerCase().includes(search.toLowerCase()) ||
            review.productName?.toLowerCase().includes(search.toLowerCase()) ||
            review.comment?.toLowerCase().includes(search.toLowerCase());

        const matchRating =
            ratingFilter === "all" ||
            review.rating === Number(ratingFilter);

        const matchStatus =
            statusFilter === "all" ||
            (statusFilter === "hidden" && review.isHidden) ||
            (statusFilter === "visible" && !review.isHidden) ||
            (statusFilter === "spam" && review.isSpam) ||
            (statusFilter === "replied" && review.adminReply);

        return matchSearch && matchRating && matchStatus;
    });

    const totalReviews = reviews.length;
    const avgRating =
        totalReviews > 0
            ? (
                reviews.reduce((sum, r) => sum + r.rating, 0) /
                totalReviews
            ).toFixed(1)
            : "0.0";

    const hiddenCount = reviews.filter(r => r.isHidden).length;
    const spamCount = reviews.filter(r => r.isSpam).length;

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1">
                        Quản lý đánh giá
                    </h2>

                    <div className="text-muted">
                        Theo dõi đánh giá sản phẩm và phản hồi khách hàng
                    </div>
                </div>

                <div className="fw-bold text-danger">
                    Tổng: {totalReviews} đánh giá
                </div>
            </div>

            <div className="row g-3 mb-4">
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-body">
                            <div className="text-muted small">
                                Tổng đánh giá
                            </div>

                            <h3 className="fw-bold mb-0">
                                {totalReviews}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-body">
                            <div className="text-muted small">
                                Điểm trung bình
                            </div>

                            <h3 className="fw-bold text-warning mb-0">
                                ★ {avgRating}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-body">
                            <div className="text-muted small">
                                Đang ẩn
                            </div>

                            <h3 className="fw-bold text-secondary mb-0">
                                {hiddenCount}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-body">
                            <div className="text-muted small">
                                Spam
                            </div>

                            <h3 className="fw-bold text-danger mb-0">
                                {spamCount}
                            </h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <input
                                className="form-control"
                                placeholder="Tìm theo khách hàng, sản phẩm, nội dung..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="col-md-3">
                            <select
                                className="form-select"
                                value={ratingFilter}
                                onChange={(e) => setRatingFilter(e.target.value)}
                            >
                                <option value="all">Tất cả sao</option>
                                <option value="5">5 sao</option>
                                <option value="4">4 sao</option>
                                <option value="3">3 sao</option>
                                <option value="2">2 sao</option>
                                <option value="1">1 sao</option>
                            </select>
                        </div>

                        <div className="col-md-3">
                            <select
                                className="form-select"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">Tất cả trạng thái</option>
                                <option value="visible">Đang hiển thị</option>
                                <option value="hidden">Đang ẩn</option>
                                <option value="spam">Spam</option>
                                <option value="replied">Đã phản hồi</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="d-flex flex-column gap-3">
                {filteredReviews.map(review => (
                    <div
                        className="card border-0 shadow-sm rounded-4"
                        key={review.id}
                    >
                        <div className="card-body p-4">
                            <div className="row g-4">
                                <div className="col-md-2">
                                    <img
                                        src={getImageSrc(review.productImage)}
                                        alt={review.productName}
                                        style={{
                                            width: "100%",
                                            height: "150px",
                                            objectFit: "cover",
                                            borderRadius: "18px",
                                            border: "1px solid #eee"
                                        }}
                                        onError={(e) => {
                                            e.currentTarget.src = "/no-image.png";
                                        }}
                                    />
                                </div>

                                <div className="col-md-7">
                                    <div className="d-flex align-items-center gap-2 mb-2">
                                        <h5 className="fw-bold mb-0">
                                            {review.productName}
                                        </h5>

                                        {review.isHidden && (
                                            <span className="badge bg-secondary">
                                                Đang ẩn
                                            </span>
                                        )}

                                        {review.isSpam && (
                                            <span className="badge bg-danger">
                                                Spam
                                            </span>
                                        )}
                                    </div>

                                    <div className="text-warning fs-5 mb-2">
                                        {renderStars(review.rating)}
                                    </div>

                                    <div className="mb-2">
                                        <span className="fw-bold">
                                            {review.userName}
                                        </span>

                                        {review.userEmail && (
                                            <span className="text-muted">
                                                {" "}({review.userEmail})
                                            </span>
                                        )}
                                    </div>

                                    <p className="mb-2">
                                        {review.comment}
                                    </p>

                                    <small className="text-muted">
                                        {new Date(review.createdAt).toLocaleString()}
                                    </small>

                                    {review.adminReply && (
                                        <div
                                            className="mt-3 p-3 rounded-4"
                                            style={{
                                                background: "#f0fdf4",
                                                border: "1px solid #bbf7d0"
                                            }}
                                        >
                                            <div className="fw-bold text-success mb-1">
                                                Phản hồi của shop
                                            </div>

                                            <div>
                                                {review.adminReply}
                                            </div>
                                        </div>
                                    )}

                                    {replyingId === review.id && (
                                        <div className="mt-3">
                                            <textarea
                                                className="form-control mb-2"
                                                rows="3"
                                                value={replyText}
                                                onChange={(e) =>
                                                    setReplyText(e.target.value)
                                                }
                                                placeholder="Nhập phản hồi của shop..."
                                            />

                                            <button
                                                className="btn btn-success btn-sm me-2"
                                                onClick={() =>
                                                    sendReply(review.id)
                                                }
                                            >
                                                Gửi phản hồi
                                            </button>

                                            <button
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => {
                                                    setReplyingId(null);
                                                    setReplyText("");
                                                }}
                                            >
                                                Hủy
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="col-md-3">
                                    <div className="d-flex flex-column gap-2">
                                        <button
                                            className="btn btn-outline-success btn-sm rounded-pill"
                                            onClick={() => startReply(review)}
                                        >
                                            💬 Phản hồi
                                        </button>

                                        <button
                                            className="btn btn-outline-secondary btn-sm rounded-pill"
                                            onClick={() => toggleHide(review.id)}
                                        >
                                            {review.isHidden
                                                ? "👁 Hiện lại"
                                                : "🙈 Ẩn đánh giá"}
                                        </button>

                                        <button
                                            className="btn btn-outline-warning btn-sm rounded-pill"
                                            onClick={() => toggleSpam(review.id)}
                                        >
                                            {review.isSpam
                                                ? "Bỏ spam"
                                                : "⚠ Đánh dấu spam"}
                                        </button>

                                        <button
                                            className="btn btn-outline-danger btn-sm rounded-pill"
                                            onClick={() => deleteReview(review.id)}
                                        >
                                            🗑 Xóa
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredReviews.length === 0 && (
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-body text-center py-5 text-muted">
                            Không có đánh giá phù hợp.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ReviewListPage;