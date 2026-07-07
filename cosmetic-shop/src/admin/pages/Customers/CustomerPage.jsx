import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function CustomerPage() {
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        try {
            const res = await fetch(
                "https://localhost:7019/api/admin/customers"
            );

            if (!res.ok) {
                toast.error("Không tải được khách hàng");
                return;
            }

            const data = await res.json();
            setCustomers(data);
        } catch (err) {
            console.log(err);
            toast.error("Lỗi kết nối API");
        } finally {
            setLoading(false);
        }
    };

    const filteredCustomers = customers.filter(c =>
        c.customerName?.toLowerCase().includes(search.toLowerCase()) ||
        c.phone?.includes(search) ||
        c.email?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-danger" />
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1">
                        Quản lý khách hàng
                    </h2>

                    <div className="text-muted">
                        Danh sách khách hàng đã đặt hàng
                    </div>
                </div>

                <div className="fw-bold text-danger">
                    Tổng: {filteredCustomers.length} khách hàng
                </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-body">
                    <input
                        className="form-control"
                        placeholder="Tìm theo tên, số điện thoại, email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4">
                <div className="table-responsive">
                    <table className="table align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Khách hàng</th>
                                <th>Số điện thoại</th>
                                <th>Email</th>
                                <th>Địa chỉ gần nhất</th>
                                <th>Đơn hàng</th>
                                <th>Tổng chi tiêu</th>
                                <th>Lần mua gần nhất</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredCustomers.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="text-center py-5 text-muted"
                                    >
                                        Không có khách hàng
                                    </td>
                                </tr>
                            ) : (
                                filteredCustomers.map(customer => (
                                    <tr key={customer.id}>
                                        <td className="fw-bold">
                                            {customer.customerName}
                                        </td>

                                        <td>{customer.phone}</td>

                                        <td>
                                            {customer.email || "Chưa có"}
                                        </td>

                                        <td
                                            style={{
                                                maxWidth: "260px"
                                            }}
                                        >
                                            {customer.address}
                                        </td>

                                        <td>
                                            <span className="badge bg-primary">
                                                {customer.totalOrders}
                                            </span>
                                        </td>

                                        <td className="fw-bold text-danger">
                                            {customer.totalSpent?.toLocaleString()}đ
                                        </td>

                                        <td>
                                            {customer.latestOrderDate
                                                ? new Date(customer.latestOrderDate)
                                                    .toLocaleString()
                                                : ""}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default CustomerPage;