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

    const buyNowProduct = location.state?.product || null;
    const buyNowQuantity = location.state?.quantity || 1;

    const buyNowPrice =
        location.state?.finalPrice ||
        buyNowProduct?.finalPrice ||
        buyNowProduct?.price ||
        0;

    const selectedItems = location.state?.selectedItems || [];

    const checkoutItems = useMemo(() => {
        if (buyNowProduct) {
            return [
                {
                    ...buyNowProduct,
                    quantity: buyNowQuantity,
                    finalPrice: buyNowPrice
                }
            ];
        }

        if (selectedItems.length > 0) {
            return selectedItems;
        }

        return cartItems;
    }, [
        buyNowProduct,
        buyNowQuantity,
        buyNowPrice,
        selectedItems,
        cartItems
    ]);

    const totalPrice = checkoutItems.reduce(
        (total, item) =>
            total +
            ((item.finalPrice || item.price) * item.quantity),
        0
    );

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        email: "",
        province: "",
        district: "",
        ward: "",
        detailAddress: "",
        note: "",
        paymentMethod: "COD"
    });

    const [createdOrder, setCreatedOrder] = useState(null);

    const provinces = [
        "TP. Hồ Chí Minh",
        "Hà Nội",
        "Đà Nẵng",
        "Đồng Nai",
        "Bình Dương",
        "Cần Thơ",
        "Hải Phòng",
        "Khánh Hòa",
        "Lâm Đồng",
        "Bà Rịa - Vũng Tàu"
    ];

    const districtsByProvince = {
        "TP. Hồ Chí Minh": [
            "Quận 1",
            "Quận 3",
            "Quận 5",
            "Quận 7",
            "Quận 10",
            "Bình Thạnh",
            "Gò Vấp",
            "Tân Bình",
            "Thủ Đức"
        ],
        "Hà Nội": [
            "Ba Đình",
            "Hoàn Kiếm",
            "Đống Đa",
            "Cầu Giấy",
            "Thanh Xuân",
            "Hai Bà Trưng",
            "Nam Từ Liêm"
        ],
        "Đà Nẵng": [
            "Hải Châu",
            "Thanh Khê",
            "Sơn Trà",
            "Ngũ Hành Sơn",
            "Liên Chiểu"
        ],
        "Đồng Nai": [
            "Biên Hòa",
            "Long Khánh",
            "Trảng Bom",
            "Long Thành",
            "Nhơn Trạch",
            "Vĩnh Cửu"
        ],
        "Bình Dương": [
            "Thủ Dầu Một",
            "Dĩ An",
            "Thuận An",
            "Bến Cát",
            "Tân Uyên"
        ],
        "Cần Thơ": [
            "Ninh Kiều",
            "Bình Thủy",
            "Cái Răng",
            "Ô Môn",
            "Thốt Nốt"
        ],
        "Hải Phòng": [
            "Hồng Bàng",
            "Ngô Quyền",
            "Lê Chân",
            "Hải An",
            "Kiến An"
        ],
        "Khánh Hòa": [
            "Nha Trang",
            "Cam Ranh",
            "Ninh Hòa",
            "Diên Khánh"
        ],
        "Lâm Đồng": [
            "Đà Lạt",
            "Bảo Lộc",
            "Đức Trọng",
            "Di Linh"
        ],
        "Bà Rịa - Vũng Tàu": [
            "Vũng Tàu",
            "Bà Rịa",
            "Phú Mỹ",
            "Long Điền",
            "Xuyên Mộc"
        ]
    };

    const wardsByDistrict = {
        "Quận 1": [
            "Bến Nghé",
            "Bến Thành",
            "Cầu Kho",
            "Cầu Ông Lãnh",
            "Nguyễn Cư Trinh"
        ],
        "Quận 3": [
            "Phường 1",
            "Phường 2",
            "Phường 3",
            "Phường 4",
            "Phường 5"
        ],
        "Biên Hòa": [
            "Tân Phong",
            "Tân Hiệp",
            "Trảng Dài",
            "Long Bình",
            "Bửu Long",
            "Hố Nai"
        ],
        "Long Khánh": [
            "Xuân An",
            "Xuân Bình",
            "Xuân Hòa",
            "Bảo Vinh"
        ],
        "Thủ Dầu Một": [
            "Phú Cường",
            "Hiệp Thành",
            "Chánh Nghĩa",
            "Phú Hòa"
        ],
        "Ninh Kiều": [
            "An Cư",
            "An Hòa",
            "Cái Khế",
            "Tân An"
        ],
        "Đà Lạt": [
            "Phường 1",
            "Phường 2",
            "Phường 3",
            "Phường 4",
            "Phường 5"
        ]
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "province") {
            setFormData({
                ...formData,
                province: value,
                district: "",
                ward: ""
            });
            return;
        }

        if (name === "district") {
            setFormData({
                ...formData,
                district: value,
                ward: ""
            });
            return;
        }

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const getImageSrc = (imageUrl) => {
        if (!imageUrl) return "/no-image.png";

        if (imageUrl.startsWith("http")) {
            return imageUrl;
        }

        return `https://localhost:7019/images/${imageUrl}`;
    };

    const getFullAddress = () => {
        return `${formData.detailAddress}, ${formData.ward}, ${formData.district}, ${formData.province}`;
    };

    const getTransferContent = () => {
        if (!createdOrder) return "";

        return (
            createdOrder.transferContent ||
            `DH${createdOrder.id}`
        );
    };

    const getQrUrl = () => {
        if (!createdOrder) return "";

        const bankId = "MB";
        const accountNo = "0327991146";

        // SỬA ĐÚNG TÊN CHỦ TÀI KHOẢN MB BANK CỦA MÀY
        const accountName = "TO THI MAI CHI";

        const amount = Math.floor(
            Number(createdOrder.totalAmount || totalPrice)
        );

        const addInfo = getTransferContent();

        return (
            `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png` +
            `?amount=${amount}` +
            `&addInfo=${encodeURIComponent(addInfo)}` +
            `&accountName=${encodeURIComponent(accountName)}`
        );
    };

    const handleOrder = async () => {
        if (
            !formData.fullName ||
            !formData.phone ||
            !formData.province ||
            !formData.district ||
            !formData.ward ||
            !formData.detailAddress
        ) {
            toast.error("Vui lòng nhập đầy đủ thông tin nhận hàng!");
            return;
        }

        if (checkoutItems.length === 0) {
            toast.error("Không có sản phẩm để thanh toán!");
            return;
        }

        const payload = {
            customerName: formData.fullName,
            phone: formData.phone,
            address: getFullAddress(),
            email: formData.email,
            note: formData.note,
            paymentMethod: formData.paymentMethod,
            items: checkoutItems.map(item => ({
                productId: item.id,
                quantity: item.quantity,
                price: item.finalPrice || item.price
            }))
        };

        try {
            const response = await fetch(
                "https://localhost:7019/api/orders",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                }
            );

            if (!response.ok) {
                const text = await response.text();
                console.log(text);
                toast.error(text || "Không thể tạo đơn hàng");
                return;
            }

            const order = await response.json();
            setCreatedOrder(order);

            if (formData.paymentMethod === "COD") {
                clearCart();
                toast.success("Đặt hàng COD thành công!");
                navigate("/my-orders");
            } else {
                toast.success("Đơn hàng đã tạo, vui lòng quét QR thanh toán");
            }
        } catch (error) {
            console.log(error);
            toast.error("Lỗi kết nối API!");
        }
    };

    const handleFinishBanking = () => {
        clearCart();
        toast.success("Đơn hàng đang chờ admin xác nhận thanh toán!");
        navigate("/my-orders");
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
                <div className="col-lg-7">
                    <div className="card border-0 shadow-sm rounded-4 p-4">
                        <h4 className="fw-bold mb-4">
                            Địa chỉ nhận hàng
                        </h4>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-semibold">
                                    Họ và tên
                                </label>

                                <input
                                    type="text"
                                    className="form-control py-2"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Nhập họ tên người nhận"
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-semibold">
                                    Số điện thoại
                                </label>

                                <input
                                    type="text"
                                    className="form-control py-2"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Nhập số điện thoại"
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold">
                                Email
                            </label>

                            <input
                                type="email"
                                className="form-control py-2"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email không bắt buộc"
                            />
                        </div>

                        <div className="p-3 mb-3 rounded-4 border bg-light">
                            <div className="fw-bold mb-3">
                                Địa Chỉ Giao Hàng Chi Tiết
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold">
                                    Tỉnh / Thành phố
                                </label>

                                <select
                                    className="form-select py-2"
                                    name="province"
                                    value={formData.province}
                                    onChange={handleChange}
                                >
                                    <option value="">
                                        Chọn Tỉnh / Thành phố
                                    </option>

                                    {provinces.map(province => (
                                        <option
                                            key={province}
                                            value={province}
                                        >
                                            {province}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold">
                                    Quận / Huyện
                                </label>

                                <select
                                    className="form-select py-2"
                                    name="district"
                                    value={formData.district}
                                    onChange={handleChange}
                                    disabled={!formData.province}
                                >
                                    <option value="">
                                        Chọn Quận / Huyện
                                    </option>

                                    {(districtsByProvince[formData.province] || [])
                                        .map(district => (
                                            <option
                                                key={district}
                                                value={district}
                                            >
                                                {district}
                                            </option>
                                        ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold">
                                    Phường / Xã
                                </label>

                                <select
                                    className="form-select py-2"
                                    name="ward"
                                    value={formData.ward}
                                    onChange={handleChange}
                                    disabled={!formData.district}
                                >
                                    <option value="">
                                        Chọn Phường / Xã
                                    </option>

                                    {(wardsByDistrict[formData.district] || [
                                        "Phường/Xã 1",
                                        "Phường/Xã 2",
                                        "Phường/Xã 3",
                                        "Phường/Xã 4",
                                        "Phường/Xã 5"
                                    ]).map(ward => (
                                        <option
                                            key={ward}
                                            value={ward}
                                        >
                                            {ward}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-0">
                                <label className="form-label fw-semibold">
                                    Địa chỉ cụ thể
                                </label>

                                <textarea
                                    className="form-control"
                                    rows="2"
                                    name="detailAddress"
                                    value={formData.detailAddress}
                                    onChange={handleChange}
                                    placeholder="Số nhà, tên đường, tòa nhà, phòng..."
                                />
                            </div>
                        </div>

                        {formData.province &&
                            formData.district &&
                            formData.ward &&
                            formData.detailAddress && (
                                <div className="alert alert-danger rounded-4">
                                    <div className="fw-bold mb-1">
                                        Địa chỉ nhận hàng
                                    </div>

                                    <div>
                                        {getFullAddress()}
                                    </div>
                                </div>
                            )}

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
                                placeholder="Ghi chú cho shop hoặc đơn vị vận chuyển"
                            />
                        </div>

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
                                        value="COD"
                                        checked={formData.paymentMethod === "COD"}
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
                                        value="Banking"
                                        checked={formData.paymentMethod === "Banking"}
                                        onChange={handleChange}
                                    />

                                    <label className="form-check-label">
                                        Chuyển khoản ngân hàng MB Bank
                                    </label>
                                </div>
                            </div>
                        </div>

                        {createdOrder &&
                            createdOrder.paymentMethod === "Banking" && (
                                <div className="mt-4 p-4 border rounded-4 text-center">
                                    <h5 className="fw-bold text-danger">
                                        Quét QR để thanh toán
                                    </h5>

                                    <img
                                        src={getQrUrl()}
                                        alt="QR thanh toán MB Bank"
                                        style={{
                                            width: "300px",
                                            maxWidth: "100%"
                                        }}
                                    />

                                    <div className="mt-3 text-start">
                                        <p>
                                            <strong>Ngân hàng:</strong> MB Bank
                                        </p>

                                        <p>
                                            <strong>Số tài khoản:</strong>{" "}
                                            0327991146
                                        </p>

                                        <p>
                                            <strong>Chủ tài khoản:</strong>{" "}
                                            TEN CHU TAI KHOAN
                                        </p>

                                        <p>
                                            <strong>Số tiền:</strong>{" "}
                                            {createdOrder.totalAmount.toLocaleString()}đ
                                        </p>

                                        <p>
                                            <strong>Nội dung:</strong>{" "}
                                            {getTransferContent()}
                                        </p>
                                    </div>

                                    <button
                                        className="btn btn-success w-100 fw-bold mt-3"
                                        onClick={handleFinishBanking}
                                    >
                                        Tôi đã chuyển khoản
                                    </button>

                                    <small className="text-muted d-block mt-2">
                                        Đơn hàng sẽ được admin xác nhận sau khi kiểm tra giao dịch.
                                    </small>
                                </div>
                            )}
                    </div>
                </div>

                <div className="col-lg-5">
                    <div className="card border-0 shadow-sm rounded-4 p-4">
                        <h4 className="fw-bold mb-4">
                            Đơn hàng của bạn
                        </h4>

                        {checkoutItems.map(item => (
                            <div
                                key={item.id}
                                className="d-flex align-items-center mb-4"
                            >
                                <img
                                    src={getImageSrc(item.imageUrl)}
                                    alt={item.name}
                                    style={{
                                        width: "90px",
                                        height: "90px",
                                        objectFit: "cover",
                                        borderRadius: "14px",
                                        border: "1px solid #eee"
                                    }}
                                    onError={(e) => {
                                        e.currentTarget.src = "/no-image.png";
                                    }}
                                />

                                <div className="ms-3 flex-grow-1">
                                    <h6 className="fw-bold mb-1">
                                        {item.name}
                                    </h6>

                                    <small className="text-muted">
                                        SL: {item.quantity}
                                    </small>

                                    {item.finalPrice && (
                                        <div
                                            style={{
                                                textDecoration: "line-through",
                                                color: "#999",
                                                fontSize: "14px"
                                            }}
                                        >
                                            {item.price?.toLocaleString()}đ
                                        </div>
                                    )}
                                </div>

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

                        <div className="d-flex justify-content-between align-items-center mb-4">
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
                            disabled={createdOrder !== null}
                        >
                            {createdOrder
                                ? "Đơn hàng đã được tạo"
                                : "Xác nhận đặt hàng"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CheckoutPage;