import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function PromotionPage() {

  const [promotions, setPromotions] = useState([]);

  useEffect(() => {

    fetch("http://localhost:5114/api/Promotions")
      .then(res => res.json())
      .then(data => setPromotions(data))
      .catch(err => console.log(err));

  }, []);

  return (

    <div className="container py-5">

      <h2 className="fw-bold mb-4">
        🎁 Khuyến mại
      </h2>

      <div className="row g-4">

        {promotions.map((promo) => (

          <div
            className="col-md-6"
            key={promo.id}
          >

            <Link
              to={`/promotions/${promo.id}`}
              className="text-decoration-none"
            >

              <div className="card shadow border-0 h-100">

                <img
                  src={promo.bannerUrl}
                  alt=""
                  style={{
                    height: "250px",
                    objectFit: "cover",
                  }}
                />

                <div className="card-body">

                  <h4 className="text-dark fw-bold">
                    {promo.title}
                  </h4>

                  <p className="text-muted">
                    {promo.description}
                  </p>

                  <div
                    className="fw-bold"
                    style={{
                      color: "#ff2d55",
                    }}
                  >
                    Giảm {promo.discountPercent}%
                  </div>

                </div>

              </div>

            </Link>

          </div>

        ))}

      </div>

    </div>

  );
}

export default PromotionPage;