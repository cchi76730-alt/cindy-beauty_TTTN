import { useContext, useState, useEffect } from "react";

import { CartContext } from "../context/CartContext";

import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";

function CartPage() {

    const navigate = useNavigate();

    const {
        cartItems,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart
    } = useContext(CartContext);

    // ================= SELECTED ITEMS =================
    const [selectedItems, setSelectedItems] = useState([]);

    // mặc định chọn tất cả khi vào giỏ hàng
    useEffect(() => {

        setSelectedItems(cartItems.map(item => item.id));

    }, [cartItems]);

    // ================= CHECK ALL =================
    const isAllSelected =
        cartItems.length > 0 &&
        selectedItems.length === cartItems.length;

    const handleSelectAll = () => {

        if (isAllSelected) {

            setSelectedItems([]);

        } else {

            setSelectedItems(cartItems.map(item => item.id));
        }
    };

    // ================= CHECK ONE =================
    const handleSelectItem = (id) => {

        if (selectedItems.includes(id)) {

            setSelectedItems(
                selectedItems.filter(itemId => itemId !== id)
            );

        } else {

            setSelectedItems([...selectedItems, id]);
        }
    };

    // ================= TOTAL PRICE =================
    const selectedCartItems = cartItems.filter(item =>
        selectedItems.includes(item.id)
    );

    const totalPrice = selectedCartItems.reduce(
        (total, item) =>
            total + item.price * item.quantity,
        0
    );

    // ================= CHECKOUT =================
    const handleCheckout = () => {

        if (selectedCartItems.length === 0) {

            toast.error("Vui lòng chọn sản phẩm!");

            return;
        }

        navigate("/checkout", {
            state: {
                selectedItems: selectedCartItems
            }
        });
    };

    return (

        <div
            className="container py-4"
            style={{
                paddingBottom: "140px"
            }}
        >

            {/* TITLE */}
            <div className="d-flex justify-content-between align-items-center mb-4">

                <h2 className="fw-bold mb-0">
                    Giỏ hàng của bạn
                </h2>

                <span className="badge bg-dark fs-6 px-3 py-2">

                    {cartItems.length} sản phẩm

                </span>

            </div>

            {/* EMPTY */}
            {cartItems.length === 0 ? (

                <div className="text-center mt-5">

                    <img
                        src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
                        alt=""
                        style={{
                            width: "180px",
                            opacity: 0.7
                        }}
                    />

                    <h4 className="mt-4 text-muted">
                        Giỏ hàng đang trống
                    </h4>

                </div>

            ) : (

                <>

                    {/* SELECT ALL */}
                    <div className="card border-0 shadow-sm rounded-4 p-3 mb-4">

                        <div className="d-flex align-items-center gap-3">

                            <input
                                type="checkbox"
                                checked={isAllSelected}
                                onChange={handleSelectAll}
                                style={{
                                    width: "20px",
                                    height: "20px",
                                    cursor: "pointer"
                                }}
                            />

                            <span className="fw-bold">

                                Chọn tất cả sản phẩm

                            </span>

                        </div>

                    </div>

                    {/* LIST PRODUCT */}
                    {cartItems.map(item => (

                        <div
                            key={item.id}
                            className="card border-0 shadow-sm rounded-4 mb-4 p-3"
                        >

                            <div className="row align-items-center">

                                {/* CHECKBOX */}
                                <div className="col-md-1 text-center">

                                    <input
                                        type="checkbox"
                                        checked={selectedItems.includes(item.id)}
                                        onChange={() => handleSelectItem(item.id)}
                                        style={{
                                            width: "22px",
                                            height: "22px",
                                            cursor: "pointer"
                                        }}
                                    />

                                </div>

                                {/* IMAGE */}
                                <div className="col-md-2 text-center">

                                    <img
                                        src={`http://localhost:5114/images/${item.imageUrl}`}
                                        alt={item.name}
                                        style={{
                                            width: "110px",
                                            height: "110px",
                                            objectFit: "cover",
                                            borderRadius: "15px"
                                        }}
                                    />

                                </div>

                                {/* INFO */}
                                <div className="col-md-3">

                                    <h5 className="fw-bold mb-2">
                                        {item.name}
                                    </h5>

                                    <p className="text-muted mb-1">
                                        Giá sản phẩm
                                    </p>

                                    <h5 className="text-danger fw-bold">

                                        {item.price.toLocaleString()} VNĐ

                                    </h5>

                                </div>

                                {/* QUANTITY */}
                                <div className="col-md-3">

                                    <div className="d-flex justify-content-center align-items-center gap-3">

                                        <button
                                            className="btn btn-outline-secondary rounded-circle"
                                            style={{
                                                width: "40px",
                                                height: "40px"
                                            }}
                                            onClick={() => decreaseQuantity(item.id)}
                                        >
                                            -
                                        </button>

                                        <span
                                            className="fw-bold fs-5"
                                            style={{
                                                minWidth: "30px",
                                                textAlign: "center"
                                            }}
                                        >
                                            {item.quantity}
                                        </span>

                                        <button
                                            className="btn btn-outline-secondary rounded-circle"
                                            style={{
                                                width: "40px",
                                                height: "40px"
                                            }}
                                            onClick={() => increaseQuantity(item.id)}
                                        >
                                            +
                                        </button>

                                    </div>

                                </div>

                                {/* TOTAL */}
                                <div className="col-md-2 text-center">

                                    <p className="text-muted mb-1">
                                        Thành tiền
                                    </p>

                                    <h5 className="text-success fw-bold">

                                        {(item.price * item.quantity).toLocaleString()} VNĐ

                                    </h5>

                                </div>

                                {/* REMOVE */}
                                <div className="col-md-1 text-end">

                                    <button
                                        className="btn btn-outline-danger rounded-circle"
                                        style={{
                                            width: "45px",
                                            height: "45px"
                                        }}
                                        onClick={() => removeFromCart(item.id)}
                                    >
                                        ✕
                                    </button>

                                </div>

                            </div>

                        </div>

                    ))}

                    {/* FOOTER PAYMENT */}
                    <div
                        className="bg-white border-top shadow-lg position-fixed bottom-0 start-0 end-0 py-3"
                        style={{
                            zIndex: 1000
                        }}
                    >

                        <div className="container d-flex justify-content-between align-items-center">

                            <div>

                                <p className="text-muted mb-1">
                                    Đã chọn {selectedItems.length} sản phẩm
                                </p>

                                <h3 className="text-danger fw-bold mb-0">

                                    {totalPrice.toLocaleString()} VNĐ

                                </h3>

                            </div>

                            <button
                                className="btn btn-danger btn-lg px-5 rounded-pill fw-bold"
                                onClick={handleCheckout}
                            >
                                Thanh toán
                            </button>

                        </div>

                    </div>

                </>

            )}

        </div>
    );
}

export default CartPage;