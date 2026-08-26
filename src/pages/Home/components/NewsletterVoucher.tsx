import React, { useState } from "react";
import { Input, Button, message } from "antd";
import { MailOutlined, GiftOutlined } from "@ant-design/icons";

export const NewsletterVoucher: React.FC = () => {
    const [email, setEmail] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (!email || !email.includes("@")) {
            message.error("Vui lòng nhập địa chỉ email hợp lệ!");
            return;
        }
        setSubmitting(true);
        setTimeout(() => {
            setSubmitting(false);
            message.success("Đăng ký thành công! Mã Voucher giảm 10% đã được gửi đến email của bạn.");
            setEmail("");
        }, 600);
    };

    return (
        <section className="home-newsletter-section" aria-label="Đăng ký nhận ưu đãi VIP">
            <div className="home-newsletter-container">
                <div className="home-newsletter-content">
                    <div className="home-newsletter-badge">
                        <GiftOutlined style={{ marginRight: 6 }} /> ƯU ĐÃI THÀNH VIÊN VIP
                    </div>
                    <h2 className="home-newsletter-title">
                        Nhận Ngay Voucher <span style={{ color: "#c89968" }}>Giảm 10%</span> Cho Đơn Hàng Đầu Tiên
                    </h2>
                    <p className="home-newsletter-desc">
                        Đăng ký nhận thông báo để trở thành người đầu tiên cập nhật bộ sưu tập mới và mã giảm giá độc quyền dành riêng cho bạn.
                    </p>

                    <form onSubmit={handleSubmit} className="home-newsletter-form">
                        <Input
                            prefix={<MailOutlined style={{ color: "#999", marginRight: 6 }} />}
                            placeholder="Nhập địa chỉ email của bạn..."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            size="large"
                            className="home-newsletter-input"
                        />
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={submitting}
                            size="large"
                            className="home-newsletter-btn"
                        >
                            ĐĂNG KÝ NGAY
                        </Button>
                    </form>
                    <div className="home-newsletter-footer-text">
                        * Cam kết không spam. Bạn có thể hủy đăng ký bất kỳ lúc nào.
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NewsletterVoucher;
