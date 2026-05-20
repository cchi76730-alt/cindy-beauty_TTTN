import { useState } from "react";

function BeautyBlogPage() {
    const blogs = [
        {
            id: 1,
            title: "5 bước skincare giúp da khỏe hơn",
            category: "Skincare",
            image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200",
            description: "Những bước skincare cơ bản giúp duy trì làn da khỏe mạnh mỗi ngày.",
            date: "20/05/2026",
            url: "https://moicosmetics.vn/blogs/bi-quyet-khoe-dep/bi-kip-lam-dep-da-mat"
        },
        {
            id: 2,
            title: "Xu hướng makeup Hàn Quốc 2026",
            category: "Makeup",
            image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1200",
            description: "Phong cách makeup tự nhiên tiếp tục dẫn đầu xu hướng năm nay.",
            date: "18/05/2026",
            url: "https://www.elle.vn/lam-dep/xu-huong-trang-diem"
        },
        {
            id: 3,
            title: "Top serum dưỡng sáng da được yêu thích",
            category: "Review",
            image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=1200",
            description: "Danh sách serum giúp dưỡng sáng và phục hồi da hiệu quả.",
            date: "15/05/2026",
            url: "https://chiaki.vn/tin-tuc/serum-trang-da-tot-nhat"
        }
    ];

    const [selectedCategory, setSelectedCategory] = useState("All");

    const filteredBlogs =
        selectedCategory === "All"
            ? blogs
            : blogs.filter((blog) => blog.category === selectedCategory);

    return (
        <div className="container py-5">
            <div
                className="p-5 mb-5 text-white rounded-4"
                style={{
                    background:
                        "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=1200') center/cover"
                }}
            >
                <h1 className="fw-bold display-4 mb-3">Beauty Blog</h1>
                <p className="fs-5">
                    Cập nhật xu hướng làm đẹp, skincare và review mỹ phẩm mới nhất.
                </p>
            </div>

            <div className="d-flex gap-3 flex-wrap mb-5">
                {["All", "Skincare", "Makeup", "Review"].map((category) => (
                    <button
                        key={category}
                        className={`btn rounded-pill px-4 ${
                            selectedCategory === category
                                ? "btn-dark"
                                : "btn-outline-dark"
                        }`}
                        onClick={() => setSelectedCategory(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div className="row g-4">
                {filteredBlogs.map((blog) => (
                    <div className="col-md-6 col-lg-4" key={blog.id}>
                        <div
                            className="card border-0 shadow-sm h-100"
                            style={{
                                borderRadius: "22px",
                                overflow: "hidden"
                            }}
                        >
                            <img
                                src={blog.image}
                                alt={blog.title}
                                style={{
                                    height: "240px",
                                    objectFit: "cover"
                                }}
                            />

                            <div className="card-body">
                                <span className="badge bg-dark mb-3">
                                    {blog.category}
                                </span>

                                <h4 className="fw-bold mb-3">{blog.title}</h4>

                                <p className="text-muted">{blog.description}</p>

                                <div className="d-flex justify-content-between align-items-center mt-4">
                                    <small className="text-muted">
                                        {blog.date}
                                    </small>

                                    <a
                                        href={blog.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-dark rounded-pill px-4"
                                    >
                                        Đọc thêm
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BeautyBlogPage;