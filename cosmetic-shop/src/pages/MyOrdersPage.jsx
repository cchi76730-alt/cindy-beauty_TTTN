import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function MyOrdersPage() {
    const navigate = useNavigate();

    const [phone, setPhone] = useState("");
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState("all");
    const [paymentOrder, setPaymentOrder] = useState(null);
    const [detailOrder, setDetailOrder] = useState(null);

    const tabs = [
        { key: "all", label: "Tất cả" },
        { key: "payment", label: "Thanh toán" },
        { key: "confirmed", label: "Đã xác nhận" },
        { key: "shipping", label: "Vận chuyển" },
        { key: "completed", label: "Đã hoàn thành" },
        { key: "cancelled", label: "Đã hủy" },
        { key: "refund", label: "Hoàn tiền trả lại" }
    ];

    const searchOrders = async () => {
        if (!phone.trim()) {
            toast.error("Nhập số điện thoại để xem đơn hàng");
            return;
        }

        try {
            const res = await fetch(
                `https://localhost:7019/api/orders/phone/${phone.trim()}`
            );

            if (!res.ok) {
                toast.error("Không tìm thấy đơn hàng");
                return;
            }

            const data = await res.json();
            setOrders(data);

            if (data.length === 0) {
                toast.info("Số điện thoại này chưa có đơn hàng");
            }
        } catch (err) {
            console.log(err);
            toast.error("Lỗi kết nối API");
        }
    };

    const completeOrder = async (orderId) => {
        const confirmReceive = window.confirm(
            "Bạn xác nhận đã nhận được hàng?"
        );

        if (!confirmReceive) return;

        try {
            const res = await fetch(
                `https://localhost:7019/api/orders/${orderId}/complete`,
                {
                    method: "PUT"
                }
            );

            if (!res.ok) {
                const text = await res.text();
                toast.error(text || "Không thể xác nhận đã nhận hàng");
                return;
            }

            toast.success("Đã xác nhận nhận hàng");

            setOrders(prev =>
                prev.map(order =>
                    order.id === orderId
                        ? {
                            ...order,
                            status: "Completed"
                        }
                        : order
                )
            );

            setActiveTab("completed");
        } catch (err) {
            console.log(err);
            toast.error("Lỗi kết nối API");
        }
    };

    const handleReviewProduct = (productId) => {
        if (!productId) {
            toast.error("Không tìm thấy sản phẩm để đánh giá");
            return;
        }

        navigate(`/product/${productId}`);
    };

    const handleBuyAgain = (order) => {
        const items = order.orderDetails?.map(item => ({
            ...item.product,
            id: item.productId,
            quantity: item.quantity,
            price: item.price,
            finalPrice: item.price
        })) || [];

        if (items.length === 0) {
            toast.error("Không có sản phẩm để mua lại");
            return;
        }

        navigate("/checkout", {
            state: {
                selectedItems: items
            }
        });
    };

    const getQrUrl = (order) => {
        if (!order) return "";

        const bankId = "MB";
        const accountNo = "0327991146";
        const amount = Math.floor(order.totalAmount);
        const addInfo = `DH${order.id}`;

        return (
            `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png` +
            `?amount=${amount}` +
            `&addInfo=${encodeURIComponent(addInfo)}`
        );
    };

    const filteredOrders = useMemo(() => {
        if (activeTab === "all") return orders;

        if (activeTab === "payment") {
            return orders.filter(order =>
                order.status === "PendingPayment" ||
                order.paymentStatus !== "Paid"
            );
        }

        if (activeTab === "confirmed") {
            return orders.filter(order =>
                order.status === "Confirmed"
            );
        }

        if (activeTab === "shipping") {
            return orders.filter(order =>
                order.status === "Shipping"
            );
        }

        if (activeTab === "completed") {
            return orders.filter(order =>
                order.status === "Completed"
            );
        }

        if (activeTab === "cancelled") {
            return orders.filter(order =>
                order.status === "Cancelled"
            );
        }

        if (activeTab === "refund") {
            return orders.filter(order =>
                order.status === "Refund"
            );
        }

        return orders;
    }, [orders, activeTab]);

    const getStatusText = (status) => {
        if (status === "PendingPayment") return "Chờ thanh toán";
        if (status === "Pending") return "Chờ xác nhận";
        if (status === "Confirmed") return "Đã xác nhận";
        if (status === "Shipping") return "Đang giao hàng";
        if (status === "Completed") return "Đã hoàn thành";
        if (status === "Cancelled") return "Đã hủy";
        if (status === "Refund") return "Hoàn tiền trả lại";

        return status;
    };

    const getPaymentText = (paymentStatus) => {
        return paymentStatus === "Paid"
            ? "Đã thanh toán"
            : "Chưa thanh toán";
    };

    const getImageSrc = (imageUrl) => {
        if (!imageUrl) return "/no-image.png";

        if (imageUrl.startsWith("http")) {
            return imageUrl;
        }

        return `https://localhost:7019/images/${imageUrl}`;
    };

    return (
        <div
            style={{
                background: "#f5f5f5",
                minHeight: "100vh",
                padding: "24px 0"
            }}
        >
            <div className="container">
                <h2 className="fw-bold mb-4">
                    Đơn mua
                </h2>

                <div className="card border-0 shadow-sm rounded-0 mb-3">
                    <div className="p-3">
                        <label className="form-label fw-bold">
                            Nhập số điện thoại đã đặt hàng
                        </label>

                        <div className="d-flex gap-2">
                            <input
                                className="form-control"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="VD: 0327991146"
                            />

                            <button
                                className="btn btn-danger px-4"
                                onClick={searchOrders}
                            >
                                Tìm
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className="bg-white mb-3"
                    style={{
                        display: "flex",
                        overflowX: "auto",
                        borderBottom: "1px solid #eee"
                    }}
                >
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            style={{
                                flex: "1",
                                minWidth: "140px",
                                padding: "16px 12px",
                                border: "none",
                                background: "#fff",
                                color:
                                    activeTab === tab.key
                                        ? "#ee4d2d"
                                        : "#222",
                                fontWeight:
                                    activeTab === tab.key
                                        ? "600"
                                        : "400",
                                borderBottom:
                                    activeTab === tab.key
                                        ? "2px solid #ee4d2d"
                                        : "2px solid transparent"
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {filteredOrders.length === 0 ? (
                    <div className="bg-white text-center py-5 text-muted">
                        Không có đơn hàng trong mục này
                    </div>
                ) : (
                    filteredOrders.map(order => (
                        <div
                            key={order.id}
                            className="bg-white mb-3"
                            style={{
                                border: "1px solid #eee"
                            }}
                        >
                            <div
                                className="d-flex justify-content-between align-items-center px-4 py-3"
                                style={{
                                    borderBottom: "1px solid #eee"
                                }}
                            >
                                <div>
                                    <span className="fw-bold">
                                        Mã đơn: DH{order.id}
                                    </span>

                                    <span className="text-muted ms-3">
                                        {new Date(order.createdAt).toLocaleString()}
                                    </span>
                                </div>

                                <div
                                    className="fw-bold"
                                    style={{
                                        color: "#ee4d2d"
                                    }}
                                >
                                    {getStatusText(order.status)}
                                </div>
                            </div>

                            <div
                                className="px-4 py-3"
                                style={{
                                    borderBottom: "1px solid #eee"
                                }}
                            >
                                <div className="mb-1">
                                    <strong>Người nhận:</strong>{" "}
                                    {order.customerName}
                                </div>

                                <div className="mb-1">
                                    <strong>SĐT:</strong>{" "}
                                    {order.phone}
                                </div>

                                <div className="mb-1">
                                    <strong>Địa chỉ:</strong>{" "}
                                    {order.address}
                                </div>

                                <div>
                                    <strong>Thanh toán:</strong>{" "}
                                    {order.paymentMethod} -{" "}
                                    {getPaymentText(order.paymentStatus)}
                                </div>
                            </div>

                            {order.orderDetails?.map(item => (
                                <div
                                    key={item.id}
                                    className="d-flex align-items-center px-4 py-3"
                                    style={{
                                        borderBottom: "1px solid #eee"
                                    }}
                                >
                                    <img
                                        src={getImageSrc(item.product?.imageUrl)}
                                        alt={item.product?.name}
                                        style={{
                                            width: "86px",
                                            height: "86px",
                                            objectFit: "cover",
                                            border: "1px solid #eee"
                                        }}
                                        onError={(e) => {
                                            e.currentTarget.src = "/no-image.png";
                                        }}
                                    />

                                    <div className="ms-3 flex-grow-1">
                                        <div className="fw-semibold mb-1">
                                            {item.product?.name}
                                        </div>

                                        <div className="text-muted">
                                            x{item.quantity}
                                        </div>
                                    </div>

                                    <div
                                        className="fw-bold"
                                        style={{
                                            color: "#ee4d2d"
                                        }}
                                    >
                                        {(item.price * item.quantity).toLocaleString()}đ
                                    </div>
                                </div>
                            ))}

                            <div className="px-4 py-3">
                                <div className="d-flex justify-content-end align-items-center mb-3">
                                    <span className="me-2">
                                        Thành tiền:
                                    </span>

                                    <span
                                        className="fw-bold"
                                        style={{
                                            color: "#ee4d2d",
                                            fontSize: "22px"
                                        }}
                                    >
                                        {order.totalAmount?.toLocaleString()}đ
                                    </span>
                                </div>

                                <div className="d-flex justify-content-end gap-2">
                                    {order.status === "PendingPayment" && (
                                        <button
                                            className="btn btn-outline-danger"
                                            onClick={() => setPaymentOrder(order)}
                                        >
                                            Thanh toán ngay
                                        </button>
                                    )}

                                    {order.status === "Shipping" && (
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => completeOrder(order.id)}
                                        >
                                            Đã nhận được hàng
                                        </button>
                                    )}

                                    {order.status === "Completed" && (
                                        <>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() =>
                                                    handleReviewProduct(
                                                        order.orderDetails?.[0]?.productId
                                                    )
                                                }
                                            >
                                                Đánh giá
                                            </button>

                                            <button
                                                className="btn btn-outline-danger"
                                                onClick={() => handleBuyAgain(order)}
                                            >
                                                Mua lại
                                            </button>
                                        </>
                                    )}

                                    {order.status === "Cancelled" && (
                                        <button
                                            className="btn btn-outline-danger"
                                            onClick={() => handleBuyAgain(order)}
                                        >
                                            Mua lại
                                        </button>
                                    )}

                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={() => setDetailOrder(order)}
                                    >
                                        Xem chi tiết
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {paymentOrder && (
                <div
                    className="modal d-block"
                    style={{
                        background: "rgba(0,0,0,0.45)"
                    }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content rounded-4">
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">
                                    Thanh toán đơn DH{paymentOrder.id}
                                </h5>

                                <button
                                    className="btn-close"
                                    onClick={() => setPaymentOrder(null)}
                                />
                            </div>

                            <div className="modal-body text-center">
                                <img
                                    src={getQrUrl(paymentOrder)}
                                    alt="QR thanh toán MB Bank"
                                    style={{
                                        width: "300px",
                                        maxWidth: "100%"
                                    }}
                                />

                                <div className="text-start mt-3">
                                    <p>
                                        <strong>Ngân hàng:</strong> MB Bank
                                    </p>

                                    <p>
                                        <strong>Số tài khoản:</strong>{" "}
                                        0327991146
                                    </p>

                                    <p>
                                        <strong>Số tiền:</strong>{" "}
                                        {paymentOrder.totalAmount?.toLocaleString()}đ
                                    </p>

                                    <p>
                                        <strong>Nội dung:</strong>{" "}
                                        DH{paymentOrder.id}
                                    </p>
                                </div>

                                <small className="text-muted">
                                    Sau khi chuyển khoản, admin sẽ kiểm tra và xác nhận thanh toán.
                                </small>
                            </div>

                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setPaymentOrder(null)}
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {detailOrder && (
                <div
                    className="modal d-block"
                    style={{
                        background: "rgba(0,0,0,0.45)"
                    }}
                >
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content rounded-4">
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">
                                    Chi tiết đơn DH{detailOrder.id}
                                </h5>

                                <button
                                    className="btn-close"
                                    onClick={() => setDetailOrder(null)}
                                />
                            </div>

                            <div className="modal-body">
                                <p>
                                    <strong>Trạng thái:</strong>{" "}
                                    {getStatusText(detailOrder.status)}
                                </p>

                                <p>
                                    <strong>Thanh toán:</strong>{" "}
                                    {detailOrder.paymentMethod} -{" "}
                                    {getPaymentText(detailOrder.paymentStatus)}
                                </p>

                                <p>
                                    <strong>Người nhận:</strong>{" "}
                                    {detailOrder.customerName}
                                </p>

                                <p>
                                    <strong>SĐT:</strong>{" "}
                                    {detailOrder.phone}
                                </p>

                                <p>
                                    <strong>Địa chỉ:</strong>{" "}
                                    {detailOrder.address}
                                </p>

                                <hr />

                                {detailOrder.orderDetails?.map(item => (
                                    <div
                                        key={item.id}
                                        className="d-flex align-items-center mb-3"
                                    >
                                        <img
                                            src={getImageSrc(item.product?.imageUrl)}
                                            alt={item.product?.name}
                                            style={{
                                                width: "70px",
                                                height: "70px",
                                                objectFit: "cover",
                                                border: "1px solid #eee"
                                            }}
                                            onError={(e) => {
                                                e.currentTarget.src = "/no-image.png";
                                            }}
                                        />

                                        <div className="ms-3 flex-grow-1">
                                            <div className="fw-bold">
                                                {item.product?.name}
                                            </div>

                                            <div className="text-muted">
                                                x{item.quantity}
                                            </div>
                                        </div>

                                        <div className="fw-bold text-danger">
                                            {(item.price * item.quantity).toLocaleString()}đ
                                        </div>
                                    </div>
                                ))}

                                <hr />

                                <div className="text-end">
                                    <strong>Thành tiền: </strong>

                                    <span className="fw-bold text-danger fs-4">
                                        {detailOrder.totalAmount?.toLocaleString()}đ
                                    </span>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setDetailOrder(null)}
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyOrdersPage;