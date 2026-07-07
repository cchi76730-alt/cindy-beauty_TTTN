import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminAuthPage() {
    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(true);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const url = isLogin
            ? "https://localhost:7019/api/admin-auth/login"
            : "https://localhost:7019/api/admin-auth/register";

        const body = isLogin
            ? {
                  email,
                  password
              }
            : {
                  fullName,
                  email,
                  password
              };

        try {
            setLoading(true);

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Đăng nhập thất bại");
                return;
            }

            if (isLogin) {
                localStorage.setItem("token", data.token);

                localStorage.setItem(
                    "admin",
                    JSON.stringify(data.admin)
                );

                navigate("/admin", { replace: true });
            } else {
                alert("Đăng ký thành công");

                setIsLogin(true);
                setPassword("");
            }
        } catch (error) {
            console.log(error);
            alert("Lỗi kết nối API");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="d-flex justify-content-center align-items-center"
            style={{
                minHeight: "100vh",
                background:
                    "linear-gradient(135deg,#ff758c,#ff7eb3,#fad0c4)"
            }}
        >
            <div
                className="card border-0 shadow-lg p-5"
                style={{
                    width: "450px",
                    borderRadius: "25px"
                }}
            >
                <div className="text-center mb-4">
                    <h1 className="fw-bold text-danger">
                        CindyBeauty
                    </h1>

                    <p className="text-muted">
                        Admin Management System
                    </p>
                </div>

                <h3 className="fw-bold text-center mb-4">
                    {isLogin ? "Admin Login" : "Admin Register"}
                </h3>

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="mb-3">
                            <label className="fw-semibold mb-2">
                                Full Name
                            </label>

                            <input
                                type="text"
                                className="form-control form-control-lg"
                                placeholder="Nhập họ tên"
                                value={fullName}
                                onChange={(e) =>
                                    setFullName(e.target.value)
                                }
                            />
                        </div>
                    )}

                    <div className="mb-3">
                        <label className="fw-semibold mb-2">
                            Email
                        </label>

                        <input
                            type="email"
                            className="form-control form-control-lg"
                            placeholder="Nhập email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                        />
                    </div>

                    <div className="mb-4">
                        <label className="fw-semibold mb-2">
                            Password
                        </label>

                        <input
                            type="password"
                            className="form-control form-control-lg"
                            placeholder="Nhập mật khẩu"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-danger w-100 py-3 fw-bold"
                    >
                        {loading
                            ? "Đang xử lý..."
                            : isLogin
                                ? "Đăng nhập"
                                : "Đăng ký"}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <button
                        type="button"
                        className="btn btn-link text-decoration-none"
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setPassword("");
                        }}
                    >
                        {isLogin
                            ? "Chưa có tài khoản? Đăng ký"
                            : "Đã có tài khoản? Đăng nhập"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AdminAuthPage;