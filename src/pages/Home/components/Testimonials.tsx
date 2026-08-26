import React from "react";
import { StarFilled, LikeOutlined, TrophyOutlined, SmileOutlined } from "@ant-design/icons";
import Counter from "../../../utils/counter";

interface ReviewItem {
    id: string;
    name: string;
    role: string;
    avatar: string;
    comment: string;
    rating: number;
    purchasedItem: string;
}

const reviews: ReviewItem[] = [
    {
        id: "rev-1",
        name: "Nguyễn Minh Anh",
        role: "Khách hàng thân thiết",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
        comment: "Chất vải cotton mềm mịn, co giãn tốt và tôn dáng. Áo polo mặc đi làm hay đi chơi đều rất lịch sự. Giao hàng siêu nhanh nữa!",
        rating: 5,
        purchasedItem: "Áo Polo Premium Cotton",
    },
    {
        id: "rev-2",
        name: "Trần Hoàng Nam",
        role: "Khách hàng đã mua 5+ lần",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
        comment: "Quần jeans slim-fit chuẩn phom, không bị giặt bai nhão. Đóng gói rất chỉn chu, hộp sang trọng. Chắc chắn sẽ ủng hộ shop dài lâu.",
        rating: 5,
        purchasedItem: "Quần Jeans Slim-Fit",
    },
    {
        id: "rev-3",
        name: "Lê Thu Thảo",
        role: "Khách hàng mua lần đầu",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
        comment: "Áo blazer chất lượng vượt kỳ vọng! Đường may tinh tế, phom chuẩn phong cách Hàn Quốc. Dịch vụ CSKH hỗ trợ tư vấn size rất nhiệt tình.",
        rating: 5,
        purchasedItem: "Áo Khoác Blazer Hàn Quốc",
    },
];

export const Testimonials: React.FC = () => {
    return (
        <section className="home-testimonials-section" aria-label="Đánh giá từ khách hàng">
            <div className="home-testimonials-container">
                <div className="home-stats-grid">
                    <div className="home-stat-item">
                        <TrophyOutlined className="home-stat-icon" />
                        <Counter target={10000} suffix="+" className="home-stat-num" />
                        <div className="home-stat-label">Khách hàng tin tưởng</div>
                    </div>
                    <div className="home-stat-item">
                        <StarFilled className="home-stat-icon" />
                        <Counter target={4.9} decimals={1} suffix=" / 5.0" className="home-stat-num" />
                        <div className="home-stat-label">Đánh giá chất lượng</div>
                    </div>
                    <div className="home-stat-item">
                        <LikeOutlined className="home-stat-icon" />
                        <Counter target={99} suffix="%" className="home-stat-num" />
                        <div className="home-stat-label">Hài lòng về dịch vụ</div>
                    </div>
                    <div className="home-stat-item">
                        <SmileOutlined className="home-stat-icon" />
                        <Counter target={24} suffix="/7" className="home-stat-num" />
                        <div className="home-stat-label">Hỗ trợ tận tâm</div>
                    </div>
                </div>

                <div className="home-section-header" style={{ justifyContent: "center", textAlign: "center", flexDirection: "column", gap: 6, marginTop: 48, marginBottom: 32 }}>
                    <h2 className="home-section-title">Khách Hàng Nói Gì Về Chúng Tôi</h2>
                    <p style={{ color: "#666", fontSize: 14, margin: 0 }}>
                        Hàng ngàn phản hồi tích cực từ những người yêu thích thời trang tối giản & tinh tế
                    </p>
                </div>

                <div className="home-reviews-grid">
                    {reviews.map((rev) => (
                        <div className="home-review-card" key={rev.id}>
                            <div className="home-review-stars">
                                {[...Array(rev.rating)].map((_, i) => (
                                    <StarFilled key={i} style={{ color: "#faad14", fontSize: 14 }} />
                                ))}
                            </div>
                            <p className="home-review-comment">"{rev.comment}"</p>
                            <div className="home-review-user">
                                <img src={rev.avatar} alt={rev.name} className="home-review-avatar" />
                                <div>
                                    <div className="home-review-name">{rev.name}</div>
                                    <div className="home-review-role">{rev.role}</div>
                                    <div className="home-review-item">Đã mua: {rev.purchasedItem}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
