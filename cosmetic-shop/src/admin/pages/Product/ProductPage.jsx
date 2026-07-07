import { useEffect, useState } from "react";

import ProductTable from "./components/ProductTable";
import ProductModal from "./components/ProductModal";

function ProductPage() {

    const [products, setProducts] = useState([]);

    const [showModal, setShowModal]
        = useState(false);

    const [editingProduct, setEditingProduct]
        = useState(null);

    // TOKEN
    const token = localStorage.getItem("token");

    // =========================
    // LOAD PRODUCTS
    // =========================
    const loadProducts = async () => {

        try {

            const response = await fetch(
                "https://localhost:7019/api/admin/products",
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            // CHƯA LOGIN
            if (response.status === 401) {

                alert("Bạn chưa đăng nhập admin");

                return;
            }

            // LỖI KHÁC
            if (!response.ok) {

                const text = await response.text();

                console.log(text);

                return;
            }

            // SUCCESS
            const data = await response.json();

            setProducts(data);

        } catch (error) {

            console.log(error);
        }
    };

    useEffect(() => {

        loadProducts();

    }, []);

    // =========================
    // DELETE
    // =========================
    const handleDelete = async (id) => {

        const confirmDelete =
            window.confirm("Bạn có chắc muốn xóa?");

        if (!confirmDelete) return;

        try {

            const response = await fetch(
                `https://localhost:7019/api/admin/products/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {

                console.log(await response.text());

                return;
            }

            loadProducts();

        } catch (error) {

            console.log(error);
        }
    };

    // =========================
    // EDIT
    // =========================
    const handleEdit = (product) => {

        setEditingProduct(product);

        setShowModal(true);
    };

    // =========================
    // ADD
    // =========================
    const handleAdd = () => {

        setEditingProduct(null);

        setShowModal(true);
    };

    // =========================
    // SAVE
    // =========================
    const handleSave = async (formData) => {

        try {

            let response;

            // UPDATE
            if (editingProduct) {

                response = await fetch(
                    `https://localhost:7019/api/admin/products/${editingProduct.id}`,
                    {
                        method: "PUT",
                        headers: {
                            "Authorization": `Bearer ${token}`
                        },
                        body: formData
                    }
                );

            } else {

                // CREATE
                response = await fetch(
                    "https://localhost:7019/api/admin/products",
                    {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${token}`
                        },
                        body: formData
                    }
                );
            }

            // ERROR
            if (!response.ok) {

                const text = await response.text();

                console.log(text);

                alert("Lỗi thêm/sửa sản phẩm");

                return;
            }

            // SUCCESS
            setShowModal(false);

            loadProducts();

        } catch (error) {

            console.log(error);
        }
    };

    return (

        <div className="container-fluid">

            {/* HEADER */}
            <div
                className="
                    d-flex
                    justify-content-between
                    align-items-center
                    mb-4
                "
            >

                <div>

                    <h2 className="fw-bold">
                        Quản lý sản phẩm
                    </h2>

                    <div className="text-muted">
    Quản lý danh sách sản phẩm, giá bán, tồn kho và hình ảnh
</div>

                </div>

                <button
                    className="btn btn-danger px-4"
                    onClick={handleAdd}
                >
                    + Thêm sản phẩm
                </button>

            </div>

            {/* TABLE */}
            <ProductTable
                products={products}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {/* MODAL */}
            <ProductModal
                show={showModal}
                onClose={() =>
                    setShowModal(false)
                }
                onSave={handleSave}
                editingProduct={editingProduct}
            />

        </div>
    );
}

export default ProductPage;