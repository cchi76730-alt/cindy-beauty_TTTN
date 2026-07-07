import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBrands } from "../services/brandService";

function BrandsPage() {
    const [brands, setBrands] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const fallbackImage =
        "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect width='100%25' height='100%25' fill='%23eeeeee'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999999' font-size='32'%3ENo Image%3C/text%3E%3C/svg%3E";

    useEffect(() => {
        loadBrands();
    }, []);

    const loadBrands = async () => {
        try {
            const result = await getBrands();

            setBrands(result.data || []);
        } catch (error) {
            console.log(error);
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

   const getBrandImage = (brand) => {
    const imageUrl =
        isValidImageValue(brand.thumbnailUrl)
            ? brand.thumbnailUrl
            : isValidImageValue(brand.logoUrl)
                ? brand.logoUrl
                : isValidImageValue(brand.bannerUrl)
                    ? brand.bannerUrl
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

    const filteredBrands = brands.filter((brand) =>
        brand.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container py-5">
            <div
                className="text-center mb-5 p-5"
                style={{
                    background:
                        "linear-gradient(135deg, #fff1f5, #f8f9fa)",
                    borderRadius: "24px"
                }}
            >
                <span className="badge bg-dark mb-3 px-3 py-2">
                    Cindybeauty Shop
                </span>

                <h2 className="fw-bold display-5 mb-3">
                    Thương hiệu mỹ phẩm nổi bật
                </h2>

                <p className="text-muted mb-4">
                    Khám phá các thương hiệu chăm sóc da, trang điểm và nước hoa được yêu thích.
                </p>

                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <input
                            type="text"
                            className="form-control form-control-lg rounded-pill px-4"
                            placeholder="Tìm thương hiệu..."
                            value={searchTerm}
                            onChange={(e) =>
                                setSearchTerm(e.target.value)
                            }
                        />
                    </div>
                </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold mb-0">
                    Tất cả thương hiệu
                </h4>

                <span className="text-muted">
                    {filteredBrands.length} thương hiệu
                </span>
            </div>

            <div className="row g-4">
                {filteredBrands.map((brand) => (
                    <div
                        className="col-md-6 col-lg-3"
                        key={brand.id}
                    >
                        <Link
                            to={`/products?brandId=${brand.id}`}
                            className="text-decoration-none"
                        >
                            <div
                                className="card border-0 shadow-sm h-100 brand-card"
                                style={{
                                    overflow: "hidden",
                                    borderRadius: "22px"
                                }}
                            >
                                <div
                                    className="position-relative"
                                    style={{
                                        height: "240px",
                                        overflow: "hidden",
                                        background: "#f5f5f5"
                                    }}
                                >
                                    <img
                                        src={getBrandImage(brand)}
                                        alt={brand.name}
                                        className="w-100 h-100 brand-img"
                                        style={{
                                            objectFit: "cover"
                                        }}
                                        onError={(e) => {
                                            e.currentTarget.onerror = null;
                                            e.currentTarget.src =
                                                fallbackImage;
                                        }}
                                    />

                                    <div
                                        className="position-absolute top-0 start-0 w-100 h-100"
                                        style={{
                                            background:
                                                "linear-gradient(to bottom, rgba(0,0,0,0.05), rgba(0,0,0,0.45))"
                                        }}
                                    />

                                    <span className="position-absolute top-0 end-0 m-3 badge bg-light text-dark px-3 py-2">
                                        {brand.productCount || 0} SP
                                    </span>

                                    <h4 className="position-absolute bottom-0 start-0 text-white fw-bold m-3">
                                        {brand.name}
                                    </h4>
                                </div>

                                <div className="card-body text-center">
                                    <p
                                        className="text-muted small mb-3"
                                        style={{
                                            minHeight: "42px"
                                        }}
                                    >
                                        {brand.description ||
                                            "Thương hiệu mỹ phẩm được yêu thích tại Cindybeauty Shop."}
                                    </p>

                                    <div className="btn btn-dark rounded-pill px-4">
                                        Xem sản phẩm
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            {filteredBrands.length === 0 && (
                <div className="text-center py-5 text-muted">
                    Không tìm thấy thương hiệu phù hợp.
                </div>
            )}
        </div>
    );
}

export default BrandsPage;