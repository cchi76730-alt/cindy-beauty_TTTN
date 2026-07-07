import { useState } from "react";
import { toast } from "react-toastify";

function CustomerSupportWidget() {
    const [open, setOpen] = useState(false);

    const currentUser = JSON.parse(
        localStorage.getItem("currentUser")
    );

    const [form, setForm] = useState({
        content: ""
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const getCustomerName = () => {
        return (
            currentUser?.username ||
            currentUser?.fullName ||
            currentUser?.name ||
            currentUser?.email ||
            "Khách hàng"
        );
    };

    const sendMessage = async () => {
        if (!currentUser) {
            toast.warning("Vui lòng đăng nhập để được hỗ trợ");
            return;
        }

        if (!form.content.trim()) {
            toast.error("Vui lòng nhập nội dung cần hỗ trợ");
            return;
        }

        const payload = {
            customerName: getCustomerName(),
            customerEmail: currentUser?.email || "",
            customerPhone: currentUser?.phone || "",
            content: form.content
        };

        try {
            const res = await fetch(
                "https://localhost:7019/api/conversations",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                }
            );

            if (!res.ok) {
                const text = await res.text();
                toast.error(text || "Không gửi được tin nhắn");
                return;
            }

            toast.success("Đã gửi tin nhắn cho shop");

            setForm({
                content: ""
            });

            setOpen(false);
        } catch (error) {
            console.log(error);
            toast.error("Lỗi kết nối API");
        }
    };

    return (
        <>
            <button
                onClick={() => setOpen(!open)}
                style={{
                    position: "fixed",
                    right: "24px",
                    bottom: "100px",
                    zIndex: 9999,
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    border: "none",
                    background: "#ff4d8d",
                    color: "#fff",
                    fontSize: "28px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
                }}
            >
                💬
            </button>

            {open && (
                <div
                    className="card shadow-lg border-0"
                    style={{
                        position: "fixed",
                        right: "24px",
                        bottom: "170px",
                        width: "360px",
                        zIndex: 9999,
                        borderRadius: "18px"
                    }}
                >
                    <div
                        className="card-header text-white fw-bold"
                        style={{
                            background: "#ff4d8d",
                            borderTopLeftRadius: "18px",
                            borderTopRightRadius: "18px"
                        }}
                    >
                        Hỗ trợ khách hàng
                    </div>

                    <div className="card-body">
                        {currentUser ? (
                            <div className="alert alert-light border">
                                Xin chào{" "}
                                <strong>{getCustomerName()}</strong> 👋
                                <br />
                                Shop có thể hỗ trợ gì cho bạn?
                            </div>
                        ) : (
                            <div className="alert alert-warning">
                                Vui lòng đăng nhập để gửi tin nhắn hỗ trợ.
                            </div>
                        )}

                        <textarea
                            className="form-control mb-3"
                            rows="4"
                            name="content"
                            value={form.content}
                            onChange={handleChange}
                            placeholder="Nhập nội dung bạn cần hỗ trợ..."
                            disabled={!currentUser}
                        />

                        <button
                            className="btn btn-danger w-100 fw-bold"
                            onClick={sendMessage}
                            disabled={!currentUser}
                        >
                            Gửi tin nhắn
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default CustomerSupportWidget;