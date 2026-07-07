import { useState } from "react";

import { useNavigate } from "react-router-dom";

function AdminLoginPage() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const handleLogin = (e) => {

        e.preventDefault();

        // fake admin
        if (
            email === "admin@gmail.com" &&
            password === "123456"
        ) {

            localStorage.setItem(
                "admin",
                JSON.stringify({
                    email: email,
                    role: "admin"
                })
            );

            navigate("/admin");

        } else {

            alert("Sai tài khoản hoặc mật khẩu!");
        }
    };

    return (

        <div
            className="d-flex justify-content-center align-items-center"
            style={{
                minHeight: "100vh",
                background:
                    "linear-gradient(to right, #ff758c, #ff7eb3)"
            }}
        >

            <div
                className="card shadow-lg border-0 p-5"
                style={{
                    width: "420px",
                    borderRadius: "20px"
                }}
            >

                <h2 className="fw-bold text-center mb-4">

                    Admin Login

                </h2>

                <form onSubmit={handleLogin}>

                    <div className="mb-3">

                        <label className="fw-semibold">

                            Email

                        </label>

                        <input
                            type="email"
                            className="form-control"
                            placeholder="Nhập email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                        />

                    </div>

                    <div className="mb-4">

                        <label className="fw-semibold">

                            Password

                        </label>

                        <input
                            type="password"
                            className="form-control"
                            placeholder="Nhập mật khẩu"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                        />

                    </div>

                    <button
                        className="btn btn-danger w-100 py-2 fw-bold"
                    >
                        Đăng nhập
                    </button>

                </form>

            </div>

        </div>
    );
}

export default AdminLoginPage;