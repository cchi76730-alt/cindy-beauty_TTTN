import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage({
  onClose,
  onLoginSuccess,
}) {

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  const [isSubmitting, setIsSubmitting] = useState(false);


  const [loginData, setLoginData] = useState({
    identifier: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    gender: "male",
    year: "",
    month: "",
    day: "",
    receiveEmail: false,
    agreeTerms: false,
  });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    const identifier = loginData.identifier.trim();
    const password = loginData.password.trim();

    if (!identifier || !password) {
      alert("Vui lòng nhập đầy đủ email/số điện thoại và mật khẩu");
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await fetch(
        "https://localhost:7019/api/Auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            identifier,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Sai tài khoản hoặc mật khẩu");
        return;
      }

      localStorage.setItem("currentUser", JSON.stringify(data.user));
      localStorage.setItem("isLoggedIn", "true");

      alert("Đăng nhập thành công");

      if (onLoginSuccess) {
        onLoginSuccess(data.user);
      }

      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error(error);
      alert("Không kết nối được server");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    const fullName = registerData.fullName.trim();
    const phone = registerData.phone.trim();
    const email = registerData.email.trim().toLowerCase();
    const password = registerData.password.trim();

    if (!fullName || !phone || !email || !password) {
      alert("Vui lòng điền đầy đủ các trường bắt buộc (*)");
      return;
    }

    if (password.length < 6 || password.length > 32) {
      alert("Mật khẩu phải từ 6 đến 32 ký tự");
      return;
    }

    if (!registerData.agreeTerms) {
      alert("Bạn cần đồng ý với điều khoản sử dụng!");
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await fetch(
        "https://localhost:7019/api/Auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName,
            phone,
            email,
            password,
            gender: registerData.gender,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Đăng ký thất bại");
        return;
      }

      alert("Đăng ký thành công");

      setActiveTab("login");

      setLoginData({
        identifier: email,
        password: "",
      });

      setRegisterData({
        fullName: "",
        phone: "",
        email: "",
        password: "",
        gender: "male",
        year: "",
        month: "",
        day: "",
        receiveEmail: false,
        agreeTerms: false,
      });
    } catch (error) {
      console.error(error);
      alert("Không kết nối được server");
    } finally {
      setIsSubmitting(false);
    }
  };


  const years = Array.from(
    { length: 100 },
    (_, i) => new Date().getFullYear() - i
  );

  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div
      style={styles.overlay}
      onClick={() => onClose && onClose()}
    >
      <div
        style={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          style={styles.closeBtn}
          onClick={() => onClose && onClose()}
        >
          ✕
        </button>

        <div style={styles.tabs}>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === "login"
                ? styles.tabActive
                : styles.tabInactive),
            }}
            onClick={() => setActiveTab("login")}
          >
            ĐĂNG NHẬP
          </button>

          <button
            style={{
              ...styles.tab,
              ...(activeTab === "register"
                ? styles.tabActive
                : styles.tabInactive),
            }}
            onClick={() => setActiveTab("register")}
          >
            TẠO TÀI KHOẢN
          </button>
        </div>

        {activeTab === "login" && (
          <form style={styles.formContainer} onSubmit={handleLoginSubmit}>
            <input
              style={styles.input}
              type="text"
              placeholder="Nhập Email hoặc Số điện thoại"
              value={loginData.identifier}
              onChange={(e) =>
                setLoginData({
                  ...loginData,
                  identifier: e.target.value,
                })
              }
            />

            <input
              style={styles.input}
              type="password"
              placeholder="Nhập mật khẩu"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({
                  ...loginData,
                  password: e.target.value,
                })
              }
            />

            <p style={styles.forgotPassword}>
              Quên mật khẩu? Nhấn vào{" "}
              <span
                style={styles.link}
                onClick={() => navigate("/forgot-password")}
              >
                đây
              </span>
            </p>

            <button
              style={{
                ...styles.submitBtn,
                ...(isSubmitting ? styles.submitBtnDisabled : {}),
              }}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang xử lý..." : "Đăng nhập"}
            </button>
          </form>
        )}


        {activeTab === "register" && (
          <form style={styles.formContainer} onSubmit={handleRegisterSubmit}>
            <input
              style={styles.input}
              type="text"
              placeholder="Họ và tên *"
              value={registerData.fullName}
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  fullName: e.target.value,
                })
              }
            />

            <input
              style={styles.input}
              type="tel"
              placeholder="Số điện thoại *"
              value={registerData.phone}
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  phone: e.target.value,
                })
              }
            />

            <input
              style={styles.input}
              type="email"
              placeholder="Email *"
              value={registerData.email}
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  email: e.target.value,
                })
              }
            />

            <input
              style={styles.input}
              type="password"
              placeholder="Nhập mật khẩu từ 6 - 32 ký tự *"
              value={registerData.password}
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  password: e.target.value,
                })
              }
            />

            <div style={styles.genderRow}>
              {[
                { value: "male", label: "Nam" },
                { value: "female", label: "Nữ" },
                {
                  value: "other",
                  label: "Không xác định",
                },
              ].map((g) => (
                <label
                  key={g.value}
                  style={styles.radioLabel}
                >
                  <input
                    type="radio"
                    name="gender"
                    value={g.value}
                    checked={
                      registerData.gender === g.value
                    }
                    onChange={() =>
                      setRegisterData({
                        ...registerData,
                        gender: g.value,
                      })
                    }
                    style={styles.radioInput}
                  />
                  {g.label}
                </label>
              ))}
            </div>

            <div style={styles.birthdayRow}>
              <select
                style={styles.select}
                value={registerData.year}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    year: e.target.value,
                  })
                }
              >
                <option value="">Năm</option>

                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>

              <select
                style={styles.select}
                value={registerData.month}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    month: e.target.value,
                  })
                }
              >
                <option value="">Tháng</option>

                {months.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>

              <select
                style={styles.select}
                value={registerData.day}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    day: e.target.value,
                  })
                }
              >
                <option value="">Ngày</option>

                {days.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={registerData.receiveEmail}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    receiveEmail:
                      e.target.checked,
                  })
                }
                style={styles.checkbox}
              />

              Nhận thông tin khuyến mãi qua E-mail
            </label>

            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={registerData.agreeTerms}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    agreeTerms: e.target.checked,
                  })
                }
                style={styles.checkbox}
              />

              <span>
                Khi bạn nhấn Đăng ký, bạn đã đồng ý
                thực hiện mọi giao dịch mua bán theo{" "}
                <span style={styles.link}>
                  điều kiện sử dụng và chính sách
                  của Cocolux
                </span>
              </span>
            </label>

            <button
              style={{
                ...styles.submitBtn,
                ...(isSubmitting ? styles.submitBtnDisabled : {}),
              }}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang xử lý..." : "Đăng ký"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },

  modal: {
    position: "relative",
    backgroundColor: "#fff",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "480px",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  },

  closeBtn: {
    position: "absolute",
    top: "12px",
    right: "16px",
    background: "none",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    color: "#555",
    zIndex: 10,
    lineHeight: 1,
  },

  tabs: {
    display: "flex",
    borderRadius: "12px 12px 0 0",
    overflow: "hidden",
  },

  tab: {
    flex: 1,
    padding: "18px 0",
    border: "none",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "700",
    letterSpacing: "0.5px",
  },

  tabActive: {
    background:
      "linear-gradient(135deg, #a78bfa, #f472b6)",
    color: "#fff",
  },

  tabInactive: {
    background: "#f5f5f5",
    color: "#555",
  },

  formContainer: {
    padding: "24px 28px 28px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  input: {
    width: "100%",
    padding: "14px 16px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    color: "#333",
    backgroundColor: "#fafafa",
  },

  forgotPassword: {
    fontSize: "14px",
    color: "#444",
    margin: "0",
  },

  link: {
    color: "#5b9cf6",
    cursor: "pointer",
    textDecoration: "underline",
  },

  submitBtn: {
    width: "100%",
    padding: "15px",
    background:
      "linear-gradient(135deg, #a78bfa, #f472b6)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },

  submitBtnDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },

  genderRow: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    flexWrap: "wrap",
  },

  radioLabel: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "14px",
    color: "#333",
    cursor: "pointer",
  },

  radioInput: {
    accentColor: "#f472b6",
  },

  birthdayRow: {
    display: "flex",
    gap: "10px",
  },

  select: {
    flex: 1,
    padding: "12px 10px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "14px",
    backgroundColor: "#fafafa",
  },

  checkboxLabel: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    fontSize: "13px",
    color: "#444",
    lineHeight: "1.5",
  },

  checkbox: {
    accentColor: "#f472b6",
    marginTop: "2px",
  },
};