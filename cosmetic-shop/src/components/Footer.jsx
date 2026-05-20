import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="bg-dark text-light mt-5 pt-5 pb-3">
            <div className="container">
                <div className="row">

                    <div className="col-md-4 mb-4">
                        <Link to="/" className="text-decoration-none">
                            <h3 className="fw-bold text-danger">
                                Cindy Beauty
                            </h3>
                        </Link>

                        <p className="text-secondary mt-3">
                            Chuyên cung cấp mỹ phẩm chính hãng,
                            chăm sóc sắc đẹp và mang đến trải nghiệm
                            mua sắm hiện đại cho khách hàng.
                        </p>
                    </div>

                    <div className="col-md-2 mb-4">
                        <h5 className="fw-bold mb-3">Danh mục</h5>

                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <Link to="/" className="footer-link">
                                    Trang chủ
                                </Link>
                            </li>

                            <li className="mb-2">
                                <Link to="/products" className="footer-link">
                                    Sản phẩm
                                </Link>
                            </li>

                            <li className="mb-2">
                                <Link to="/cart" className="footer-link">
                                    Giỏ hàng
                                </Link>
                            </li>

                            <li className="mb-2">
                                <Link to="/login" className="footer-link">
                                    Đăng nhập
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="col-md-3 mb-4">
                        <h5 className="fw-bold mb-3">Hỗ trợ khách hàng</h5>

                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <Link to="/return-policy" className="footer-link">
                                    Chính sách đổi trả
                                </Link>
                            </li>

                            <li className="mb-2">
                                <Link to="/privacy-policy" className="footer-link">
                                    Chính sách bảo mật
                                </Link>
                            </li>

                            <li className="mb-2">
                                <Link to="/shopping-guide" className="footer-link">
                                    Hướng dẫn mua hàng
                                </Link>
                            </li>

                            <li className="mb-2">
                                <Link to="/stores" className="footer-link">
                                    Liên hệ hỗ trợ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="col-md-3 mb-4">
                        <h5 className="fw-bold mb-3">Liên hệ</h5>

                        <p className="mb-2">
                            📍 TP.HCM, Việt Nam
                        </p>

                        <p className="mb-2">
                            <a href="tel:0123456789" className="footer-link">
                                📞 0123 456 789
                            </a>
                        </p>

                        <p className="mb-2">
                            <a href="mailto:cindybeauty@gmail.com" className="footer-link">
                                ✉️ cindybeauty@gmail.com
                            </a>
                        </p>

                        <div className="d-flex gap-3 mt-3">
                            <a
    href="https://www.facebook.com/share/17XkNe6hpr/?mibextid=wwXIfr"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer-link"
                            >
                                Facebook
                            </a>

                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer-link"
                            >
                                Instagram
                            </a>
                        </div>
                    </div>
                </div>

                <hr className="border-secondary" />

                <div className="text-center text-secondary">
                    © 2026 Cindy Beauty. All rights reserved.
                </div>
            </div>

            <style>
                {`
                    .footer-link {
                        color: #adb5bd;
                        text-decoration: none;
                        transition: 0.2s;
                        cursor: pointer;
                    }

                    .footer-link:hover {
                        color: #ff4d8d;
                        padding-left: 4px;
                    }
                `}
            </style>
        </footer>
    );
}

export default Footer;