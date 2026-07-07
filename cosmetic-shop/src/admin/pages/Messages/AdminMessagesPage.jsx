import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function AdminMessagesPage() {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [replyText, setReplyText] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadConversations();
    }, []);

    const normalizeConversations = (data) => {
        if (Array.isArray(data)) {
            return data;
        }

        return data?.conversations || [];
    };

    const markAllAsRead = async () => {
        try {
            await fetch(
                "https://localhost:7019/api/conversations/admin/read-all",
                {
                    method: "PUT"
                }
            );
        } catch (err) {
            console.log(err);
        }
    };

    const markConversationAsRead = async (conversationId) => {
        try {
            await fetch(
                `https://localhost:7019/api/conversations/admin/${conversationId}/read`,
                {
                    method: "PUT"
                }
            );
        } catch (err) {
            console.log(err);
        }
    };

    const loadConversations = async () => {
        try {
            const res = await fetch(
                "https://localhost:7019/api/conversations/admin"
            );

            if (!res.ok) {
                toast.error("Không tải được tin nhắn");
                return;
            }

            const data = await res.json();
            const list = normalizeConversations(data);

            setConversations(list);

            if (list.length > 0 && !selectedConversation) {
                setSelectedConversation(list[0]);
                await markConversationAsRead(list[0].id);
            }

            await markAllAsRead();
        } catch (err) {
            console.log(err);
            toast.error("Lỗi kết nối API");
        } finally {
            setLoading(false);
        }
    };

    const refreshSelectedConversation = async (conversationId) => {
        const res = await fetch(
            "https://localhost:7019/api/conversations/admin"
        );

        if (!res.ok) return;

        const data = await res.json();
        const list = normalizeConversations(data);

        setConversations(list);

        const updatedConversation = list.find(
            x => x.id === conversationId
        );

        setSelectedConversation(updatedConversation || null);
    };

    const sendReply = async () => {
        if (!selectedConversation) {
            toast.error("Chưa chọn cuộc trò chuyện");
            return;
        }

        if (!replyText.trim()) {
            toast.error("Nhập nội dung phản hồi");
            return;
        }

        const payload = {
            senderType: "admin",
            content: replyText.trim()
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
                toast.error(text || "Không thể gửi phản hồi");
                return;
            }

            toast.success("Đã gửi phản hồi");

            setReplyText("");

            await refreshSelectedConversation(selectedConversation.id);
        } catch (err) {
            console.log(err);
            toast.error("Lỗi kết nối API");
        }
    };

    const handleSelectConversation = async (conversation) => {
        setSelectedConversation(conversation);
        await markConversationAsRead(conversation.id);
    };

    const getLastMessage = (conversation) => {
        const list = conversation.messages || [];

        if (list.length === 0) return "";

        return list[list.length - 1].content;
    };

    const hasUnreadCustomerMessage = (conversation) => {
        const list = conversation.messages || [];

        return list.some(
            m => m.senderType === "customer" && m.isRead === false
        );
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-danger" />
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <h2 className="fw-bold mb-4">
                Tin nhắn khách hàng
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
                    <div className="p-3 border-bottom fw-bold d-flex justify-content-between align-items-center">
                        <span>Cuộc trò chuyện</span>

                        <span className="badge bg-danger">
                            {conversations.length}
                        </span>
                    </div>

                    {conversations.length === 0 ? (
                        <div className="p-4 text-muted">
                            Chưa có tin nhắn nào
                        </div>
                    ) : (
                        conversations.map(conversation => (
                            <div
                                key={conversation.id}
                                onClick={() =>
                                    handleSelectConversation(conversation)
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
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="fw-bold">
                                        {conversation.customerName}
                                    </div>

                                    {hasUnreadCustomerMessage(conversation) && (
                                        <span className="badge bg-danger">
                                            Mới
                                        </span>
                                    )}
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
                                    {conversation.updatedAt
                                        ? new Date(conversation.updatedAt)
                                            .toLocaleString()
                                        : ""}
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
                                    {selectedConversation.customerName}
                                </div>

                                <div className="small text-muted">
                                    {selectedConversation.customerEmail || "Không có email"}
                                    {selectedConversation.customerPhone
                                        ? ` | ${selectedConversation.customerPhone}`
                                        : ""}
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
                                                message.senderType === "admin"
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
                                                    message.senderType === "admin"
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
                                                {message.createdAt
                                                    ? new Date(message.createdAt)
                                                        .toLocaleTimeString([], {
                                                            hour: "2-digit",
                                                            minute: "2-digit"
                                                        })
                                                    : ""}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-3 border-top bg-white">
                                <div className="d-flex gap-2">
                                    <input
                                        className="form-control"
                                        placeholder="Nhập phản hồi cho khách..."
                                        value={replyText}
                                        onChange={(e) =>
                                            setReplyText(e.target.value)
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                sendReply();
                                            }
                                        }}
                                    />

                                    <button
                                        className="btn btn-danger px-4"
                                        onClick={sendReply}
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
    );
}

export default AdminMessagesPage;