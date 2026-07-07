import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPasswordPage() {
    const navigate = useNavigate();

    const [phone, setPhone] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const resetPassword = async () => {
        if (!phone.trim()) {
            alert("Vui lòng nhập số điện thoại");
            return;
        }

        if (!newPassword.trim()) {
            alert("Vui lòng nhập mật khẩu mới");
            return;
        }

        if (newPassword.length < 6) {
            alert("Mật khẩu phải từ 6 ký tự");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch(
                "https://localhost:7019/api/Auth/reset-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        phone: phone.trim(),
                        newPassword: newPassword.trim()
                    })
                }
            );

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Không thể đổi mật khẩu");
                return;
            }

            alert("Đổi mật khẩu thành công");
            navigate("/login");
        } catch (err) {
            console.log(err);
            alert("Không kết nối được server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div
                className="card mx-auto border-0 shadow"
                style={{
                    maxWidth: "450px",
                    borderRadius: "20px"
                }}
            >
                <div className="card-body p-4">
                    <h3 className="fw-bold text-center mb-3">
                        Quên mật khẩu
                    </h3>

                    <p className="text-muted text-center">
                        Nhập số điện thoại và mật khẩu mới.
                    </p>

                    <label className="form-label fw-semibold">
                        Số điện thoại
                    </label>

                    <input
                        className="form-control mb-3"
                        placeholder="Nhập số điện thoại"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />

                    <label className="form-label fw-semibold">
                        Mật khẩu mới
                    </label>

                    <input
                        type="password"
                        className="form-control mb-3"
                        placeholder="Nhập mật khẩu mới"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />

                    <button
                        className="btn btn-danger w-100 py-2 fw-bold"
                        disabled={loading}
                        onClick={resetPassword}
                    >
                        {loading ? "Đang đổi..." : "Đổi mật khẩu"}
                    </button>

                    <button
                        className="btn btn-link w-100 mt-3"
                        onClick={() => navigate("/login")}
                    >
                        Quay lại đăng nhập
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ForgotPasswordPage;