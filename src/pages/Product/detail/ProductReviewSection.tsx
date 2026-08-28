import { useState } from "react";
import { Spin } from "antd";
import type { ReviewData, ReplyItem } from "./components/types";
import { ReviewSummary } from "./components/ReviewSummary";
import { ReviewFilterTabs } from "./components/ReviewFilterTabs";
import { ReviewItemCard } from "./components/ReviewItemCard";
import { useProductReviews } from "./hooks/useProductReviews";
import "./ProductReviewSection.css";

export type { ReviewData, ReplyItem };

interface ProductReviewSectionProps {
    productId?: number | string;
}

export function ProductReviewSection({ productId }: ProductReviewSectionProps) {
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const {
        filteredReviews,
        loading,
        activeFilter,
        setActiveFilter,
        handleSendReply,
        handleToggleLike,
        handleToggleReplyLike,
        stats,
    } = useProductReviews(productId);

    return (
        <div className="review-section">
            <div className="review-section-header">
                <h3 className="review-section-title">Đánh Giá & Nhận Xét Sản Phẩm</h3>
            </div>

            {/* Summary Rating Box Component */}
            <ReviewSummary
                averageRating={stats.averageRating}
                totalReviews={stats.totalReviews}
                percent5={stats.percent5}
                percent4={stats.percent4}
                percent3={stats.percent3}
                percent2={stats.percent2}
                percent1={stats.percent1}
            />

            {/* Filter Tabs Component */}
            <ReviewFilterTabs
                activeFilter={activeFilter}
                onSelectFilter={setActiveFilter}
                totalCount={stats.totalReviews}
                count5={stats.count5}
                count4={stats.count4}
                count3={stats.count3}
            />

            {/* Review Cards List */}
            {loading ? (
                <div className="review-empty-state">
                    <Spin />
                </div>
            ) : (
                <div className="review-list">
                    {filteredReviews.length === 0 ? (
                        <div className="review-empty-state">
                            Chưa có đánh giá nào cho sản phẩm này.
                        </div>
                    ) : (
                        filteredReviews.map((rev) => (
                            <ReviewItemCard
                                key={rev.id}
                                review={rev}
                                onSubmitReply={handleSendReply}
                                onToggleLike={handleToggleLike}
                                onToggleReplyLike={handleToggleReplyLike}
                                onPreviewImage={setPreviewImage}
                            />
                        ))
                    )}
                </div>
            )}

            {/* Image Modal Lightbox */}
            {previewImage && (
                <div className="review-img-modal-overlay" onClick={() => setPreviewImage(null)}>
                    <div className="review-img-modal-content" onClick={(e) => e.stopPropagation()}>
                        <img src={previewImage} alt="Preview" />
                        <button className="review-img-modal-close" onClick={() => setPreviewImage(null)}>
                            ×
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductReviewSection;
