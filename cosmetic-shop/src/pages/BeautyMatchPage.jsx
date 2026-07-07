import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function BeautyMatchPage() {

    const [skinType, setSkinType] = useState("");
    const [concern, setConcern] = useState("");
    const [priceRange, setPriceRange] = useState("");

    const [results, setResults] = useState([]);
    const [advice, setAdvice] = useState("");
    const [routine, setRoutine] = useState(null);

    const [loading, setLoading] = useState(false);

    const handleMatch = async () => {
        try {
            setLoading(true);

            const response = await axios.get(
                "https://localhost:7019/api/BeautyMatch",
                {
                    params: {
                        skinType,
                        concern,
                        priceRange
                    }
                }
            );

            setResults(response.data.products);
            setAdvice(response.data.advice);
            setRoutine(response.data.routine);

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">

            {/* HEADER */}
            <div className="text-center mb-5">
                <h1 className="fw-bold display-5">
                    Beauty Match ✨
                </h1>
                <p className="text-muted">
                    Skincare recommendation system (no AI)
                </p>
            </div>

            {/* FILTER */}
            <div className="row g-3 mb-4">

                <div className="col-md-4">
                    <select className="form-select" onChange={(e) => setSkinType(e.target.value)}>
                        <option value="">Chọn loại da</option>
                        <option value="da dầu">Da dầu</option>
                        <option value="da khô">Da khô</option>
                        <option value="da hỗn hợp">Da hỗn hợp</option>
                        <option value="da nhạy cảm">Da nhạy cảm</option>
                    </select>
                </div>

                <div className="col-md-4">
                    <select className="form-select" onChange={(e) => setConcern(e.target.value)}>
                        <option value="">Chọn nhu cầu</option>
                        <option value="mụn">Mụn</option>
                        <option value="dưỡng ẩm">Dưỡng ẩm</option>
                        <option value="chống nắng">Chống nắng</option>
                        <option value="làm sạch">Làm sạch</option>
                    </select>
                </div>

                <div className="col-md-4">
                    <select className="form-select" onChange={(e) => setPriceRange(e.target.value)}>
                        <option value="">Chọn ngân sách</option>
                        <option value="thấp">Thấp</option>
                        <option value="trungbinh">Trung bình</option>
                        <option value="cao">Cao</option>
                    </select>
                </div>

            </div>

            {/* BUTTON */}
            <div className="text-center mb-4">
                <button
                    className="btn btn-dark px-5 py-3 rounded-pill"
                    onClick={handleMatch}
                >
                    {loading ? "Đang phân tích..." : "Tìm & tư vấn"}
                </button>
            </div>

            {/* ADVICE */}
            {advice && (
                <div className="mb-4 p-4 rounded-4 shadow-sm bg-light">
                    <h4 className="fw-bold">💡 Beauty Advice</h4>
                    <p className="mb-0">{advice}</p>
                </div>
            )}

            {/* ROUTINE */}
            {routine && (
                <div className="mb-5">

                    <h4 className="fw-bold mb-3">🧴 Skincare Routine</h4>

                    <div className="row g-3">

                        <div className="col-md-6">
                            <div className="p-3 border rounded-4">
                                <h5>🌞 Morning</h5>
                                <ul>
                                    {routine.morning.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="p-3 border rounded-4">
                                <h5>🌙 Night</h5>
                                <ul>
                                    {routine.night.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
            )}

            {/* PRODUCTS */}
            <div className="row g-4">

                {results.map((item) => (
                    <div className="col-md-4" key={item.id}>

                        <Link
                            to={`/product/${item.id}`}
                            className="text-decoration-none text-dark"
                        >
                            <div className="card border-0 shadow-sm h-100">

                                <img
                                    src={`https://localhost:7019/images/${item.imageUrl}`}
                                    alt={item.name}
                                    style={{
                                        height: "260px",
                                        objectFit: "cover"
                                    }}
                                />

                                <div className="card-body">

                                    <h5 className="fw-bold">{item.name}</h5>
                                    <p className="text-muted">{item.description}</p>

                                    <h5 className="text-danger fw-bold">
                                        {item.price?.toLocaleString()}đ
                                    </h5>

                                    <div className="mt-3">
                                        <span className="badge bg-dark me-2">{item.skinType}</span>
                                        <span className="badge bg-primary me-2">{item.concern}</span>
                                        <span className="badge bg-success">{item.priceRange}</span>
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

export default BeautyMatchPage;