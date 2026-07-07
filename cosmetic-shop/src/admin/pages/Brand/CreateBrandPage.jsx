import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function CreateBrandPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        description: "",
        country: "",
        website: "",
        foundedYear: "",
        isFeatured: false
    });

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");

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

    const createBrand = async (e) => {
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
        formData.append("isFeatured", form.isFeatured);

        if (image) {
            formData.append("image", image);
        }

        try {
            const res = await fetch(
                "https://localhost:7019/api/admin/brands",
                {
                    method: "POST",
                    body: formData
                }
            );

            if (!res.ok) {
                const text = await res.text();
                toast.error(text || "Không thể thêm thương hiệu");
                return;
            }

            toast.success("Đã thêm thương hiệu");
            navigate("/admin/brands");
        } catch (err) {
            console.log(err);
            toast.error("Lỗi kết nối API");
        }
    };

    return (
        <div className="container-fluid">
            <h2 className="fw-bold mb-4">
                Thêm thương hiệu
            </h2>

            <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body">
                    <form onSubmit={createBrand}>
                        <div className="mb-3">
                            <label className="form-label fw-bold">
                                Tên thương hiệu
                            </label>

                            <input
                                className="form-control"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="VD: L'Oréal, Innisfree..."
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
                                placeholder="Mô tả thương hiệu..."
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
                                    placeholder="Hàn Quốc, Pháp..."
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
                                    placeholder="https://..."
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
                                    placeholder="1995"
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-bold">
                                Chọn ảnh thương hiệu
                            </label>

                            <input
                                type="file"
                                accept="image/*"
                                className="form-control"
                                onChange={handleImageChange}
                            />
                        </div>

                        {preview && (
                            <div className="mb-4">
                                <img
                                    src={preview}
                                    alt="preview"
                                    style={{
                                        width: "160px",
                                        height: "160px",
                                        objectFit: "cover",
                                        borderRadius: "16px",
                                        border: "1px solid #eee"
                                    }}
                                />
                            </div>
                        )}

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
                            Lưu thương hiệu
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

export default CreateBrandPage;