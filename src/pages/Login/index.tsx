import React, { useState, useEffect } from "react";
import { Form, Button, message } from "antd";
import { MailOutlined, LockOutlined, SafetyOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import FormInput from "../../@crema/core/Form/FormInput";
import config from "../../config/config";
import { URL } from "../../config/apiUrl";
import "../Auth/Auth.css";
import axiosClient from "../../api/axiosClient";

interface LoginFormValues {
    email: string;
    password: string;
    remember?: boolean;
}

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const userStr = params.get("user");

        if (token && userStr) {
            try {
                const user = JSON.parse(decodeURIComponent(userStr));
                localStorage.setItem("accessToken", token);
                localStorage.setItem("user", JSON.stringify(user));
                window.dispatchEvent(new Event("auth-change"));
                message.success({
                    content: `Chào mừng bạn trở lại, ${user.fullname || "khách hàng"}!`,
                    icon: <CheckCircleOutlined />,
                    duration: 3,
                });
                navigate("/");
            } catch {
                // Ignore
            }
        }
    }, [navigate]);

    const onFinish = async (values: LoginFormValues) => {
        setLoading(true);
        try {
            const response: any = await axiosClient.post(`${URL}/auth/login`, values);

            if (response.accessToken) {
                localStorage.setItem("accessToken", response.accessToken);
            }
            if (response.user) {
                localStorage.setItem("user", JSON.stringify(response.user));
            }
            window.dispatchEvent(new Event("auth-change"));

            message.success({
                content: `Chào mừng bạn trở lại, ${response.user?.fullname || "khách hàng"}!`,
                icon: <CheckCircleOutlined />,
                duration: 3,
            });

            navigate("/");
        } catch (err: any) {
            message.error(typeof err === "string" ? err : err.message || "Đăng nhập thất bại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page-container">
            {/* Top Brand Logo */}
            <div className="auth-brand" onClick={() => navigate("/")}>
                <img src="/favicon.svg" alt="Essential" className="auth-brand-logo" />
                <div className="auth-brand-text">
                    <span className="auth-brand-title">Essential</span>
                    <span className="auth-brand-subtitle">Thời trang cao cấp</span>
                </div>
            </div>

            <div className="auth-card">
                {/* Header */}
                <div className="auth-header">
                    <div className="auth-badge">
                        <SafetyOutlined />
                        <span>Bảo mật 100%</span>
                    </div>
                    <h1 className="auth-title">Đăng Nhập Tài Khoản</h1>
                    <p className="auth-subtitle">Nhập thông tin đăng nhập của bạn để tiếp tục mua sắm</p>
                </div>

                {/* Login Form */}
                <Form
                    name="login_form"
                    className="auth-form"
                    layout="vertical"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    {/* Email / Username Input */}
                    <FormInput
                        fieldName="email"
                        label="Email hoặc Tên đăng nhập"
                        prefix={<MailOutlined />}
                        placeholder="name@example.com"
                        size="large"
                        rules={[
                            { required: true, message: "Vui lòng nhập Email hoặc Tên đăng nhập!" },
                            { type: "email", message: "Email không đúng định dạng!" }
                        ]}
                    />

                    {/* Password Input */}
                    <FormInput
                        fieldName="password"
                        label="Mật khẩu"
                        isPassword
                        prefix={<LockOutlined />}
                        placeholder="••••••••"
                        size="large"
                        rules={[
                            { required: true, message: "Vui lòng nhập mật khẩu của bạn!" },
                            { min: 6, message: "Mật khẩu phải chứa ít nhất 6 ký tự!" }
                        ]}
                    />

                    {/* Forgot Password Link via <a> tag */}
                    <div className="auth-forgot-link-wrapper">
                        <a
                            href={`/${config.routes.FORGOT_PASSWORD}`}
                            className="auth-forgot-link"
                            onClick={(e) => {
                                e.preventDefault();
                                navigate(`/${config.routes.FORGOT_PASSWORD}`);
                            }}
                        >
                            Quên mật khẩu?
                        </a>
                    </div>

                    {/* Submit Button */}
                    <Form.Item className="auth-submit-item">
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="auth-submit-btn"
                            loading={loading}
                            block
                        >
                            Đăng Nhập
                        </Button>
                    </Form.Item>
                </Form>

                {/* Social Login Divider */}
                <div className="auth-divider">
                    <span>Hoặc tiếp tục với</span>
                </div>

                {/* Social Buttons */}
                <div className="social-login-grid">
                    <button
                        type="button"
                        className="social-btn"
                        onClick={() => {
                            window.location.href = `${URL}/auth/google`;
                        }}
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
                        onClick={() => message.info("Tính năng Đăng nhập với Facebook đang được phát triển")}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        <span>Facebook</span>
                    </button>
                </div>

                {/* Switch to Register */}
                <div className="auth-footer">
                    <span>Bạn chưa có tài khoản?</span>
                    <a
                        href={`/${config.routes.REGISTER}`}
                        className="auth-footer-link"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate(`/${config.routes.REGISTER}`);
                        }}
                    >
                        Đăng ký ngay
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Login;
