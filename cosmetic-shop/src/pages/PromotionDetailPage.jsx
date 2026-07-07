import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function PromotionDetailPage() {
  const { id } = useParams();

  const [promotion, setPromotion] = useState(null);

  useEffect(() => {
    fetch(`https://localhost:7019/api/Promotions/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Không tìm thấy khuyến mãi");
        }

        return res.json();
      })
      .then((data) => {
        setPromotion(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  if (!promotion) {
    return (
      <div className="container py-5">
        <h3>Đang tải...</h3>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#fff5f7",
        minHeight: "100vh",
      }}
    >
      {/* BANNER */}
      <div
        style={{
          background:
            "linear-gradient(135deg,#ff4d8d,#ff8fb1)",
          padding: "60px 20px",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "42px",
            fontWeight: "800",
          }}
        >
          {promotion.title}
        </h1>

        <p
          style={{
            fontSize: "18px",
            marginTop: "12px",
          }}
        >
          {promotion.description}
        </p>

        <div
          style={{
            marginTop: "20px",
            display: "inline-block",
            background: "#fff",
            color: "#ff2d55",
            padding: "12px 28px",
            borderRadius: "999px",
            fontWeight: "700",
            fontSize: "22px",
          }}
        >
          Giảm {promotion.discountPercent}%
        </div>
      </div>

      <div className="container py-5">
        {/* VOUCHER */}
        <div className="row mb-5">
          <div className="col-md-6">
            <div
              style={{
                background: "#fff",
                borderRadius: "20px",
                padding: "25px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              }}
            >
              <h4 className="fw-bold mb-3">
                🎁 Voucher ưu đãi
              </h4>

              <div
                style={{
                  border: "2px dashed #ff4d8d",
                  borderRadius: "16px",
                  padding: "20px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "30px",
                    fontWeight: "800",
                    color: "#ff2d55",
                  }}
                >
                  SALE{promotion.discountPercent}
                </div>

                <p className="mb-0 mt-2">
                  Giảm ngay {promotion.discountPercent}%
                  cho tất cả sản phẩm trong chương trình
                </p>
              </div>
            </div>
          </div>

          {/* INFO */}
          <div className="col-md-6">
            <div
              style={{
                background: "#fff",
                borderRadius: "20px",
                padding: "25px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                height: "100%",
              }}
            >
              <h4 className="fw-bold mb-3">
                📌 Thông tin chương trình
              </h4>

              <ul
                style={{
                  lineHeight: "2",
                  paddingLeft: "18px",
                }}
              >
                <li>
                  Áp dụng cho các sản phẩm bên dưới
                </li>

                <li>
                  Không giới hạn số lượng sử dụng
                </li>

                <li>
                  Có thể kết hợp freeship
                </li>

                <li>
                  Áp dụng online toàn quốc
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* PRODUCTS */}
        <h2
          className="fw-bold mb-4"
          style={{
            color: "#ff2d55",
          }}
        >
          🔥 Sản phẩm khuyến mãi
        </h2>

        <div className="row g-4">
          {promotion.products?.map((product) => {
            const newPrice =
              product.price -
              (product.price *
                promotion.discountPercent) /
                100;

            return (
              <div
                key={product.id}
                className="col-md-3"
              >
                <div
                  style={{
                    background: "#fff",
                    borderRadius: "20px",
                    overflow: "hidden",
                    boxShadow:
                      "0 10px 25px rgba(0,0,0,0.08)",
                    transition: "0.3s",
                    height: "100%",
                  }}
                >
                  {/* IMAGE */}
                  <div
                    style={{
                      position: "relative",
                    }}
                  >
                    <img
                      src={`https://localhost:7019/images/${product.imageUrl}`}
                      alt={product.name}
                      style={{
                        width: "100%",
                        height: "260px",
                        objectFit: "cover",
                      }}
                    />

                    {/* BADGE */}
                    <div
                      style={{
                        position: "absolute",
                        top: "12px",
                        left: "12px",
                        background: "#ff2d55",
                        color: "#fff",
                        padding: "6px 12px",
                        borderRadius: "999px",
                        fontWeight: "700",
                        fontSize: "14px",
                      }}
                    >
                      -{promotion.discountPercent}%
                    </div>
                  </div>

                  {/* INFO */}
                  <div className="p-3">
                    <h5
                      style={{
                        minHeight: "48px",
                      }}
                    >
                      {product.name}
                    </h5>

                    <div
                      className="mb-2"
                      style={{
                        color: "#777",
                        fontSize: "14px",
                      }}
                    >
                      {product.origin}
                    </div>

                    {/* PRICE */}
                    <div className="mb-3">
                      <span
                        style={{
                          color: "#ff2d55",
                          fontWeight: "800",
                          fontSize: "24px",
                        }}
                      >
                        {newPrice.toLocaleString()}đ
                      </span>

                      <br />

                      <span
                        style={{
                          color: "#999",
                          textDecoration:
                            "line-through",
                        }}
                      >
                        {product.price.toLocaleString()}đ
                      </span>
                    </div>

                    <Link
  to="/checkout"
  state={{
    product: product,
    quantity: 1,
    finalPrice: newPrice,
  }}
  className="btn w-100"
  style={{
    background:
      "linear-gradient(135deg,#ff4d8d,#ff8fb1)",
    color: "#fff",
    borderRadius: "12px",
    fontWeight: "700",
  }}
>
  Mua ngay
</Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PromotionDetailPage;