import React, { useState } from "react";
import { Form, Button, message } from "antd";
import { MailOutlined, SafetyOutlined, CheckCircleOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import FormInput from "../../@crema/core/Form/FormInput";
import config from "../../config/config";
import { URL } from "../../config/apiUrl";
import "../Auth/Auth.css";
import axiosClient from "../../api/axiosClient";

interface ForgotPasswordFormValues {
    email: string;
}

const ForgotPassword: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [emailSent, setEmailSent] = useState("");

    const onFinish = async (values: ForgotPasswordFormValues) => {
        setLoading(true);
        try {
            // Call API
            try {
                await axiosClient.post(`${URL}/auth/forgot-password`, values);
            } catch (apiErr) {
                console.log("Forgot password API call:", apiErr);
            }

            setEmailSent(values.email);
            setSubmitted(true);
            message.success({
                content: `Yêu cầu khôi phục đã được gửi tới email ${values.email}!`,
                icon: <CheckCircleOutlined />,
                duration: 4,
            });
        } catch (err: any) {
            message.error(typeof err === "string" ? err : err.message || "Gửi yêu cầu thất bại. Vui lòng thử lại!");
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
                    <h1 className="auth-title">Quên Mật Khẩu</h1>
                    <p className="auth-subtitle">
                        {submitted
                            ? `Hướng dẫn đặt lại mật khẩu đã được gửi tới ${emailSent}`
                            : "Vui lòng nhập email tài khoản của bạn để nhận liên kết đặt lại mật khẩu"}
                    </p>
                </div>

                {!submitted ? (
                    /* Forgot Password Form - Email Input using core FormInput component */
                    <Form
                        name="forgot_password_form"
                        className="auth-form"
                        layout="vertical"
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        {/* Email Input from @crema/core/Form/FormInput */}
                        <FormInput
                            fieldName="email"
                            label="Địa chỉ Email"
                            prefix={<MailOutlined />}
                            placeholder="name@example.com"
                            size="large"
                            rules={[
                                { required: true, message: "Vui lòng nhập địa chỉ Email của bạn!" },
                                { type: "email", message: "Email không đúng định dạng!" },
                            ]}
                        />

                        {/* Submit Button */}
                        <Form.Item className="auth-submit-item-with-top">
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="auth-submit-btn"
                                loading={loading}
                                block
                            >
                                Gửi Yêu Cầu
                            </Button>
                        </Form.Item>
                    </Form>
                ) : (
                    /* Success State */
                    <div className="auth-fade-in auth-success-box">
                        <div className="auth-success-icon">
                            <CheckCircleOutlined />
                        </div>
                        <p className="auth-success-description">
                            Vui lòng kiểm tra hộp thư đến (và cả thư mục Spam) của email <strong>{emailSent}</strong> để tiến hành đổi mật khẩu mới.
                        </p>
                        <Button
                            type="primary"
                            className="auth-submit-btn"
                            onClick={() => navigate(`/${config.routes.LOGIN}`)}
                            block
                        >
                            Quay Lại Đăng Nhập
                        </Button>
                    </div>
                )}

                {/* Back to Login Link via <a> tag */}
                <div className="auth-footer">
                    <span>Nhớ lại mật khẩu?</span>
                    <a
                        href={`/${config.routes.LOGIN}`}
                        className="auth-footer-link"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate(`/${config.routes.LOGIN}`);
                        }}
                    >
                        <ArrowLeftOutlined className="auth-footer-icon" />
                        Quay lại Đăng nhập
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
