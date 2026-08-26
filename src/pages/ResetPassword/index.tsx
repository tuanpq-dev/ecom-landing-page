import React, { useState } from "react";
import { Form, Button, message } from "antd";
import { LockOutlined, SafetyOutlined, CheckCircleOutlined, ArrowLeftOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router";
import FormInput from "../../@crema/core/Form/FormInput";
import config from "../../config/config";
import { URL } from "../../config/apiUrl";
import "../Auth/Auth.css";
import axiosClient from "../../api/axiosClient";

interface ResetPasswordFormValues {
    newPassword: string;
    confirmPassword: string;
}

const ResetPassword: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const onFinish = async (values: ResetPasswordFormValues) => {
        if (!token) {
            message.error("Mã khôi phục không tồn tại hoặc không hợp lệ!");
            return;
        }

        setLoading(true);
        try {
            const res: any = await axiosClient.post(`${URL}/auth/reset-password`, {
                token,
                newPassword: values.newPassword,
            });

            setSubmitted(true);
            message.success({
                content: res?.data?.message || "Đặt lại mật khẩu thành công!",
                icon: <CheckCircleOutlined />,
                duration: 4,
            });
        } catch (err: any) {
            const errMsg = err.response?.data?.message || err.message || "Đặt lại mật khẩu thất bại. Vui lòng thử lại!";
            message.error(errMsg);
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
                    <h1 className="auth-title">Đặt Lai Mật Khẩu</h1>
                    <p className="auth-subtitle">
                        Vui lòng nhập mật khẩu mới cho tài khoản của bạn
                    </p>
                </div>

                {!token ? (
                    <div className="auth-fade-in auth-success-box" style={{ textAlign: "center" }}>
                        <div className="auth-success-icon" style={{ color: "#ff4d4f" }}>
                            <ExclamationCircleOutlined />
                        </div>
                        <p className="auth-success-description">
                            Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu liên kết mới.
                        </p>
                        <Button
                            type="primary"
                            className="auth-submit-btn"
                            onClick={() => navigate(`/${config.routes.FORGOT_PASSWORD}`)}
                            block
                        >
                            Gửi lại yêu cầu
                        </Button>
                    </div>
                ) : !submitted ? (
                    <Form
                        name="reset_password"
                        layout="vertical"
                        onFinish={onFinish}
                        requiredMark={false}
                        size="large"
                        className="auth-form"
                    >
                        <FormInput
                            fieldName="newPassword"
                            label="Mật khẩu mới"
                            type="password"
                            prefix={<LockOutlined />}
                            placeholder="••••••••"
                            size="large"
                            rules={[
                                { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                                { min: 6, message: "Mật khẩu phải chứa ít nhất 6 ký tự!" },
                            ]}
                        />

                        <FormInput
                            fieldName="confirmPassword"
                            label="Xác nhận mật khẩu mới"
                            type="password"
                            prefix={<LockOutlined />}
                            placeholder="••••••••"
                            size="large"
                            rules={[
                                { required: true, message: "Vui lòng xác nhận mật khẩu mới!" },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("newPassword") === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error("Mật khẩu xác nhận không khớp!"));
                                    },
                                }),
                            ]}
                        />

                        <Form.Item className="auth-submit-item">
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="auth-submit-btn"
                                loading={loading}
                                block
                            >
                                Đổi Mật Khẩu
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
                            Mật khẩu của bạn đã được thay đổi thành công. Bạn có thể đăng nhập ngay bây giờ.
                        </p>
                        <Button
                            type="primary"
                            className="auth-submit-btn"
                            onClick={() => navigate(`/${config.routes.LOGIN}`)}
                            block
                        >
                            Đăng Nhập Ngay
                        </Button>
                    </div>
                )}

                {/* Back to Login Link */}
                <div className="auth-footer">
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

export default ResetPassword;
