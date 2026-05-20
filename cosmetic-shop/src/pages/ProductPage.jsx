import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/productService";
import { useSearchParams } from "react-router-dom";

function ProductPage() {

    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [priceFilter, setPriceFilter] = useState("all");
    const [sortOrder, setSortOrder] = useState("");

    const [searchParams] = useSearchParams();

    const brandId = searchParams.get("brandId");

    // ✅ lấy categoryId từ URL
    const categoryId = searchParams.get("categoryId");

    useEffect(() => {
    loadProducts();
}, [categoryId, brandId]);

    const loadProducts = async () => {
    try {
        const result = await getProducts({
            categoryId: categoryId || undefined,
            brandId: brandId || undefined
        });

        setProducts(result.data);
    } catch (error) {
        console.log(error);
    }
};

    const filteredProducts = products
        .filter(product => {

            const matchName =
                product.name.toLowerCase()
                    .includes(searchTerm.toLowerCase());

            const matchPrice =
                priceFilter === "all" ||
                (priceFilter === "low" && product.price < 500000) ||
                (priceFilter === "high" && product.price >= 500000);

            // ✅ FIX QUAN TRỌNG: lọc theo categoryId
            const matchCategory =
                !categoryId ||
                product.categoryId === Number(categoryId);

            return matchName && matchPrice && matchCategory;
        })
        .sort((a, b) => {
            if (sortOrder === "asc") return a.price - b.price;
            if (sortOrder === "desc") return b.price - a.price;
            return 0;
        });

    return (
        <div>

            <h2 className="mb-4 fw-bold">
                Danh sách sản phẩm
            </h2>

            {/* search */}
            <div className="mb-4">
                <input
                    className="form-control"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* sort */}
            <div className="mb-4">
                <select
                    className="form-select"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                >
                    <option value="">Sắp xếp giá</option>
                    <option value="asc">Giá thấp đến cao</option>
                    <option value="desc">Giá cao đến thấp</option>
                </select>
            </div>

            {/* products */}
            <div className="row">
                {filteredProducts.map(product => (
                    <ProductCard
                        key={product.id}
                        product={product}
                    />
                ))}
            </div>

        </div>
    );
}

export default ProductPage;