import { Rate, Progress, Button } from "antd";
import { SmileOutlined, StarFilled } from "@ant-design/icons";

interface ReviewSummaryProps {
    averageRating: number;
    totalReviews: number;
    percent5: number;
    percent4: number;
    percent3: number;
    percent2: number;
    percent1: number;
}

export function ReviewSummary({
    averageRating,
    totalReviews,
    percent5,
    percent4,
    percent3,
    percent2,
    percent1,
}: ReviewSummaryProps) {
    return (
        <div className="review-summary-card">
            <div className="review-summary-left">
                <div className="review-score-big">{averageRating}</div>
                <div className="review-stars-wrapper">
                    <Rate disabled value={Math.round(averageRating)} className="review-main-stars" />
                </div>
                <div className="review-total-count">({totalReviews} đánh giá)</div>
            </div>

            <div className="review-summary-middle">
                <div className="review-bar-row">
                    <span className="review-bar-label">
                        5 <StarFilled style={{ color: "#faad14", fontSize: 12 }} />
                    </span>
                    <Progress percent={percent5} showInfo={false} strokeColor="#faad14" className="review-progress-bar" />
                    <span className="review-bar-count">{percent5}%</span>
                </div>
                <div className="review-bar-row">
                    <span className="review-bar-label">
                        4 <StarFilled style={{ color: "#faad14", fontSize: 12 }} />
                    </span>
                    <Progress percent={percent4} showInfo={false} strokeColor="#faad14" className="review-progress-bar" />
                    <span className="review-bar-count">{percent4}%</span>
                </div>
                <div className="review-bar-row">
                    <span className="review-bar-label">
                        3 <StarFilled style={{ color: "#faad14", fontSize: 12 }} />
                    </span>
                    <Progress percent={percent3} showInfo={false} strokeColor="#faad14" className="review-progress-bar" />
                    <span className="review-bar-count">{percent3}%</span>
                </div>
                <div className="review-bar-row">
                    <span className="review-bar-label">
                        2 <StarFilled style={{ color: "#faad14", fontSize: 12 }} />
                    </span>
                    <Progress percent={percent2} showInfo={false} strokeColor="#faad14" className="review-progress-bar" />
                    <span className="review-bar-count">{percent2}%</span>
                </div>
                <div className="review-bar-row">
                    <span className="review-bar-label">
                        1 <StarFilled style={{ color: "#faad14", fontSize: 12 }} />
                    </span>
                    <Progress percent={percent1} showInfo={false} strokeColor="#faad14" className="review-progress-bar" />
                    <span className="review-bar-count">{percent1}%</span>
                </div>
            </div>

            <div className="review-summary-right">
                <div className="review-cta-text">Bạn đã trải nghiệm sản phẩm này?</div>
                <Button type="primary" icon={<SmileOutlined />} className="review-btn-write">
                    Gửi Đánh Giá Của Bạn
                </Button>
            </div>
        </div>
    );
}

export default ReviewSummary;
