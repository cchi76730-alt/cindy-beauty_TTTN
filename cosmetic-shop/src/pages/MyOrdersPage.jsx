import { useEffect, useState } from "react";

function MyOrdersPage() {

    const [orders, setOrders] = useState([]);
    const [tab, setTab] = useState("active");

    // cancel modal
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [cancelReason, setCancelReason] = useState("");

    // ================= LOAD ORDERS =================
    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = () => {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];

        const userOrders = storedOrders.filter(
            order => order.userId === currentUser?.id
        );

        setOrders(userOrders);
    };

    // ================= STATUS BADGE =================
    const renderStatus = (status) => {
        const base = "px-3 py-2 rounded-pill fw-semibold small";

        switch (status) {
            case "pending":
                return <span className={`bg-warning text-dark ${base}`}>⏳ Chờ xác nhận</span>;

            case "confirmed":
                return <span className={`bg-primary text-white ${base}`}>✅ Đã xác nhận</span>;

            case "shipping":
                return <span className={`bg-info text-white ${base}`}>🚚 Đang giao</span>;

            case "delivered":
                return <span className={`bg-success text-white ${base}`}>📦 Đã giao</span>;

            case "cancelled":
                return <span className={`bg-danger text-white ${base}`}>❌ Đã hủy</span>;

            default:
                return null;
        }
    };

    // ================= OPEN CANCEL MODAL =================
    const openCancelModal = (orderId) => {
        setSelectedOrderId(orderId);
        setCancelReason("");
        setShowCancelModal(true);
    };

    // ================= CANCEL ORDER =================
    const confirmCancel = () => {
        if (!cancelReason.trim()) {
            alert("Vui lòng nhập lý do hủy đơn");
            return;
        }

        const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];

        const updated = storedOrders.map(order => {
            if (order.id === selectedOrderId) {
                return {
                    ...order,
                    status: "cancelled",
                    cancelReason
                };
            }
            return order;
        });

        localStorage.setItem("orders", JSON.stringify(updated));

        setShowCancelModal(false);
        loadOrders();
    };

    // ================= FILTER =================
    const activeOrders = orders.filter(o => o.status !== "cancelled");
    const cancelledOrders = orders.filter(o => o.status === "cancelled");

    const dataToShow = tab === "active" ? activeOrders : cancelledOrders;

    return (
        <div className="container py-5">

            <h2 className="fw-bold mb-4">Đơn hàng của bạn</h2>

            {/* TABS */}
            <div className="mb-4">
                <button
                    className={`btn me-2 ${tab === "active" ? "btn-dark" : "btn-outline-dark"}`}
                    onClick={() => setTab("active")}
                >
                    Đơn hàng
                </button>

                <button
                    className={`btn ${tab === "cancelled" ? "btn-dark" : "btn-outline-dark"}`}
                    onClick={() => setTab("cancelled")}
                >
                    Đơn đã hủy
                </button>
            </div>

            {/* EMPTY */}
            {dataToShow.length === 0 ? (
                <div className="text-center mt-5">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/4555/4555971.png"
                        style={{ width: 160, opacity: 0.6 }}
                    />
                    <h5 className="mt-3 text-muted">Không có đơn hàng</h5>
                </div>
            ) : (
                dataToShow.slice().reverse().map(order => (
                    <div
                        key={order.id}
                        className="card border-0 shadow-sm rounded-4 mb-4"
                    >

                        {/* HEADER */}
                        <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center py-3">

                            <div>
                                <h5 className="fw-bold mb-1">
                                    Đơn #{order.id}
                                </h5>
                                <small className="text-muted">
                                    {new Date(order.createdAt).toLocaleString()}
                                </small>
                            </div>

                            <div className="d-flex align-items-center gap-2">
                                {renderStatus(order.status)}

                                {order.status !== "delivered" &&
                                    order.status !== "cancelled" && (
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => openCancelModal(order.id)}
                                        >
                                            Hủy
                                        </button>
                                    )}
                            </div>

                        </div>

                        {/* BODY */}
                        <div className="card-body">

                            {order.items.map(item => (
                                <div
                                    key={item.id}
                                    className="d-flex align-items-center mb-3"
                                >
                                    <img
                                        src={`http://localhost:5114/images/${item.imageUrl}`}
                                        style={{
                                            width: 80,
                                            height: 80,
                                            objectFit: "cover",
                                            borderRadius: 10
                                        }}
                                    />

                                    <div className="ms-3 flex-grow-1">
                                        <h6 className="mb-1 fw-bold">{item.name}</h6>
                                        <small className="text-muted">
                                            SL: {item.quantity}
                                        </small>
                                    </div>

                                    <div className="fw-bold text-danger">
                                        {(item.price * item.quantity).toLocaleString()}đ
                                    </div>
                                </div>
                            ))}

                            {order.status === "cancelled" && order.cancelReason && (
                                <div className="alert alert-danger mt-2">
                                    <b>Lý do hủy:</b> {order.cancelReason}
                                </div>
                            )}

                            <hr />

                            <div className="d-flex justify-content-between">
                                <div>
                                    <b>{order.customer.fullName}</b><br />
                                    {order.customer.phone}<br />
                                    {order.customer.address}
                                </div>

                                <h4 className="text-danger fw-bold">
                                    {order.total.toLocaleString()}đ
                                </h4>
                            </div>

                        </div>
                    </div>
                ))
            )}

            {/* ================= CANCEL MODAL ================= */}
            {showCancelModal && (
                <div className="position-fixed top-0 start-0 w-100 h-100"
                    style={{
                        background: "rgba(0,0,0,0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 9999
                    }}
                >
                    <div className="bg-white p-4 rounded-4 shadow"
                        style={{ width: 400 }}
                    >
                        <h5 className="fw-bold mb-3">Hủy đơn hàng</h5>

                        <textarea
                            className="form-control mb-3"
                            rows="3"
                            placeholder="Nhập lý do hủy..."
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                        />

                        <div className="d-flex justify-content-end gap-2">
                            <button
                                className="btn btn-outline-secondary"
                                onClick={() => setShowCancelModal(false)}
                            >
                                Đóng
                            </button>

                            <button
                                className="btn btn-danger"
                                onClick={confirmCancel}
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default MyOrdersPage;