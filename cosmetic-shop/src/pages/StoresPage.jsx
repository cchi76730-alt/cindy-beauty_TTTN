import { useState } from "react";

function StoresPage() {
    const stores = [
        {
            id: 1,
            name: "Cindybeauty Shop - TP. Hồ Chí Minh",
            address: "Quận 1, TP. Hồ Chí Minh",
            phone: "0901 234 567",
            time: "08:00 - 22:00",
            note: "Chi nhánh trung tâm, nhiều sản phẩm hot nhất.",
        },
        {
            id: 2,
            name: "Cindybeauty Shop - Hà Nội",
            address: "Hoàn Kiếm, Hà Nội",
            phone: "0902 345 678",
            time: "08:00 - 22:00",
            note: "Không gian mua sắm hiện đại, dễ di chuyển.",
        },
        {
            id: 3,
            name: "Cindybeauty Shop - Đà Nẵng",
            address: "Hải Châu, Đà Nẵng",
            phone: "0903 456 789",
            time: "08:00 - 22:00",
            note: "Phục vụ khách hàng khu vực miền Trung.",
        },
        {
            id: 4,
            name: "Cindybeauty Shop - Đồng Nai",
            address: "Biên Hòa, Đồng Nai",
            phone: "0904 567 890",
            time: "08:00 - 22:00",
            note: "Chi nhánh gần khu dân cư, thuận tiện mua sắm.",
        },
    ];

    const [selectedStore, setSelectedStore] = useState(stores[0]);

    const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(
        selectedStore.address
    )}&output=embed`;

    const directionUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        selectedStore.address
    )}`;

    return (
        <div className="container py-5">

            <div
                className="text-center p-5 mb-5"
                style={{
                    borderRadius: "28px",
                    background: "linear-gradient(135deg, #fff1f5, #eef6ff)",
                }}
            >
                <span className="badge bg-dark px-3 py-2 mb-3">
                    Cindybeauty Store
                </span>

                <h2 className="fw-bold display-5 mb-3">
                    Hệ thống cửa hàng
                </h2>

                <p className="text-muted mb-4">
                    Tìm chi nhánh Cindybeauty Shop gần bạn nhất và xem vị trí trực tiếp trên bản đồ.
                </p>

                <div className="row g-3 justify-content-center">
                    <div className="col-md-3">
                        <div className="bg-white shadow-sm rounded-4 p-3">
                            <h4 className="fw-bold mb-0">{stores.length}+</h4>
                            <small className="text-muted">Chi nhánh</small>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="bg-white shadow-sm rounded-4 p-3">
                            <h4 className="fw-bold mb-0">08:00</h4>
                            <small className="text-muted">Mở cửa mỗi ngày</small>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="bg-white shadow-sm rounded-4 p-3">
                            <h4 className="fw-bold mb-0">24/7</h4>
                            <small className="text-muted">Hỗ trợ online</small>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4 mb-5">

                <div className="col-lg-4">
                    <h4 className="fw-bold mb-3">Danh sách chi nhánh</h4>

                    <div
                        className="d-flex flex-column gap-3 pe-2"
                        style={{
                            maxHeight: "560px",
                            overflowY: "auto",
                        }}
                    >
                        {stores.map((store) => (
                            <div
                                key={store.id}
                                onClick={() => setSelectedStore(store)}
                                className="card border-0 shadow-sm p-3"
                                style={{
                                    borderRadius: "20px",
                                    cursor: "pointer",
                                    transition: "0.25s",
                                    background:
                                        selectedStore.id === store.id
                                            ? "linear-gradient(135deg, #ffe6ef, #ffffff)"
                                            : "#fff",
                                    borderLeft:
                                        selectedStore.id === store.id
                                            ? "5px solid #ff6fae"
                                            : "5px solid transparent",
                                }}
                            >
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <h5 className="fw-bold mb-0">
                                        {store.name}
                                    </h5>

                                    {selectedStore.id === store.id && (
                                        <span className="badge bg-danger">
                                            Đang xem
                                        </span>
                                    )}
                                </div>

                                <p className="text-muted mb-2">
                                    📍 {store.address}
                                </p>

                                <p className="mb-2">
                                    ☎ Hotline: {store.phone}
                                </p>

                                <p className="mb-2">
                                    🕒 Giờ mở cửa: {store.time}
                                </p>

                                <small className="text-muted">
                                    {store.note}
                                </small>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="col-lg-8">
                    <div className="mb-3">
                        <h4 className="fw-bold mb-1">
                            {selectedStore.name}
                        </h4>

                        <p className="text-muted mb-0">
                            {selectedStore.address}
                        </p>
                    </div>

                    <div
                        className="shadow-sm mb-3"
                        style={{
                            height: "520px",
                            borderRadius: "28px",
                            overflow: "hidden",
                        }}
                    >
                        <iframe
                            title={selectedStore.name}
                            src={mapUrl}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                        ></iframe>
                    </div>

                    <div className="d-flex gap-3 flex-wrap">
                        <a
                            href={directionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-dark rounded-pill px-4"
                        >
                            Mở chỉ đường
                        </a>

                        <a
                            href={`tel:${selectedStore.phone}`}
                            className="btn btn-outline-dark rounded-pill px-4"
                        >
                            Gọi chi nhánh
                        </a>
                    </div>
                </div>
            </div>

            <div
                className="p-4 p-md-5 shadow-sm"
                style={{
                    borderRadius: "28px",
                    background: "linear-gradient(135deg, #fff1f5, #f8f9fa)",
                }}
            >
                <h3 className="fw-bold mb-4">Thông tin trụ sở chính</h3>

                <div className="row g-4">
                    <div className="col-md-6">
                        <p><strong>Trụ sở:</strong> Cindybeauty Shop</p>
                        <p><strong>Địa chỉ:</strong> Quận 1, TP. Hồ Chí Minh</p>
                        <p><strong>Hotline:</strong> 0901 234 567</p>
                        <p><strong>Email:</strong> cindybeautyshop@gmail.com</p>
                    </div>

                    <div className="col-md-6">
                        <p><strong>Facebook:</strong> Cindybeauty Shop</p>
                        <p><strong>Instagram:</strong> @cindybeautyshop</p>
                        <p><strong>Website:</strong> www.cindybeauty.vn</p>
                        <p><strong>Thời gian hỗ trợ:</strong> 08:00 - 22:00</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StoresPage;