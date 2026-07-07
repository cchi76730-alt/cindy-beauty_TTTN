import {
    BrowserRouter,
    Routes,
    Route,
    Outlet
} from "react-router-dom";


// =========================
// USER PAGES
// =========================

import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CheckoutPage from "./pages/CheckoutPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import MyMessagesPage from "./pages/MyMessagesPage";
import PromotionPage from "./pages/PromotionPage";
import FlashSalePage from "./pages/FlashSalePage";
import BrandsPage from "./pages/BrandsPage";
import BeautyBlogPage from "./pages/BeautyBlogPage";
import StoresPage from "./pages/StoresPage";
import PromotionDetailPage from "./pages/PromotionDetailPage";
import BeautyMatchPage from "./pages/BeautyMatchPage";


// =========================
// USER COMPONENTS
// =========================

import Header from "./components/Header";
import Footer from "./components/Footer";
import BeautyMatchWidget from "./components/BeautyMatchWidget";
import CustomerSupportWidget from "./components/CustomerSupportWidget";
import UserProtectedRoute
from "./components/UserProtectedRoute";


// =========================
// ADMIN PAGES
// =========================

import AdminLayout from "./admin/layouts/AdminLayout";
import DashboardPage from "./admin/pages/DashboardPage";

import AdminAuthPage
from "./admin/pages/AdminAuthPage";

import AdminProtectedRoute
from "./admin/components/AdminProtectedRoute";

import AdminProductPage
from "./admin/pages/Product/ProductPage";

import OrderListPage
from "./admin/pages/Orders/OrderListPage";

import AdminMessagesPage
from "./admin/pages/Messages/AdminMessagesPage";

import CustomerPage
from "./admin/pages/Customers/CustomerPage";

import BrandListPage
from "./admin/pages/Brand/BrandListPage";

import CreateBrandPage
from "./admin/pages/Brand/CreateBrandPage";

import EditBrandPage
from "./admin/pages/Brand/EditBrandPage";

import ReviewListPage
from "./admin/pages/Reviews/ReviewListPage";

import AdminInventoryPage
from "./admin/pages/Inventory/AdminInventoryPage";

import AdminEmployeesPage
from "./admin/pages/Employees/AdminEmployeesPage";

import AdminAttendancePage
from "./admin/pages/Attendance/AdminAttendancePage";

import ForgotPasswordPage from "./pages/ForgotPasswordPage";



// =========================
// USER LAYOUT
// =========================

function UserLayout() {
    return (
        <>
            <Header />

            <div className="mt-4">
                <Outlet />
            </div>

            <BeautyMatchWidget />

            <CustomerSupportWidget />

            <Footer />
        </>
    );
}


// =========================
// APP
// =========================

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* ========================= */}
                {/* USER ROUTES */}
                {/* ========================= */}

                <Route
                    path="/"
                    element={<UserLayout />}
                >
                    <Route
                        index
                        element={<HomePage />}
                    />

                    <Route
                        path="products"
                        element={<ProductPage />}
                    />

                    <Route
                        path="product/:id"
                        element={<ProductDetailPage />}
                    />

                    <Route
                        path="cart"
                        element={<CartPage />}
                    />

                    <Route
                        path="login"
                        element={<LoginPage />}
                    />

                    <Route
    path="forgot-password"
    element={<ForgotPasswordPage />}
/>

                    <Route
    path="checkout"
    element={
        <UserProtectedRoute>
            <CheckoutPage />
        </UserProtectedRoute>
    }
/>

                    <Route
    path="my-orders"
    element={
        <UserProtectedRoute>
            <MyOrdersPage />
        </UserProtectedRoute>
    }
/>
                    <Route
    path="my-messages"
    element={
        <UserProtectedRoute>
            <MyMessagesPage />
        </UserProtectedRoute>
    }
/>

                    <Route
                        path="promotion"
                        element={<PromotionPage />}
                    />

                    <Route
                        path="flash-sale"
                        element={<FlashSalePage />}
                    />

                    <Route
                        path="brands"
                        element={<BrandsPage />}
                    />

                    <Route
                        path="beauty-blog"
                        element={<BeautyBlogPage />}
                    />

                    <Route
                        path="stores"
                        element={<StoresPage />}
                    />

                    <Route
                        path="promotions/:id"
                        element={<PromotionDetailPage />}
                    />

                    <Route
                        path="beauty-match"
                        element={<BeautyMatchPage />}
                    />
                </Route>


                {/* ========================= */}
                {/* ADMIN AUTH */}
                {/* ========================= */}

                <Route
                    path="/admin/auth"
                    element={<AdminAuthPage />}
                />


                {/* ========================= */}
                {/* ADMIN ROUTES */}
                {/* ========================= */}

                <Route
                    path="/admin"
                    element={
                        <AdminProtectedRoute>
                            <AdminLayout />
                        </AdminProtectedRoute>
                    }
                >
                    <Route
                        index
                        element={<DashboardPage />}
                    />

                    <Route
    path="products"
    element={
        <AdminProtectedRoute allowedRoles={["Admin"]}>
            <AdminProductPage />
        </AdminProtectedRoute>
    }
/>

                    <Route
    path="orders"
    element={
        <AdminProtectedRoute allowedRoles={["Admin", "Staff"]}>
            <OrderListPage />
        </AdminProtectedRoute>
    }
/>

                    <Route
    path="customers"
    element={
        <AdminProtectedRoute allowedRoles={["Admin"]}>
            <CustomerPage />
        </AdminProtectedRoute>
    }
/>

                    <Route
    path="messages"
    element={
        <AdminProtectedRoute allowedRoles={["Admin", "Staff"]}>
            <AdminMessagesPage />
        </AdminProtectedRoute>
    }
/>

                    <Route
    path="brands"
    element={
        <AdminProtectedRoute allowedRoles={["Admin"]}>
            <BrandListPage />
        </AdminProtectedRoute>
    }
/>

<Route
    path="brands/create"
    element={
        <AdminProtectedRoute allowedRoles={["Admin"]}>
            <CreateBrandPage />
        </AdminProtectedRoute>
    }
/>

<Route
    path="brands/edit/:id"
    element={
        <AdminProtectedRoute allowedRoles={["Admin"]}>
            <EditBrandPage />
        </AdminProtectedRoute>
    }
/>

<Route
    path="reviews"
    element={
        <AdminProtectedRoute allowedRoles={["Admin", "Staff"]}>
            <ReviewListPage />
        </AdminProtectedRoute>
    }
/>

<Route
    path="inventory"
    element={
        <AdminProtectedRoute allowedRoles={["Admin", "Warehouse"]}>
            <AdminInventoryPage />
        </AdminProtectedRoute>
    }
/>

<Route
    path="employees"
    element={
        <AdminProtectedRoute allowedRoles={["Admin"]}>
            <AdminEmployeesPage />
        </AdminProtectedRoute>
    }
/>

<Route
    path="attendance"
    element={
        <AdminProtectedRoute allowedRoles={["Admin", "Staff", "Warehouse"]}>
            <AdminAttendancePage />
        </AdminProtectedRoute>
    }
/>


                </Route>

            </Routes>
        </BrowserRouter>
    );
}

export default App;