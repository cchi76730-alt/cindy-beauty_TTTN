import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

function ProductCard({ product }) {
    const navigate = useNavigate();

    const { addToCart } = useContext(CartContext);

    const imageSrc = product.imageUrl?.startsWith("http")
        ? product.imageUrl
        : `https://localhost:7019/images/${product.imageUrl}`;

    const hasDiscount =
        product.discountPercent && product.discountPercent > 0;

    const finalPrice = hasDiscount
        ? product.finalPrice ||
          product.price - (product.price * product.discountPercent / 100)
        : product.price;

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();

        addToCart(
            {
                ...product,
                finalPrice: finalPrice
            },
            1
        );
    };

    const handleBuyNow = (e) => {
        e.preventDefault();
        e.stopPropagation();

        navigate("/checkout", {
            state: {
                product: {
                    ...product,
                    finalPrice: finalPrice
                },
                quantity: 1
            }
        });
    };

    return (
        <div className="col-md-3 mb-4">
            <div className="card h-100 shadow-sm position-relative">
                {hasDiscount && (
                    <div
                        style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            background: "#ff2d55",
                            color: "#fff",
                            padding: "4px 10px",
                            borderRadius: "12px",
                            fontWeight: "bold",
                            zIndex: 2
                        }}
                    >
                        -{product.discountPercent}%
                    </div>
                )}

                <Link
                    to={`/product/${product.id}`}
                    className="text-decoration-none text-dark"
                >
                    <img
                        src={imageSrc}
                        alt={product.name}
                        className="card-img-top"
                        style={{
                            height: "260px",
                            objectFit: "cover"
                        }}
                        onError={(e) => {
                            e.currentTarget.src = "/no-image.png";
                        }}
                    />

                    <div className="card-body">
                        <h5>{product.name}</h5>

                        {hasDiscount ? (
                            <>
                                <p className="fw-bold text-danger mb-1">
                                    {finalPrice?.toLocaleString()}đ
                                </p>

                                <small
                                    className="text-muted"
                                    style={{
                                        textDecoration: "line-through"
                                    }}
                                >
                                    {product.price?.toLocaleString()}đ
                                </small>
                            </>
                        ) : (
                            <p className="fw-bold text-danger">
                                {product.price?.toLocaleString()}đ
                            </p>
                        )}
                    </div>
                </Link>

                <div className="card-footer bg-white border-0 d-flex gap-2">
                    <button
                        className="btn btn-danger flex-grow-1 fw-bold"
                        onClick={handleBuyNow}
                    >
                        Mua ngay
                    </button>

                    <button
                        className="btn btn-outline-danger"
                        onClick={handleAddToCart}
                        title="Thêm vào giỏ hàng"
                    >
                        🛒
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;