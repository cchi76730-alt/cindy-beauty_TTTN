import { Link } from "react-router-dom";

function ProductCard({ product }) {

    return (

        <div className="col-md-3 mb-4">

            <div className="card h-100 shadow-sm">

                <Link to={`/product/${product.id}`}>

                    <img
                        src={`http://localhost:5114/images/${product.imageUrl}`}
                        className="card-img-top"
                        style={{
                            height: "260px",
                            objectFit: "cover"
                        }}
                    />

                </Link>

                <div className="card-body">

                    <h5>{product.name}</h5>

                    <p className="fw-bold text-danger">
                        {product.price.toLocaleString()}đ
                    </p>

                </div>

            </div>

        </div>
    );
}

export default ProductCard;