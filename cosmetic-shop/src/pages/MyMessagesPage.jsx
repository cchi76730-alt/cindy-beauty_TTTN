import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function MyMessagesPage() {
    const navigate = useNavigate();

    const currentUser = JSON.parse(
        localStorage.getItem("currentUser")
    );

    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messageText, setMessageText] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadConversations();
    }, []);

    const getCustomerName = () => {
        return (
            currentUser?.username ||
            currentUser?.fullName ||
            currentUser?.name ||
            currentUser?.email ||
            "Khách hàng"
        );
    };

    const loadConversations = async () => {
        if (!currentUser) {
            toast.warning("Vui lòng đăng nhập để xem tin nhắn");
            navigate("/login");
            return;
        }

        const email = currentUser.email || "";
        const phone = currentUser.phone || "";

        try {
            const res = await fetch(
                `https://localhost:7019/api/conversations/customer?email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`
            );

            if (!res.ok) {
                const text = await res.text();
                toast.error(text || "Không tải được tin nhắn");
                return;
            }

            const data = await res.json();

            setConversations(data);

            if (data.length > 0) {
                setSelectedConversation(prev => {
                    if (!prev) return data[0];

                    return data.find(x => x.id === prev.id) || data[0];
                });
            }
        } catch (err) {
            console.log(err);
            toast.error("Lỗi kết nối API");
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async () => {
        if (!selectedConversation) {
            toast.error("Chưa chọn cuộc trò chuyện");
            return;
        }

        if (!messageText.trim()) {
            toast.error("Nhập nội dung tin nhắn");
            return;
        }

        const payload = {
            senderType: "customer",
            content: messageText.trim()
        };

        try {
            const res = await fetch(
                `https://localhost:7019/api/conversations/${selectedConversation.id}/messages`,
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

            setMessageText("");
            await loadConversations();
        } catch (err) {
            console.log(err);
            toast.error("Lỗi kết nối API");
        }
    };

    const getLastMessage = (conversation) => {
        const list = conversation.messages || [];

        if (list.length === 0) return "";

        return list[list.length - 1].content;
    };

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-danger" />
            </div>
        );
    }

    return (
        <div
            style={{
                background: "#f5f5f5",
                minHeight: "100vh",
                padding: "30px 0"
            }}
        >
            <div className="container">
                <h2 className="fw-bold mb-4">
                    Tin nhắn của tôi
                </h2>

                <div
                    className="row bg-white shadow-sm"
                    style={{
                        minHeight: "75vh",
                        borderRadius: "16px",
                        overflow: "hidden"
                    }}
                >
                    <div
                        className="col-md-4 border-end p-0"
                        style={{
                            maxHeight: "75vh",
                            overflowY: "auto"
                        }}
                    >
                        <div className="p-3 border-bottom fw-bold">
                            CindyBeauty Shop
                        </div>

                        {conversations.length === 0 ? (
                            <div className="p-4 text-muted">
                                Bạn chưa có tin nhắn nào.
                            </div>
                        ) : (
                            conversations.map(conversation => (
                                <div
                                    key={conversation.id}
                                    onClick={() =>
                                        setSelectedConversation(conversation)
                                    }
                                    className="p-3 border-bottom"
                                    style={{
                                        cursor: "pointer",
                                        background:
                                            selectedConversation?.id === conversation.id
                                                ? "#fff0f3"
                                                : "#fff"
                                    }}
                                >
                                    <div className="fw-bold">
                                        CindyBeauty Shop
                                    </div>

                                    {conversation.productName && (
                                        <div className="small text-danger">
                                            {conversation.productName}
                                        </div>
                                    )}

                                    <div
                                        className="small text-muted"
                                        style={{
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis"
                                        }}
                                    >
                                        {getLastMessage(conversation)}
                                    </div>

                                    <div className="small text-secondary mt-1">
                                        {new Date(conversation.updatedAt)
                                            .toLocaleString()}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="col-md-8 p-0 d-flex flex-column">
                        {!selectedConversation ? (
                            <div className="p-5 text-center text-muted">
                                Chọn một cuộc trò chuyện
                            </div>
                        ) : (
                            <>
                                <div className="p-3 border-bottom">
                                    <div className="fw-bold">
                                        CindyBeauty Shop
                                    </div>

                                    <div className="small text-muted">
                                        Xin chào {getCustomerName()}
                                    </div>

                                    {selectedConversation.productName && (
                                        <div className="small text-danger">
                                            Sản phẩm: {selectedConversation.productName}
                                        </div>
                                    )}
                                </div>

                                <div
                                    className="flex-grow-1 p-4"
                                    style={{
                                        background: "#f5f5f5",
                                        overflowY: "auto",
                                        maxHeight: "55vh"
                                    }}
                                >
                                    {selectedConversation.messages?.map(message => (
                                        <div
                                            key={message.id}
                                            className="d-flex mb-3"
                                            style={{
                                                justifyContent:
                                                    message.senderType === "customer"
                                                        ? "flex-end"
                                                        : "flex-start"
                                            }}
                                        >
                                            <div
                                                style={{
                                                    maxWidth: "70%",
                                                    padding: "12px 16px",
                                                    borderRadius: "18px",
                                                    background:
                                                        message.senderType === "customer"
                                                            ? "#d7fbe8"
                                                            : "#fff",
                                                    boxShadow:
                                                        "0 2px 8px rgba(0,0,0,0.08)"
                                                }}
                                            >
                                                <div>
                                                    {message.content}
                                                </div>

                                                <div
                                                    className="small text-muted mt-1 text-end"
                                                    style={{
                                                        fontSize: "12px"
                                                    }}
                                                >
                                                    {new Date(message.createdAt)
                                                        .toLocaleTimeString([], {
                                                            hour: "2-digit",
                                                            minute: "2-digit"
                                                        })}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-3 border-top bg-white">
                                    <div className="d-flex gap-2">
                                        <input
                                            className="form-control"
                                            placeholder="Nhập tin nhắn..."
                                            value={messageText}
                                            onChange={(e) =>
                                                setMessageText(e.target.value)
                                            }
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    sendMessage();
                                                }
                                            }}
                                        />

                                        <button
                                            className="btn btn-danger px-4"
                                            onClick={sendMessage}
                                        >
                                            Gửi
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyMessagesPage;