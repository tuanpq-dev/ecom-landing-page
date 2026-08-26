import React from "react";
import {
    CarOutlined,
    SyncOutlined,
    SafetyCertificateOutlined,
    CustomerServiceOutlined,
} from "@ant-design/icons";

interface FeatureItem {
    id: string;
    icon: React.ReactNode;
    title: string;
    description: string;
}

const features: FeatureItem[] = [
    {
        id: "freeship",
        icon: <CarOutlined style={{ fontSize: 28, color: "#c89968" }} />,
        title: "Miễn Phí Vận Chuyển",
        description: "Cho mọi đơn hàng từ $50.00",
    },
    {
        id: "return",
        icon: <SyncOutlined style={{ fontSize: 28, color: "#c89968" }} />,
        title: "Đổi Trả Trong 30 Ngày",
        description: "Đổi hàng dễ dàng & hoàn toàn miễn phí",
    },
    {
        id: "security",
        icon: <SafetyCertificateOutlined style={{ fontSize: 28, color: "#c89968" }} />,
        title: "Thanh Toán Bảo Mật",
        description: "Mã hóa SSL 100% an toàn",
    },
    {
        id: "support",
        icon: <CustomerServiceOutlined style={{ fontSize: 28, color: "#c89968" }} />,
        title: "Hỗ Trợ Khách Hàng 24/7",
        description: "Tư vấn tận tâm, phản hồi nhanh chóng",
    },
];

export const FeaturesBar: React.FC = () => {
    return (
        <section className="home-features-bar" aria-label="Cam kết thương hiệu">
            <div className="home-features-container">
                {features.map((item) => (
                    <div className="home-feature-card" key={item.id}>
                        <div className="home-feature-icon">{item.icon}</div>
                        <div className="home-feature-text">
                            <div className="home-feature-title">{item.title}</div>
                            <div className="home-feature-desc">{item.description}</div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FeaturesBar;
