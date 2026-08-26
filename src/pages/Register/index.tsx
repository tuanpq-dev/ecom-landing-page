import React, { useState } from "react";
import { Form, Button, Checkbox, message } from "antd";
import {
    UserOutlined,
    MailOutlined,
    LockOutlined,
    PhoneOutlined,
    UserAddOutlined,
    CheckCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import FormInput from "../../@crema/core/Form/FormInput";
import config from "../../config/config";
import { URL } from "../../config/apiUrl";
import axiosClient from "../../api/axiosClient";
import "../Auth/Auth.css";

interface RegisterFormValues {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    agreeTerms: boolean;
}

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [passwordValue, setPasswordValue] = useState("");

    // Calculate password strength indicator
    const getPasswordStrength = (pass: string) => {
        if (!pass) return "";
        if (pass.length < 6) return "weak";
        const hasNumber = /\d/.test(pass);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
        if (pass.length >= 8 && (hasNumber || hasSpecial)) {
            return pass.length >= 10 && hasNumber && hasSpecial ? "strong" : "medium";
        }
        return "weak";
    };

    const strength = getPasswordStrength(passwordValue);

    // Handle Form Submit
    const onFinish = async (values: RegisterFormValues) => {
        setLoading(true);
        try {
            const res: any = await axiosClient.post(`${URL}/auth/register`, {
                email: values.email,
                password: values.password,
                name: values.fullName,
            });

            message.success({
                content: res?.message || "Đăng ký tài khoản thành công! Bạn có thể đăng nhập ngay bây giờ.",
                icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
                duration: 4,
            });
            navigate(`/${config.routes.LOGIN}`);
        } catch (err: any) {
            message.error(typeof err === "string" ? err : err.message || "Đăng ký thất bại. Vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page-container" style={{ flexDirection: "column" }}>
            {/* Top Brand Logo */}
            <div
                onClick={() => navigate("/")}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    cursor: "pointer",
                    marginBottom: 24,
                }}
            >
                <img src="/favicon.svg" alt="Essential" style={{ width: 44, height: 44 }} />
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: 22, fontWeight: 800, color: "#22242a", lineHeight: 1.2 }}>Essential</span>
                    <span style={{ fontSize: 11, color: "#c89968", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Thời trang cao cấp</span>
                </div>
            </div>

            <div className="auth-card auth-card-wide">
                {/* Header */}
                <div className="auth-header">
                    <div className="auth-badge">
                        <UserAddOutlined />
                        <span>Tạo tài khoản mới</span>
                    </div>
                    <h1 className="auth-title">Đăng Ký Thành Viên</h1>
                    <p className="auth-subtitle">Trở thành thành viên của Essential để nhận ưu đãi hấp dẫn</p>
                </div>

                {/* Register Form */}
                <Form
                    name="register_form"
                    className="auth-form"
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    {/* Full Name */}
                    <FormInput
                        fieldName="fullName"
                        label="Họ và tên"
                        prefix={<UserOutlined />}
                        placeholder="Nguyễn Văn A"
                        size="large"
                        rules={[
                            { required: true, message: "Vui lòng nhập họ và tên!" },
                            { min: 2, message: "Họ tên phải chứa ít nhất 2 ký tự!" }
                        ]}
                    />

                    {/* Email & Phone side by side */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <FormInput
                            fieldName="email"
                            label="Địa chỉ Email"
                            prefix={<MailOutlined />}
                            placeholder="name@example.com"
                            size="large"
                            rules={[
                                { required: true, message: "Vui lòng nhập Email!" },
                                { type: "email", message: "Email không hợp lệ!" }
                            ]}
                        />

                        <FormInput
                            fieldName="phone"
                            label="Số điện thoại"
                            prefix={<PhoneOutlined />}
                            placeholder="0912345678"
                            size="large"
                            rules={[
                                { required: true, message: "Vui lòng nhập số điện thoại!" },
                                { pattern: /^[0-9]{10,11}$/, message: "Số điện thoại gồm 10-11 chữ số!" }
                            ]}
                        />
                    </div>

                    {/* Password */}
                    <FormInput
                        fieldName="password"
                        label="Mật khẩu"
                        isPassword
                        prefix={<LockOutlined />}
                        placeholder="Tạo mật khẩu an toàn (tối thiểu 6 ký tự)"
                        size="large"
                        hasFeedback
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasswordValue(e.target.value)}
                        rules={[
                            { required: true, message: "Vui lòng nhập mật khẩu!" },
                            { min: 6, message: "Mật khẩu tối thiểu 6 ký tự!" }
                        ]}
                    />

                    {/* Password Strength Indicator */}
                    {passwordValue && (
                        <div style={{ marginTop: -12, marginBottom: 16 }}>
                            <div className="password-strength-bar">
                                <div className={`password-strength-fill ${strength}`} />
                            </div>
                            <div style={{ fontSize: 11, color: "#888", marginTop: 4, display: "flex", justifyContent: "space-between" }}>
                                <span>Độ mạnh mật khẩu:</span>
                                <span style={{ fontWeight: 600, color: strength === "strong" ? "#52c41a" : strength === "medium" ? "#faad14" : "#ff4d4f" }}>
                                    {strength === "strong" ? "Rất mạnh" : strength === "medium" ? "Trung bình" : "Yếu"}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Confirm Password */}
                    <FormInput
                        fieldName="confirmPassword"
                        label="Xác nhận mật khẩu"
                        isPassword
                        prefix={<LockOutlined />}
                        placeholder="Nhập lại mật khẩu vừa đặt"
                        size="large"
                        dependencies={["password"]}
                        hasFeedback
                        rules={[
                            { required: true, message: "Vui lòng xác nhận lại mật khẩu!" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("password") === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error("Mật khẩu xác nhận không khớp!"));
                                },
                            }),
                        ]}
                    />

                    {/* Terms Agreement Checkbox */}
                    <Form.Item
                        name="agreeTerms"
                        valuePropName="checked"
                        rules={[
                            {
                                validator: (_, value) =>
                                    value
                                        ? Promise.resolve()
                                        : Promise.reject(new Error("Bạn cần đồng ý với điều khoản sử dụng!")),
                            },
                        ]}
                    >
                        <Checkbox>
                            Tôi đồng ý với{" "}
                            <span style={{ color: "#c89968", fontWeight: 600, cursor: "pointer" }}>
                                Điều khoản sử dụng
                            </span>{" "}
                            &{" "}
                            <span style={{ color: "#c89968", fontWeight: 600, cursor: "pointer" }}>
                                Chính sách bảo mật
                            </span>
                        </Checkbox>
                    </Form.Item>

                    {/* Submit Button */}
                    <Form.Item style={{ marginBottom: 0 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="auth-submit-btn"
                            loading={loading}
                            block
                        >
                            Tạo Tài Khoản
                        </Button>
                    </Form.Item>
                </Form>

                {/* Social Register Divider */}
                <div className="auth-divider">
                    <span>Hoặc đăng ký nhanh bằng</span>
                </div>

                {/* Social Buttons */}
                <div className="social-login-grid">
                    <button
                        type="button"
                        className="social-btn"
                        onClick={() => message.info("Tính năng Đăng ký nhanh với Google đang phát triển")}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.36 24 12 24z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"
                            />
                        </svg>
                        <span>Google</span>
                    </button>

                    <button
                        type="button"
                        className="social-btn"
                        onClick={() => message.info("Tính năng Đăng ký nhanh với Facebook đang phát triển")}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        <span>Facebook</span>
                    </button>
                </div>

                {/* Switch to Login */}
                <div className="auth-footer">
                    <span>Đã có tài khoản?</span>
                    <span
                        className="auth-footer-link"
                        onClick={() => navigate(`/${config.routes.LOGIN}`)}
                    >
                        Đăng nhập ngay
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Register;
