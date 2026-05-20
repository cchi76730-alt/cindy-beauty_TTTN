import { useContext, useMemo, useState } from "react";

import { CartContext } from "../context/CartContext";

import { toast } from "react-toastify";

import {
    useNavigate,
    useLocation
} from "react-router-dom";

function CheckoutPage() {

    const navigate = useNavigate();

    const location = useLocation();

    const {
        cartItems,
        clearCart
    } = useContext(CartContext);

    // ================= BUY NOW =================
    const buyNowProduct =
        location.state?.product || null;

    const buyNowQuantity =
        location.state?.quantity || 1;

    const buyNowPrice =
        location.state?.finalPrice ||
        buyNowProduct?.price ||
        0;

    // ================= SELECTED ITEMS FROM CART =================
    const selectedItems =
        location.state?.selectedItems || [];

    // ================= ITEMS =================
    const checkoutItems = useMemo(() => {

        // mua ngay
        if (buyNowProduct) {

            return [
                {
                    ...buyNowProduct,
                    quantity: buyNowQuantity,
                    finalPrice: buyNowPrice
                }
            ];
        }

        // thanh toán sản phẩm được chọn
        if (selectedItems.length > 0) {

            return selectedItems;
        }

        // fallback
        return cartItems;

    }, [
        buyNowProduct,
        buyNowQuantity,
        buyNowPrice,
        selectedItems,
        cartItems
    ]);

    // ================= TOTAL =================
    const totalPrice = checkoutItems.reduce(
        (total, item) =>
            total +
            (
                (item.finalPrice || item.price)
                * item.quantity
            ),
        0
    );

    // ================= FORM =================
    const [formData, setFormData] = useState({

        fullName: "",

        phone: "",

        address: "",

        note: "",

        paymentMethod: "cod"
    });

    // ================= CHANGE =================
    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // ================= ORDER =================
    const handleOrder = () => {

        if (
            !formData.fullName ||
            !formData.phone ||
            !formData.address
        ) {

            toast.error(
                "Vui lòng nhập đầy đủ thông tin!"
            );

            return;
        }

        const currentUser =
            JSON.parse(
                localStorage.getItem("currentUser")
            );

        const order = {

            id: Date.now(),

            userId: currentUser?.id,

            customer: formData,

            items: checkoutItems,

            total: totalPrice,

            status: "pending",

            createdAt: new Date().toISOString()
        };

        // ================= SAVE ORDER =================
        const orders =
            JSON.parse(
                localStorage.getItem("orders")
            ) || [];

        orders.push(order);

        localStorage.setItem(
            "orders",
            JSON.stringify(orders)
        );

        // ================= REMOVE SELECTED ITEMS =================
        if (!buyNowProduct) {

            const remainingCart = cartItems.filter(
                cartItem =>
                    !checkoutItems.some(
                        selected =>
                            selected.id === cartItem.id
                    )
            );

            localStorage.setItem(
                "cartItems",
                JSON.stringify(remainingCart)
            );

            clearCart();
        }

        toast.success(
            "Đặt hàng thành công 🎉"
        );

        setTimeout(() => {

            navigate("/my-orders");

            window.location.reload();

        }, 1500);
    };

    return (

        <div
            className="container py-5"
            style={{
                minHeight: "100vh"
            }}
        >

            <h2
                className="fw-bold mb-4"
                style={{
                    color: "#ff4d8d"
                }}
            >
                Thanh toán đơn hàng
            </h2>

            <div className="row g-4">

                {/* LEFT */}
                <div className="col-lg-7">

                    <div
                        className="card border-0 shadow-sm rounded-4 p-4"
                    >

                        <h4 className="fw-bold mb-4">
                            Thông tin nhận hàng
                        </h4>

                        {/* FULLNAME */}
                        <div className="mb-3">

                            <label className="form-label fw-semibold">
                                Họ và tên
                            </label>

                            <input
                                type="text"
                                className="form-control py-2"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                            />

                        </div>

                        {/* PHONE */}
                        <div className="mb-3">

                            <label className="form-label fw-semibold">
                                Số điện thoại
                            </label>

                            <input
                                type="text"
                                className="form-control py-2"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                            />

                        </div>

                        {/* ADDRESS */}
                        <div className="mb-3">

                            <label className="form-label fw-semibold">
                                Địa chỉ
                            </label>

                            <textarea
                                className="form-control"
                                rows="3"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                            />

                        </div>

                        {/* NOTE */}
                        <div className="mb-4">

                            <label className="form-label fw-semibold">
                                Ghi chú
                            </label>

                            <textarea
                                className="form-control"
                                rows="3"
                                name="note"
                                value={formData.note}
                                onChange={handleChange}
                            />

                        </div>

                        {/* PAYMENT */}
                        <div>

                            <label className="form-label fw-bold mb-3">
                                Hình thức thanh toán
                            </label>

                            <div className="d-flex flex-column gap-3">

                                <div className="form-check">

                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="paymentMethod"
                                        value="cod"
                                        checked={
                                            formData.paymentMethod === "cod"
                                        }
                                        onChange={handleChange}
                                    />

                                    <label className="form-check-label">
                                        Thanh toán khi nhận hàng (COD)
                                    </label>

                                </div>

                                <div className="form-check">

                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="paymentMethod"
                                        value="banking"
                                        checked={
                                            formData.paymentMethod === "banking"
                                        }
                                        onChange={handleChange}
                                    />

                                    <label className="form-check-label">
                                        Chuyển khoản ngân hàng
                                    </label>

                                </div>

                                <div className="form-check">

                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="paymentMethod"
                                        value="momo"
                                        checked={
                                            formData.paymentMethod === "momo"
                                        }
                                        onChange={handleChange}
                                    />

                                    <label className="form-check-label">
                                        Ví MoMo
                                    </label>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                {/* RIGHT */}
                <div className="col-lg-5">

                    <div
                        className="card border-0 shadow-sm rounded-4 p-4"
                    >

                        <h4 className="fw-bold mb-4">
                            Đơn hàng của bạn
                        </h4>

                        {/* PRODUCTS */}
                        {checkoutItems.map(item => (

                            <div
                                key={item.id}
                                className="d-flex align-items-center mb-4"
                            >

                                {/* IMAGE */}
                                <img
                                    src={`http://localhost:5114/images/${item.imageUrl}`}
                                    alt={item.name}
                                    style={{
                                        width: "90px",
                                        height: "90px",
                                        objectFit: "cover",
                                        borderRadius: "14px",
                                        border: "1px solid #eee"
                                    }}
                                />

                                {/* INFO */}
                                <div className="ms-3 flex-grow-1">

                                    <h6 className="fw-bold mb-1">
                                        {item.name}
                                    </h6>

                                    <small className="text-muted">
                                        SL: {item.quantity}
                                    </small>

                                    {/* OLD PRICE */}
                                    {item.finalPrice && (
                                        <div
                                            style={{
                                                textDecoration:
                                                    "line-through",
                                                color: "#999",
                                                fontSize: "14px"
                                            }}
                                        >
                                            {item.price?.toLocaleString()}đ
                                        </div>
                                    )}

                                </div>

                                {/* PRICE */}
                                <div
                                    className="fw-bold"
                                    style={{
                                        color: "#ff2d55",
                                        fontSize: "18px"
                                    }}
                                >

                                    {(
                                        (item.finalPrice || item.price)
                                        * item.quantity
                                    ).toLocaleString()}đ

                                </div>

                            </div>

                        ))}

                        <hr />

                        {/* TOTAL */}
                        <div
                            className="d-flex justify-content-between align-items-center mb-4"
                        >

                            <h5 className="fw-bold mb-0">
                                Tổng cộng
                            </h5>

                            <h3
                                className="fw-bold mb-0"
                                style={{
                                    color: "#ff2d55"
                                }}
                            >

                                {totalPrice.toLocaleString()}đ

                            </h3>

                        </div>

                        {/* BUTTON */}
                        <button
                            className="btn w-100 py-3 fw-bold rounded-pill"
                            style={{
                                background:
                                    "linear-gradient(135deg,#ff4d8d,#ff8fb1)",
                                color: "#fff",
                                border: "none",
                                fontSize: "17px"
                            }}
                            onClick={handleOrder}
                        >
                            Xác nhận đặt hàng
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default CheckoutPage;