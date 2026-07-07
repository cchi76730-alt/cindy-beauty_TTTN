function ProductTable({

    products,

    onEdit,

    onDelete

}) {

    return (

        <div className="card border-0 shadow-lg rounded-4 overflow-hidden">

            {/* HEADER */}

            <div className="p-4 border-bottom bg-white">

                <div className="d-flex justify-content-between align-items-center">

                    <div>

                        <h4 className="fw-bold mb-1">

                            Danh sách sản phẩm

                        </h4>

                        <div className="text-muted">

                            Tổng sản phẩm:
                            {" "}
                            {products.length}

                        </div>

                    </div>

                    <div
                        className="badge bg-danger fs-6 px-3 py-2"
                    >
                        Admin
                    </div>

                </div>

            </div>

            {/* TABLE */}

            <div className="table-responsive">

                <table className="table align-middle mb-0">

                    <thead
                        className="table-light"
                    >

                        <tr>

                            <th
                                className="ps-4"
                            >
                                ID
                            </th>

                            <th>
                                Ảnh
                            </th>

                            <th>
                                Tên sản phẩm
                            </th>

                            <th>
                                Danh mục
                            </th>

                            <th>
                                Thương hiệu
                            </th>

                            <th>
                                Giá
                            </th>

                            <th>
                                Tồn kho
                            </th>

                            <th>
                                Sale
                            </th>

                            <th>
                                Rating
                            </th>

                            <th
                                className="text-center"
                            >
                                Thao tác
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {products.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="10"
                                    className="text-center py-5 text-muted"
                                >

                                    Không có sản phẩm nào

                                </td>

                            </tr>

                        ) : (

                            products.map(product => (

                                <tr
                                    key={product.id}
                                >

                                    {/* ID */}

                                    <td
                                        className="ps-4 fw-bold"
                                    >

                                        #{product.id}

                                    </td>

                                    {/* IMAGE */}

                                    <td>

                                        <img
    src={
        product.imageUrl
            ? product.imageUrl.startsWith("http")
                ? product.imageUrl
                : `https://localhost:7019/images/${product.imageUrl}`
            : "https://dummyimage.com/60x60/cccccc/000000"
    }
                                            alt=""
                                            width="60"
                                            height="60"
                                            className="rounded-3 border"
                                            style={{
                                                objectFit:
                                                    "cover"
                                            }}
                                        />

                                    </td>

                                    {/* NAME */}

                                    <td>

                                        <div
                                            className="fw-semibold"
                                        >

                                            {
                                                product.name
                                            }

                                        </div>

                                        <small
                                            className="text-muted"
                                        >

                                            {
                                                product.origin
                                            }

                                        </small>

                                    </td>

                                    {/* CATEGORY */}

                                    <td>

                                        <span
                                            className="badge bg-light text-dark border"
                                        >

                                            {
                                                product.category?.name ||
                                                "Chưa có"
                                            }

                                        </span>

                                    </td>

                                    {/* BRAND */}

                                    <td>

                                        <span
                                            className="badge bg-dark"
                                        >

                                            {
                                                product.brand?.name ||
                                                "No Brand"
                                            }

                                        </span>

                                    </td>

                                    {/* PRICE */}

                                    <td>

                                        <div
                                            className="fw-bold text-danger"
                                        >

                                            {
                                                product.price?.toLocaleString()
                                            }đ

                                        </div>

                                    </td>

                                    {/* STOCK */}

                                    <td>

                                        {product.stock > 0 ? (

                                            <span
                                                className="badge bg-success"
                                            >

                                                {
                                                    product.stock
                                                }

                                            </span>

                                        ) : (

                                            <span
                                                className="badge bg-danger"
                                            >

                                                Hết hàng

                                            </span>

                                        )}

                                    </td>

                                    {/* SALE */}

                                    <td>

                                        {product.discountPercent > 0 ? (

                                            <span
                                                className="badge bg-danger"
                                            >

                                                -
                                                {
                                                    product.discountPercent
                                                }%

                                            </span>

                                        ) : (

                                            <span
                                                className="text-muted"
                                            >

                                                Không

                                            </span>

                                        )}

                                    </td>

                                    {/* RATING */}

                                    <td>

                                        <span
                                            className="text-warning fw-semibold"
                                        >

                                            ⭐
                                            {" "}
                                            {
                                                product.rating || 5
                                            }

                                        </span>

                                    </td>

                                    {/* ACTION */}

                                    <td>

                                        <div
                                            className="d-flex justify-content-center gap-2"
                                        >

                                            {/* EDIT */}

                                            <button
                                                className="btn btn-warning btn-sm px-3"
                                                onClick={() =>
                                                    onEdit(product)
                                                }
                                            >

                                                ✏️ Sửa

                                            </button>

                                            {/* DELETE */}

                                            <button
                                                className="btn btn-danger btn-sm px-3"
                                                onClick={() =>
                                                    onDelete(product.id)
                                                }
                                            >

                                                🗑 Xóa

                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default ProductTable;