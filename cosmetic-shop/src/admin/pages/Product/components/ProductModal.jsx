import { useEffect, useState } from "react";

function ProductModal({
    show,
    onClose,
    onSave,
    editingProduct
}) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [brandId, setBrandId] = useState("");
    const [discountPercent, setDiscountPercent] = useState("0");
    const [origin, setOrigin] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState("");

    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);

    const token = localStorage.getItem("token");

    // =========================
    // LOAD CATEGORY + BRAND
    // =========================
    useEffect(() => {
        if (show) {
            loadCategories();
            loadBrands();
        }
    }, [show]);

    const loadCategories = async () => {
        try {
            const response = await fetch(
                "https://localhost:7019/api/categories",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                console.log(
                    "Không tải được danh mục:",
                    await response.text()
                );
                return;
            }

            const data = await response.json();

            setCategories(
                Array.isArray(data) ? data : []
            );
        } catch (error) {
            console.log(error);
        }
    };

    const loadBrands = async () => {
        try {
            const response = await fetch(
                "https://localhost:7019/api/brands",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                console.log(
                    "Không tải được thương hiệu:",
                    await response.text()
                );
                return;
            }

            const data = await response.json();

            setBrands(
                Array.isArray(data) ? data : []
            );
        } catch (error) {
            console.log(error);
        }
    };

    // =========================
    // SET FORM DATA
    // =========================
    useEffect(() => {
        if (editingProduct) {
            setName(editingProduct.name || "");
            setDescription(editingProduct.description || "");
            setPrice(editingProduct.price?.toString() || "");
            setStock(editingProduct.stock?.toString() || "");
            setCategoryId(editingProduct.categoryId?.toString() || "");
            setBrandId(editingProduct.brandId?.toString() || "");
            setDiscountPercent(
                editingProduct.discountPercent?.toString() || "0"
            );
            setOrigin(editingProduct.origin || "");
            setImageFile(null);

            if (editingProduct.imageUrl) {
                if (
                    editingProduct.imageUrl.startsWith("http")
                ) {
                    setPreview(editingProduct.imageUrl);
                } else {
                    setPreview(
                        `https://localhost:7019/images/${editingProduct.imageUrl}`
                    );
                }
            } else {
                setPreview("");
            }
        } else {
            setName("");
            setDescription("");
            setPrice("");
            setStock("");
            setCategoryId("");
            setBrandId("");
            setDiscountPercent("0");
            setOrigin("");
            setImageFile(null);
            setPreview("");
        }
    }, [editingProduct, show]);

    // =========================
    // IMAGE CHANGE
    // =========================
    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        setImageFile(file);
        setPreview(URL.createObjectURL(file));
    };

    // =========================
    // SUBMIT
    // =========================
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name.trim()) {
            alert("Vui lòng nhập tên sản phẩm");
            return;
        }

        if (!description.trim()) {
            alert("Vui lòng nhập mô tả sản phẩm");
            return;
        }

        if (!price || Number(price) <= 0) {
            alert("Giá bán phải lớn hơn 0");
            return;
        }

        if (!stock || Number(stock) < 0) {
            alert("Số lượng tồn kho không hợp lệ");
            return;
        }

        if (!categoryId) {
            alert("Vui lòng chọn danh mục");
            return;
        }

        if (!brandId) {
            alert("Vui lòng chọn thương hiệu");
            return;
        }

        if (
            Number(discountPercent) < 0 ||
            Number(discountPercent) > 100
        ) {
            alert("Giảm giá phải nằm trong khoảng 0 - 100%");
            return;
        }

        const formData = new FormData();

        formData.append("Name", name.trim());
        formData.append("Description", description.trim());
        formData.append("Price", price);
        formData.append("Stock", stock);
        formData.append("CategoryId", categoryId);
        formData.append("BrandId", brandId);
        formData.append(
            "DiscountPercent",
            discountPercent || "0"
        );
        formData.append("Origin", origin.trim());

        if (imageFile) {
            formData.append("image", imageFile);
        }

        onSave(formData);
    };

    if (!show) return null;

    return (
        <div className="modal d-block bg-dark bg-opacity-50">
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content border-0 rounded-4 shadow-lg">

                    {/* HEADER */}
                    <div className="modal-header">
                        <h5 className="modal-title fw-bold">
                            {editingProduct
                                ? "Cập nhật sản phẩm"
                                : "Thêm sản phẩm mới"}
                        </h5>

                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                        />
                    </div>

                    {/* FORM */}
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">

                            {/* TÊN */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold">
                                    Tên sản phẩm
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nhập tên sản phẩm"
                                    value={name}
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                    required
                                />
                            </div>

                            {/* MÔ TẢ */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold">
                                    Mô tả sản phẩm
                                </label>

                                <textarea
                                    className="form-control"
                                    rows="3"
                                    placeholder="Nhập mô tả sản phẩm"
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="row">

                                {/* GIÁ */}
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">
                                        Giá bán
                                    </label>

                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Nhập giá bán"
                                        value={price}
                                        onChange={(e) =>
                                            setPrice(e.target.value)
                                        }
                                        required
                                        min="1"
                                    />
                                </div>

                                {/* TỒN KHO */}
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">
                                        Số lượng tồn kho
                                    </label>

                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Nhập số lượng tồn kho"
                                        value={stock}
                                        onChange={(e) =>
                                            setStock(e.target.value)
                                        }
                                        required
                                        min="0"
                                    />
                                </div>
                            </div>

                            {/* HÌNH ẢNH */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold">
                                    Hình ảnh sản phẩm
                                </label>

                                <input
                                    type="file"
                                    className="form-control"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </div>

                            {preview && (
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                        Xem trước hình ảnh
                                    </label>

                                    <div>
                                        <img
                                            src={preview}
                                            alt="Xem trước"
                                            width="120"
                                            height="120"
                                            className="rounded border"
                                            style={{
                                                objectFit: "cover"
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="row">

                                {/* DANH MỤC */}
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">
                                        Danh mục sản phẩm
                                    </label>

                                    <select
                                        className="form-select"
                                        value={categoryId}
                                        onChange={(e) =>
                                            setCategoryId(e.target.value)
                                        }
                                        required
                                    >
                                        <option value="">
                                            -- Chọn danh mục --
                                        </option>

                                        {categories.map((category) => (
                                            <option
                                                key={category.id}
                                                value={category.id}
                                            >
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* THƯƠNG HIỆU */}
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">
                                        Thương hiệu
                                    </label>

                                    <select
                                        className="form-select"
                                        value={brandId}
                                        onChange={(e) =>
                                            setBrandId(e.target.value)
                                        }
                                        required
                                    >
                                        <option value="">
                                            -- Chọn thương hiệu --
                                        </option>

                                        {brands.map((brand) => (
                                            <option
                                                key={brand.id}
                                                value={brand.id}
                                            >
                                                {brand.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="row">

                                {/* GIẢM GIÁ */}
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">
                                        Giảm giá (%)
                                    </label>

                                    <select
                                        className="form-select"
                                        value={discountPercent}
                                        onChange={(e) =>
                                            setDiscountPercent(e.target.value)
                                        }
                                    >
                                        <option value="0">
                                            Không giảm giá
                                        </option>
                                        <option value="5">
                                            Giảm 5%
                                        </option>
                                        <option value="10">
                                            Giảm 10%
                                        </option>
                                        <option value="15">
                                            Giảm 15%
                                        </option>
                                        <option value="20">
                                            Giảm 20%
                                        </option>
                                        <option value="30">
                                            Giảm 30%
                                        </option>
                                        <option value="40">
                                            Giảm 40%
                                        </option>
                                        <option value="50">
                                            Giảm 50%
                                        </option>
                                    </select>
                                </div>

                                {/* XUẤT XỨ */}
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-semibold">
                                        Xuất xứ
                                    </label>

                                    <select
                                        className="form-select"
                                        value={origin}
                                        onChange={(e) =>
                                            setOrigin(e.target.value)
                                        }
                                    >
                                        <option value="">
                                            -- Chọn xuất xứ --
                                        </option>
                                        <option value="Việt Nam">
                                            Việt Nam
                                        </option>
                                        <option value="Hàn Quốc">
                                            Hàn Quốc
                                        </option>
                                        <option value="Nhật Bản">
                                            Nhật Bản
                                        </option>
                                        <option value="Pháp">
                                            Pháp
                                        </option>
                                        <option value="Mỹ">
                                            Mỹ
                                        </option>
                                        <option value="Thái Lan">
                                            Thái Lan
                                        </option>
                                        <option value="Trung Quốc">
                                            Trung Quốc
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* FOOTER */}
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onClose}
                            >
                                Đóng
                            </button>

                            <button
                                type="submit"
                                className="btn btn-danger"
                            >
                                {editingProduct
                                    ? "Cập nhật"
                                    : "Lưu sản phẩm"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ProductModal;