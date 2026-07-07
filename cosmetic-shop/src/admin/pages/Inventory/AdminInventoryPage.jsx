import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
    FaWarehouse,
    FaBoxes,
    FaExclamationTriangle,
    FaTimesCircle,
    FaSearch,
    FaPlus,
    FaMinus
} from "react-icons/fa";

function AdminInventoryPage() {
    const [products, setProducts] = useState([]);
    const [summary, setSummary] = useState({});
    const [logs, setLogs] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [type, setType] = useState("Import");
    const [quantity, setQuantity] = useState(1);
    const [note, setNote] = useState("");

    const API = "https://localhost:7019/api/admin/inventory";
    const IMAGE_BASE = "https://localhost:7019";
    const NO_IMAGE =
        "https://via.placeholder.com/80x80?text=No+Image";

    const token = localStorage.getItem("adminToken");

    const config = {
        headers: token
            ? { Authorization: `Bearer ${token}` }
            : {}
    };

    const getImageUrl = (imageUrl) => {
        if (!imageUrl || imageUrl === "null" || imageUrl === "undefined") {
            return NO_IMAGE;
        }

        if (imageUrl.startsWith("http")) {
            return imageUrl;
        }

        if (imageUrl.startsWith("/images/")) {
            return `${IMAGE_BASE}${imageUrl}`;
        }

        if (imageUrl.startsWith("images/")) {
            return `${IMAGE_BASE}/${imageUrl}`;
        }

        return `${IMAGE_BASE}/images/${imageUrl}`;
    };

    const loadData = async () => {
        try {
            const inv = await axios.get(API, config);

            setSummary(inv.data.summary || inv.data.Summary || {});
            setProducts(inv.data.products || inv.data.Products || []);

            const log = await axios.get(`${API}/logs`, config);

            setLogs(log.data || []);
        } catch (err) {
            console.log("Inventory API error:", err);
            alert(err.response?.data || "Không tải được dữ liệu kho");
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const filteredProducts = useMemo(() => {
        return products.filter((p) => {
            const text = `
                ${p.name || p.Name || ""}
                ${p.categoryName || p.CategoryName || ""}
                ${p.brandName || p.BrandName || ""}
            `.toLowerCase();

            const stockStatus = p.stockStatus || p.StockStatus;

            const matchSearch = text.includes(keyword.toLowerCase());
            const matchStatus =
                statusFilter === "All" || stockStatus === statusFilter;

            return matchSearch && matchStatus;
        });
    }, [products, keyword, statusFilter]);

    const formatMoney = (value) => {
        return Number(value || 0).toLocaleString("vi-VN") + " đ";
    };

    const badge = (status) => {
        if (status === "OutOfStock") {
            return <span className="badge bg-danger">Hết hàng</span>;
        }

        if (status === "LowStock") {
            return <span className="badge bg-warning text-dark">Sắp hết</span>;
        }

        return <span className="badge bg-success">Còn hàng</span>;
    };

    const handleUpdateStock = async () => {
        if (!selectedProduct) {
            alert("Chọn sản phẩm trước");
            return;
        }

        if (quantity <= 0) {
            alert("Số lượng phải lớn hơn 0");
            return;
        }

        const productId = selectedProduct.id || selectedProduct.Id;

        try {
            await axios.put(
                `${API}/products/${productId}/stock`,
                {
                    type,
                    quantity: Number(quantity),
                    note
                },
                config
            );

            alert("Cập nhật kho thành công");

            setSelectedProduct(null);
            setType("Import");
            setQuantity(1);
            setNote("");

            loadData();
        } catch (err) {
            alert(err.response?.data || "Lỗi cập nhật kho");
        }
    };

    return (
        <div>
            <div className="mb-4">
                <h2 className="fw-bold mb-1">Quản lý tồn kho</h2>
                <p className="text-muted mb-0">
                    Theo dõi hàng tồn, nhập kho, xuất kho và lịch sử kho.
                </p>
            </div>

            <div className="row g-4 mb-4">
                <SummaryCard
                    icon={<FaWarehouse />}
                    title="Tổng sản phẩm"
                    value={summary.totalProducts || summary.TotalProducts || 0}
                />

                <SummaryCard
                    icon={<FaBoxes />}
                    title="Tổng tồn kho"
                    value={summary.totalStock || summary.TotalStock || 0}
                />

                <SummaryCard
                    icon={<FaExclamationTriangle />}
                    title="Sắp hết hàng"
                    value={summary.lowStock || summary.LowStock || 0}
                />

                <SummaryCard
                    icon={<FaTimesCircle />}
                    title="Hết hàng"
                    value={summary.outOfStock || summary.OutOfStock || 0}
                />
            </div>

            <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-5">
                            <label className="form-label fw-semibold">
                                <FaSearch /> Tìm kiếm
                            </label>
                            <input
                                className="form-control"
                                placeholder="Tên sản phẩm, danh mục, thương hiệu..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label fw-semibold">
                                Trạng thái
                            </label>
                            <select
                                className="form-select"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="All">Tất cả</option>
                                <option value="InStock">Còn hàng</option>
                                <option value="LowStock">Sắp hết</option>
                                <option value="OutOfStock">Hết hàng</option>
                            </select>
                        </div>

                        <div className="col-md-4">
                            <div className="bg-light rounded-4 p-3">
                                <div className="text-muted">Tổng giá trị kho</div>
                                <h5 className="fw-bold mb-0">
                                    {formatMoney(
                                        summary.totalInventoryValue ||
                                        summary.TotalInventoryValue
                                    )}
                                </h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-body">
                    <h5 className="fw-bold mb-3">
                        Danh sách sản phẩm trong kho
                    </h5>

                    <div className="table-responsive">
                        <table className="table align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>Sản phẩm</th>
                                    <th>Danh mục</th>
                                    <th>Thương hiệu</th>
                                    <th>Giá</th>
                                    <th>Tồn</th>
                                    <th>Trạng thái</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredProducts.map((p) => {
                                    const id = p.id || p.Id;
                                    const name = p.name || p.Name;
                                    const imageUrl = p.imageUrl || p.ImageUrl;
                                    const categoryName =
                                        p.categoryName || p.CategoryName;
                                    const brandName =
                                        p.brandName || p.BrandName;
                                    const price = p.price || p.Price;
                                    const stock = p.stock ?? p.Stock;
                                    const stockStatus =
                                        p.stockStatus || p.StockStatus;

                                    return (
                                        <tr key={id}>
                                            <td>
                                                <div className="d-flex align-items-center gap-3">
                                                    <img
                                                        src={getImageUrl(imageUrl)}
                                                        alt={name}
                                                        onError={(e) => {
                                                            e.currentTarget.onerror = null;
                                                            e.currentTarget.src = NO_IMAGE;
                                                        }}
                                                        style={{
                                                            width: 55,
                                                            height: 55,
                                                            objectFit: "cover",
                                                            borderRadius: 12,
                                                            background: "#f1f1f1"
                                                        }}
                                                    />

                                                    <div className="fw-semibold">
                                                        {name}
                                                    </div>
                                                </div>
                                            </td>

                                            <td>{categoryName || "Không có"}</td>
                                            <td>{brandName || "Không có"}</td>
                                            <td>{formatMoney(price)}</td>
                                            <td className="fw-bold">{stock}</td>
                                            <td>{badge(stockStatus)}</td>

                                            <td>
                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() => setSelectedProduct(p)}
                                                >
                                                    Cập nhật kho
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {selectedProduct && (
                <div className="card border-0 shadow-sm rounded-4 mb-4">
                    <div className="card-body">
                        <h5 className="fw-bold mb-3">
                            Cập nhật kho:{" "}
                            {selectedProduct.name || selectedProduct.Name}
                        </h5>

                        <div className="row g-3">
                            <div className="col-md-3">
                                <label className="form-label">Loại</label>
                                <select
                                    className="form-select"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                >
                                    <option value="Import">Nhập kho</option>
                                    <option value="Export">Xuất kho</option>
                                </select>
                            </div>

                            <div className="col-md-3">
                                <label className="form-label">Số lượng</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                />
                            </div>

                            <div className="col-md-4">
                                <label className="form-label">Ghi chú</label>
                                <input
                                    className="form-control"
                                    placeholder="VD: nhập hàng mới, hủy hàng lỗi..."
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                />
                            </div>

                            <div className="col-md-2 d-flex align-items-end">
                                <button
                                    className={
                                        type === "Import"
                                            ? "btn btn-success w-100"
                                            : "btn btn-danger w-100"
                                    }
                                    onClick={handleUpdateStock}
                                >
                                    {type === "Import" ? <FaPlus /> : <FaMinus />} Lưu
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body">
                    <h5 className="fw-bold mb-3">
                        Lịch sử nhập / xuất kho
                    </h5>

                    <div className="table-responsive">
                        <table className="table align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>Sản phẩm</th>
                                    <th>Loại</th>
                                    <th>Số lượng</th>
                                    <th>Ghi chú</th>
                                    <th>Thời gian</th>
                                </tr>
                            </thead>

                            <tbody>
                                {logs.map((log) => (
                                    <tr key={log.id || log.Id}>
                                        <td>
                                            {log.productName ||
                                                log.ProductName ||
                                                "Không rõ"}
                                        </td>

                                        <td>
                                            {(log.type || log.Type) === "Import" ? (
                                                <span className="badge bg-success">
                                                    Nhập kho
                                                </span>
                                            ) : (
                                                <span className="badge bg-danger">
                                                    Xuất kho
                                                </span>
                                            )}
                                        </td>

                                        <td className="fw-bold">
                                            {log.quantity || log.Quantity}
                                        </td>

                                        <td>
                                            {log.note ||
                                                log.Note ||
                                                "Không có"}
                                        </td>

                                        <td>
                                            {new Date(
                                                log.createdAt || log.CreatedAt
                                            ).toLocaleString("vi-VN")}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    );
}

function SummaryCard({ icon, title, value }) {
    return (
        <div className="col-md-3">
            <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body">
                    <div className="fs-3 text-primary mb-2">
                        {icon}
                    </div>

                    <div className="text-muted">
                        {title}
                    </div>

                    <h4 className="fw-bold mb-0">
                        {value}
                    </h4>
                </div>
            </div>
        </div>
    );
}

export default AdminInventoryPage;