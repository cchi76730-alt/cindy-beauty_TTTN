import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function BrandListPage() {
    const [brands, setBrands] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBrands();
    }, []);

    const loadBrands = async () => {
        try {
            const res = await fetch(
                "https://localhost:7019/api/admin/brands"
            );

            if (!res.ok) {
                toast.error("Không tải được thương hiệu");
                return;
            }

            const data = await res.json();
            setBrands(data);
        } catch (err) {
            console.log(err);
            toast.error("Lỗi kết nối API");
        } finally {
            setLoading(false);
        }
    };

    const deleteBrand = async (id) => {
        const confirmDelete = window.confirm(
            "Bạn có chắc muốn xóa thương hiệu này?"
        );

        if (!confirmDelete) return;

        try {
            const res = await fetch(
                `https://localhost:7019/api/admin/brands/${id}`,
                {
                    method: "DELETE"
                }
            );

            if (!res.ok) {
                const text = await res.text();
                toast.error(text || "Không thể xóa thương hiệu");
                return;
            }

            toast.success("Đã xóa thương hiệu");
            loadBrands();
        } catch (err) {
            console.log(err);
            toast.error("Lỗi kết nối API");
        }
    };

    const isValidImageValue = (value) => {
        return (
            value &&
            value !== "null" &&
            value !== "undefined" &&
            value.trim() !== ""
        );
    };

    const getBrandImageValue = (brand) => {
        if (isValidImageValue(brand.thumbnailUrl)) {
            return brand.thumbnailUrl;
        }

        if (isValidImageValue(brand.logoUrl)) {
            return brand.logoUrl;
        }

        if (isValidImageValue(brand.bannerUrl)) {
            return brand.bannerUrl;
        }

        return "";
    };

    const getImageSrc = (brand) => {
        const imageUrl = getBrandImageValue(brand);

        if (!imageUrl) {
            return "/no-image.png";
        }

        if (imageUrl.startsWith("http")) {
            return imageUrl;
        }

        return `https://localhost:7019/images/${imageUrl}`;
    };

    const filteredBrands = brands.filter(brand =>
        brand.name?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-danger" />
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1">
                        Quản lý thương hiệu
                    </h2>

                    <div className="text-muted">
                        Danh sách thương hiệu mỹ phẩm
                    </div>
                </div>

                <Link
                    to="/admin/brands/create"
                    className="btn btn-danger fw-bold"
                >
                    + Thêm thương hiệu
                </Link>
            </div>

            <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-body">
                    <input
                        className="form-control"
                        placeholder="Tìm thương hiệu..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4">
                <div className="table-responsive">
                    <table className="table align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Ảnh</th>
                                <th>Tên thương hiệu</th>
                                <th>Mô tả</th>
                                <th>Quốc gia</th>
                                <th>Ảnh thương hiệu</th>
                                <th>Trạng thái</th>
                                <th className="text-end">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredBrands.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="8"
                                        className="text-center py-5 text-muted"
                                    >
                                        Không có thương hiệu
                                    </td>
                                </tr>
                            ) : (
                                filteredBrands.map(brand => (
                                    <tr key={brand.id}>
                                        <td>{brand.id}</td>

                                        <td>
                                            <img
                                                src={getImageSrc(brand)}
                                                alt={brand.name}
                                                style={{
                                                    width: "70px",
                                                    height: "70px",
                                                    objectFit: "cover",
                                                    borderRadius: "12px",
                                                    border: "1px solid #eee",
                                                    background: "#f5f5f5"
                                                }}
                                                onError={(e) => {
                                                    e.currentTarget.onerror = null;
                                                    e.currentTarget.src = "/no-image.png";
                                                }}
                                            />
                                        </td>

                                        <td className="fw-bold">
                                            {brand.name}
                                        </td>

                                        <td
                                            className="text-muted"
                                            style={{
                                                maxWidth: "260px",
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis"
                                            }}
                                        >
                                            {brand.description || "Chưa có"}
                                        </td>

                                        <td>
                                            {brand.country || "Chưa có"}
                                        </td>

                                        <td
                                            className="text-muted"
                                            style={{
                                                maxWidth: "320px",
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis"
                                            }}
                                        >
                                            {getBrandImageValue(brand) || "Chưa có"}
                                        </td>

                                        <td>
                                            {brand.isActive ? (
                                                <span className="badge bg-success">
                                                    Hoạt động
                                                </span>
                                            ) : (
                                                <span className="badge bg-secondary">
                                                    Ẩn
                                                </span>
                                            )}

                                            {brand.isFeatured && (
                                                <span className="badge bg-danger ms-2">
                                                    Nổi bật
                                                </span>
                                            )}
                                        </td>

                                        <td className="text-end">
                                            <Link
                                                to={`/admin/brands/edit/${brand.id}`}
                                                className="btn btn-sm btn-outline-primary me-2"
                                            >
                                                Sửa
                                            </Link>

                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => deleteBrand(brand.id)}
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default BrandListPage;