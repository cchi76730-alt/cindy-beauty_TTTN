import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import ProductDetailPage from "./pages/ProductDetailPage";

import Header from "./components/Header";
import Footer from "./components/Footer";

import CheckoutPage from "./pages/CheckoutPage";
import MyOrdersPage from "./pages/MyOrdersPage";

import PromotionPage from "./pages/PromotionPage";
import FlashSalePage from "./pages/FlashSalePage";
import BrandsPage from "./pages/BrandsPage";
import BeautyBlogPage from "./pages/BeautyBlogPage";
import StoresPage from "./pages/StoresPage";

import PromotionDetailPage from "./pages/PromotionDetailPage";

function App() {

    return (

        <BrowserRouter>

            <Header />

            <div className="mt-4">

                <Routes>

                    <Route
                        path="/"
                        element={<HomePage />}
                    />

                    <Route
                        path="/products"
                        element={<ProductPage />}
                    />

                    <Route
                        path="/product/:id"
                        element={<ProductDetailPage />}
                    />

                    <Route
                        path="/cart"
                        element={<CartPage />}
                    />

                    <Route
                        path="/login"
                        element={<LoginPage />}
                    />

                    <Route
                        path="/checkout"
                        element={<CheckoutPage />}
                    />

                    <Route
                        path="/my-orders"
                        element={<MyOrdersPage />}
                    />

                    <Route
                        path="/promotion"
                        element={<PromotionPage />}
                    />

                    <Route
                        path="/flash-sale"
                        element={<FlashSalePage />}
                    />

                    <Route
                        path="/brands"
                        element={<BrandsPage />}
                    />

                    <Route
                        path="/beauty-blog"
                        element={<BeautyBlogPage />}
                    />

                    <Route
                        path="/stores"
                        element={<StoresPage />}
                    />

                    <Route
                        path="/promotions/:id"
                        element={<PromotionDetailPage />}
                    />

                </Routes>

            </div>

            <Footer />

        </BrowserRouter>

    );
}

export default App;