import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function BeautyMatchWidget() {

    const [open, setOpen] = useState(false);

    const [skinType, setSkinType] = useState("");
    const [concern, setConcern] = useState("");
    const [priceRange, setPriceRange] = useState("");

    const [results, setResults] = useState([]);
    const [advice, setAdvice] = useState("");
    const [routine, setRoutine] = useState(null);

    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        try {
            setLoading(true);

            const res = await axios.get(
                "https://localhost:7019/api/BeautyMatch",
                {
                    params: {
                        skinType: skinType || null,
                        concern: concern || null,
                        priceRange: priceRange || null
                    }
                }
            );

            setResults(res.data.products || []);
            setAdvice(res.data.advice || "");
            setRoutine(res.data.routine || null);

        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* ================= FLOAT BUTTON ================= */}
            <div
                onClick={() => setOpen(!open)}
                style={{
                    position: "fixed",
                    bottom: "20px",
                    right: "20px",
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    background: "#111",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontSize: "22px",
                    zIndex: 99999
                }}
            >
                ✨
            </div>

            {/* ================= PANEL ================= */}
            {open && (
                <div
                    style={{
                        position: "fixed",
                        bottom: "90px",
                        right: "20px",
                        width: "380px",
                        maxHeight: "80vh",
                        overflowY: "auto",
                        background: "#fff",
                        borderRadius: "16px",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                        zIndex: 99999,
                        padding: "15px"
                    }}
                >

                    {/* HEADER */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="fw-bold mb-0">Beauty Match ✨</h5>

                        <button
                            className="btn btn-sm btn-light"
                            onClick={() => setOpen(false)}
                        >
                            ✖
                        </button>
                    </div>

                    {/* FILTER */}
                    <select className="form-select mb-2" onChange={(e) => setSkinType(e.target.value)}>
                        <option value="">Loại da</option>
                        <option value="da dầu">Da dầu</option>
                        <option value="da khô">Da khô</option>
                        <option value="da nhạy cảm">Da nhạy cảm</option>
                        <option value="da hỗn hợp">Da hỗn hợp</option>
                    </select>

                    <select className="form-select mb-2" onChange={(e) => setConcern(e.target.value)}>
                        <option value="">Nhu cầu</option>
                        <option value="mụn">Mụn</option>
                        <option value="dưỡng ẩm">Dưỡng ẩm</option>
                        <option value="chống nắng">Chống nắng</option>
                        <option value="làm sạch">Làm sạch</option>
                    </select>

                    <select className="form-select mb-2" onChange={(e) => setPriceRange(e.target.value)}>
                        <option value="">Ngân sách</option>
                        <option value="thấp">Thấp</option>
                        <option value="trungbinh">Trung bình</option>
                        <option value="cao">Cao</option>
                    </select>

                    <button
                        className="btn btn-dark w-100 mb-3"
                        onClick={handleSearch}
                    >
                        {loading ? "Đang tìm..." : "Tìm sản phẩm"}
                    </button>

                    {/* ADVICE */}
                    {advice && (
                        <div className="mb-3 p-2 bg-light rounded">
                            <strong>💡 Advice</strong>
                            <div>{advice}</div>
                        </div>
                    )}

                    {/* ROUTINE */}
                    {routine && (
                        <div className="mb-3 p-2 border rounded">
                            <strong>🧴 Routine</strong>

                            <div className="mt-2">
                                <div><b>🌞 Morning</b></div>
                                <ul>
                                    {routine.morning?.map((i, idx) => (
                                        <li key={idx}>{i}</li>
                                    ))}
                                </ul>

                                <div><b>🌙 Night</b></div>
                                <ul>
                                    {routine.night?.map((i, idx) => (
                                        <li key={idx}>{i}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* PRODUCTS (FIX CLICK FULL) */}
                    <div>
                        {results.length === 0 && (
                            <div className="text-muted text-center">
                                Không có sản phẩm
                            </div>
                        )}

                        {results.map((p) => (
    <Link
        to={`/product/${p.id}`}
        key={p.id}
        style={{
            textDecoration: "none",
            color: "inherit"
        }}
    >
        <div
            className="border rounded p-2 mb-2"
            style={{
                cursor: "pointer",
                transition: "0.2s",
                display: "flex",
                gap: "10px",
                alignItems: "center"
            }}
            onMouseEnter={(e) =>
                e.currentTarget.style.background = "#f8f9fa"
            }
            onMouseLeave={(e) =>
                e.currentTarget.style.background = "white"
            }
        >

            {/* IMAGE ADDED HERE */}
            <img
                src={`https://localhost:7019/images/${p.imageUrl}`}
                alt={p.name}
                style={{
                    width: "60px",
                    height: "60px",
                    objectFit: "cover",
                    borderRadius: "10px"
                }}
            />

            {/* TEXT (KEEP ORIGINAL) */}
            <div>

                <strong>{p.name}</strong>

                <div className="text-danger">
                    {p.price?.toLocaleString()}đ
                </div>

            </div>

        </div>
    </Link>
))}
                    </div>

                </div>
            )}
        </>
    );
}

export default BeautyMatchWidget;