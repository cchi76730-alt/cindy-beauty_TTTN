import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams
} from "react-router-dom";
import { toast } from "react-toastify";

function EditBrandPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const fallbackImage =
        "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect width='100%25' height='100%25' fill='%23eeeeee'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999999' font-size='32'%3ENo Image%3C/text%3E%3C/svg%3E";

    const [form, setForm] = useState({
        name: "",
        description: "",
        country: "",
        website: "",
        foundedYear: "",
        isActive: true,
        isFeatured: false
    });

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(fallbackImage);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBrand();
    }, [id]);

    const isValidImageValue = (value) => {
        return (
            value &&
            value !== "null" &&
            value !== "undefined" &&
            value.trim() !== ""
        );
    };

    const getBrandImage = (brand) => {
    const imageUrl =
        isValidImageValue(brand.thumbnailUrl)
            ? String(brand.thumbnailUrl).trim()
            : isValidImageValue(brand.logoUrl)
                ? String(brand.logoUrl).trim()
                : isValidImageValue(brand.bannerUrl)
                    ? String(brand.bannerUrl).trim()
                    : "";

    if (!imageUrl) {
        return fallbackImage;
    }

    if (imageUrl.startsWith("http")) {
        return imageUrl;
    }

    if (imageUrl.startsWith("/images/")) {
        return `https://localhost:7019${imageUrl}`;
    }

    if (imageUrl.startsWith("images/")) {
        return `https://localhost:7019/${imageUrl}`;
    }

    if (imageUrl.startsWith("brands/")) {
        return `https://localhost:7019/images/${imageUrl}`;
    }

    return `https://localhost:7019/images/brands/${imageUrl}`;
};

    const loadBrand = async () => {
        try {
            const res = await fetch(
                `https://localhost:7019/api/admin/brands/${id}`
            );

            if (!res.ok) {
                toast.error("Không tìm thấy thương hiệu");
                navigate("/admin/brands");
                return;
            }

            const data = await res.json();

            setForm({
                name: data.name || "",
                description: data.description || "",
                country: data.country || "",
                website: data.website || "",
                foundedYear: data.foundedYear || "",
                isActive: data.isActive ?? true,
                isFeatured: data.isFeatured ?? false
            });

            setPreview(getBrandImage(data));
        } catch (err) {
            console.log(err);
            toast.error("Lỗi kết nối API");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const updateBrand = async (e) => {
        e.preventDefault();

        if (!form.name.trim()) {
            toast.error("Nhập tên thương hiệu");
            return;
        }

        const formData = new FormData();

        formData.append("name", form.name);
        formData.append("description", form.description);
        formData.append("country", form.country);
        formData.append("website", form.website);
        formData.append("foundedYear", form.foundedYear || "");
        formData.append("isActive", form.isActive);
        formData.append("isFeatured", form.isFeatured);

        if (image) {
            formData.append("image", image);
        }

        try {
            const res = await fetch(
                `https://localhost:7019/api/admin/brands/${id}`,
                {
                    method: "PUT",
                    body: formData
                }
            );

            if (!res.ok) {
                const text = await res.text();
                toast.error(text || "Không thể cập nhật thương hiệu");
                return;
            }

            toast.success("Đã cập nhật thương hiệu");
            navigate("/admin/brands");
        } catch (err) {
            console.log(err);
            toast.error("Lỗi kết nối API");
        }
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-danger" />
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <h2 className="fw-bold mb-4">
                Sửa thương hiệu
            </h2>

            <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body">
                    <form onSubmit={updateBrand}>
                        <div className="mb-3">
                            <label className="form-label fw-bold">
                                Tên thương hiệu
                            </label>

                            <input
                                className="form-control"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">
                                Mô tả
                            </label>

                            <textarea
                                className="form-control"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows="3"
                            />
                        </div>

                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label className="form-label fw-bold">
                                    Quốc gia
                                </label>

                                <input
                                    className="form-control"
                                    name="country"
                                    value={form.country}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label fw-bold">
                                    Website
                                </label>

                                <input
                                    className="form-control"
                                    name="website"
                                    value={form.website}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label fw-bold">
                                    Năm thành lập
                                </label>

                                <input
                                    type="number"
                                    className="form-control"
                                    name="foundedYear"
                                    value={form.foundedYear}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-bold">
                                Chọn ảnh thương hiệu mới
                            </label>

                            <input
                                type="file"
                                accept="image/*"
                                className="form-control"
                                onChange={handleImageChange}
                            />
                        </div>

                        <div className="mb-4">
                            <img
                                src={preview}
                                alt="preview"
                                style={{
                                    width: "180px",
                                    height: "180px",
                                    objectFit: "cover",
                                    borderRadius: "16px",
                                    border: "1px solid #eee",
                                    background: "#f5f5f5"
                                }}
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = fallbackImage;
                                }}
                            />
                        </div>

                        <div className="form-check mb-2">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                name="isActive"
                                checked={form.isActive}
                                onChange={handleChange}
                            />

                            <label className="form-check-label">
                                Đang hoạt động
                            </label>
                        </div>

                        <div className="form-check mb-4">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                name="isFeatured"
                                checked={form.isFeatured}
                                onChange={handleChange}
                            />

                            <label className="form-check-label">
                                Hiển thị nổi bật
                            </label>
                        </div>

                        <button
                            className="btn btn-danger fw-bold me-2"
                            type="submit"
                        >
                            Cập nhật
                        </button>

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate("/admin/brands")}
                        >
                            Quay lại
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditBrandPage;