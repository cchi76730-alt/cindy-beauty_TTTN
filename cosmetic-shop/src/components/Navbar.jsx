import { Link } from "react-router-dom";

function Navbar() {

    return (

        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">

            <div className="container">

                <Link className="navbar-brand" to="/">
                    Cindybeauty Shop
                </Link>

                <ul className="navbar-nav d-flex flex-row gap-3">

                    <li className="nav-item">
                        <Link className="nav-link" to="/">
                            Trang chủ
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link" to="/products">
                            Sản phẩm
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link" to="/cart">
                            Giỏ hàng
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link" to="/login">
                            Đăng nhập
                        </Link>
                    </li>

                </ul>

            </div>

        </nav>

    );
}

export default Navbar;