import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import AdminHeader from "../components/AdminHeader";

function AdminLayout() {
    return (
        <div
            className="d-flex"
            style={{
                height: "100vh",
                overflow: "hidden"
            }}
        >
            <div
                style={{
                    width: "270px",
                    height: "100vh",
                    overflow: "hidden",
                    flexShrink: 0
                }}
            >
                <Sidebar />
            </div>

            <div
                className="flex-grow-1 d-flex flex-column"
                style={{
                    background: "#f5f6fa",
                    height: "100vh",
                    overflow: "hidden"
                }}
            >
                <AdminHeader />

                <main
                    className="p-4"
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        overflowX: "hidden"
                    }}
                >
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;