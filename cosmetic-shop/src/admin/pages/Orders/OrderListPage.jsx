import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function OrderListPage() {
    const [orders, setOrders] = useState([]);

    const getToken = () => {
        return localStorage.getItem("token");
    };

    const handleAuthError = () => {
        toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
        localStorage.removeItem("token");
        localStorage.removeItem("admin");
        window.location.href = "/admin/auth";
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const token = getToken();

            const res = await fetch(
                "https://localhost:7019/api/admin/orders",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (res.status === 401) {
                handleAuthError();
                return;
            }

            if (res.status === 403) {
                toast.error("Bạn không có quyền xem đơn hàng");
                return;
            }

            if (!res.ok) {
                const text = await res.text();
                toast.error(text || "Không tải được đơn hàng");
                return;
            }

            const data = await res.json();
            setOrders(Array.isArray(data) ? data : []);
        } catch (err) {
            console.log(err);
            toast.error("Lỗi kết nối API");
        }
    };

    const updateStatus = async (id, status) => {
        try {
            const token = getToken();

            const res = await fetch(
                `https://localhost:7019/api/admin/orders/${id}/status`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(status)
                }
            );

            if (res.status === 401) {
                handleAuthError();
                return;
            }

            if (res.status === 403) {
                toast.error("Bạn không có quyền xử lý đơn hàng");
                return;
            }

            if (!res.ok) {
                const text = await res.text();
                toast.error(text || "Cập nhật thất bại");
                return;
            }

            toast.success("Cập nhật đơn hàng thành công");
            loadOrders();
        } catch (err) {
            console.log(err);
            toast.error("Lỗi kết nối API");
        }
    };

    const getStatusText = (status) => {
        if (status === "PendingPayment") return "Chờ thanh toán";
        if (status === "Pending") return "Chờ xác nhận";
        if (status === "Confirmed") return "Đã xác nhận";
        if (status === "Shipping") return "Đang giao hàng";
        if (status === "Completed") return "Hoàn thành";
        if (status === "Cancelled") return "Đã hủy";
        return status;
    };

    const getPaymentText = (paymentStatus) => {
        return paymentStatus === "Paid"
            ? "Đã thanh toán"
            : "Chưa thanh toán";
    };

    const renderActions = (order) => {
        const actions = [];

        if (
            order.paymentMethod === "Banking" &&
            order.paymentStatus !== "Paid" &&
            order.status !== "Cancelled"
        ) {
            actions.push(
                <button
                    key="paid"
                    className="btn btn-success w-100 mb-2"
                    onClick={() => updateStatus(order.id, "Paid")}
                >
                    💳 Thanh toán
                </button>
            );
        }

        if (
            order.status === "Pending" ||
            order.status === "PendingPayment"
        ) {
            actions.push(
                <button
                    key="confirmed"
                    className="btn btn-primary w-100 mb-2"
                    onClick={() => updateStatus(order.id, "Confirmed")}
                >
                    ✔ Xác nhận
                </button>
            );
        }

        if (order.status === "Confirmed") {
            actions.push(
                <button
                    key="shipping"
                    className="btn btn-info text-white w-100 mb-2"
                    onClick={() => updateStatus(order.id, "Shipping")}
                >
                    🚚 Giao hàng
                </button>
            );
        }

        if (order.status === "Shipping") {
            actions.push(
                <button
                    key="completed"
                    className="btn btn-success w-100 mb-2"
                    onClick={() => updateStatus(order.id, "Completed")}
                >
                    ✅ Hoàn thành
                </button>
            );
        }

        if (
            order.status !== "Completed" &&
            order.status !== "Cancelled"
        ) {
            actions.push(
                <button
                    key="cancelled"
                    className="btn btn-danger w-100"
                    onClick={() => updateStatus(order.id, "Cancelled")}
                >
                    ✕ Hủy đơn
                </button>
            );
        }

        if (actions.length === 0) {
            return (
                <span className="text-muted small">
                    Không có thao tác
                </span>
            );
        }

        return actions;
    };

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1">
                        Quản lý đơn hàng
                    </h2>

                    <div className="text-muted">
                        Theo dõi thanh toán, trạng thái và giao hàng
                    </div>
                </div>

                <div className="badge bg-danger fs-6 px-3 py-2">
                    Tổng: {orders.length} đơn
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="card border-0 shadow-sm rounded-4">
                    <div className="card-body text-center py-5 text-muted">
                        Chưa có đơn hàng nào
                    </div>
                </div>
            ) : (
                <div className="d-flex flex-column gap-3">
                    {orders.map(order => (
                        <div
                            key={order.id}
                            className="card border-0 shadow-sm rounded-4"
                        >
                            <div className="card-body p-4">
                                <div className="row g-3 align-items-start">
                                    <div className="col-md-1">
                                        <div className="text-muted small">
                                            Mã đơn
                                        </div>
                                        <div className="fw-bold">
                                            DH{order.id}
                                        </div>
                                    </div>

                                    <div className="col-md-2">
                                        <div className="text-muted small">
                                            Khách hàng
                                        </div>
                                        <div className="fw-bold">
                                            {order.customerName}
                                        </div>
                                        <div className="text-muted small">
                                            {order.phone}
                                        </div>
                                    </div>

                                    <div className="col-md-2">
                                        <div className="text-muted small">
                                            Địa chỉ
                                        </div>
                                        <div>
                                            {order.address}
                                        </div>
                                    </div>

                                    <div className="col-md-1">
                                        <div className="text-muted small">
                                            Tổng tiền
                                        </div>
                                        <div className="fw-bold text-danger">
                                            {order.totalAmount?.toLocaleString()}đ
                                        </div>
                                    </div>

                                    <div className="col-md-1">
                                        <div className="text-muted small">
                                            Thanh toán
                                        </div>
                                        <div className="fw-semibold">
                                            {order.paymentMethod}
                                        </div>
                                        <span className={
                                            order.paymentStatus === "Paid"
                                                ? "badge bg-success"
                                                : "badge bg-warning text-dark"
                                        }>
                                            {getPaymentText(order.paymentStatus)}
                                        </span>
                                    </div>

                                    <div className="col-md-1">
                                        <div className="text-muted small">
                                            Trạng thái
                                        </div>
                                        <span className="badge bg-primary">
                                            {getStatusText(order.status)}
                                        </span>
                                    </div>

                                    <div className="col-md-2">
                                        <div className="text-muted small">
                                            Sản phẩm
                                        </div>

                                        {order.orderDetails?.map(item => (
                                            <div key={item.id}>
                                                {item.product?.name} x {item.quantity}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="col-md-1">
                                        <div className="text-muted small">
                                            Ngày tạo
                                        </div>
                                        <div>
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </div>
                                        <small className="text-muted">
                                            {new Date(order.createdAt).toLocaleTimeString()}
                                        </small>
                                    </div>

                                    <div className="col-md-1">
                                        <div className="text-muted small mb-2">
                                            Thao tác
                                        </div>

                                        {renderActions(order)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default OrderListPage;