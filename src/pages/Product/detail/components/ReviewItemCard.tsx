import { useState } from "react";
import { Avatar, Tag, Rate, Input, Button, message } from "antd";
import {
    UserOutlined,
    CheckCircleFilled,
    LikeFilled,
    LikeOutlined,
    MessageOutlined,
    SendOutlined,
} from "@ant-design/icons";
import type { ReviewData } from "./types";
import { ReviewReplyList } from "./ReviewReplyList";

interface ReviewItemCardProps {
    review: ReviewData;
    onToggleLike?: (reviewId: number) => void;
    onSubmitReply: (reviewId: number, content: string) => Promise<void> | void;
    onToggleReplyLike: (reviewId: number, replyId: number) => void;
    onPreviewImage?: (imgUrl: string) => void;
}

export function ReviewItemCard({
    review,
    onToggleLike,
    onSubmitReply,
    onToggleReplyLike,
    onPreviewImage,
}: ReviewItemCardProps) {
    const [isReplying, setIsReplying] = useState<boolean>(false);
    const [replyText, setReplyText] = useState<string>("");
    const [submittingReply, setSubmittingReply] = useState<boolean>(false);

    const handleSendReply = async () => {
        if (!replyText.trim()) {
            message.warning("Vui lòng nhập nội dung phản hồi!");
            return;
        }
        setSubmittingReply(true);
        try {
            await onSubmitReply(review.id, replyText.trim());
            setReplyText("");
            setIsReplying(false);
        } catch (err) {
            console.error("Submit reply error:", err);
        } finally {
            setSubmittingReply(false);
        }
    };

    return (
        <div className="review-card-item">
            {/* User Header */}
            <div className="review-user-row">
                <Avatar
                    src={review.userAvatar}
                    icon={!review.userAvatar && <UserOutlined />}
                    size={44}
                    className="review-user-avatar"
                >
                    {!review.userAvatar && review.userName.charAt(0).toUpperCase()}
                </Avatar>

                <div className="review-user-meta">
                    <div className="review-user-name-row">
                        <span className="review-user-name">{review.userName}</span>
                        {review.isVerified && (
                            <Tag color="success" icon={<CheckCircleFilled />} className="review-verified-badge">
                                Đã mua hàng
                            </Tag>
                        )}
                    </div>

                    <div className="review-stars-date-row">
                        <Rate disabled value={review.rating} className="review-item-stars" />
                        <span className="review-item-date">• {review.createdAt}</span>
                    </div>
                </div>
            </div>

            {review.variantInfo && <div className="review-item-variant">{review.variantInfo}</div>}

            <div className="review-item-content">{review.content}</div>

            {/* Images Grid */}
            {review.images && review.images.length > 0 && (
                <div className="review-item-images">
                    {review.images.map((img, idx) => (
                        <img
                            key={idx}
                            src={img}
                            alt={`review-${review.id}-${idx}`}
                            className="review-item-img"
                            onClick={() => onPreviewImage?.(img)}
                        />
                    ))}
                </div>
            )}

            {/* Reactions & Reply Actions Bar */}
            <div className="review-actions-bar">
                <div className="review-reactions-group">
                    <button
                        className={`review-react-btn ${review.isLiked ? "active-like" : ""}`}
                        onClick={() => onToggleLike?.(review.id)}
                        title="Thích"
                    >
                        {review.isLiked ? <LikeFilled /> : <LikeOutlined />}
                        <span>Thích {review.likesCount > 0 && `(${review.likesCount})`}</span>
                    </button>
                </div>

                <button
                    className={`review-reply-btn ${isReplying ? "active" : ""}`}
                    onClick={() => setIsReplying(!isReplying)}
                >
                    <MessageOutlined />
                    <span>Phản hồi {review.replies.length > 0 && `(${review.replies.length})`}</span>
                </button>
            </div>

            {/* Collapsible Reply Section (Input Form & Replies List) */}
            {isReplying && (
                <div className="review-reply-section">
                    <div className="review-reply-input-box">
                        <Input.TextArea
                            rows={2}
                            placeholder={`Viết phản hồi cho ${review.userName}...`}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            autoFocus
                        />
                        <div className="review-reply-input-actions">
                            <Button size="small" onClick={() => setIsReplying(false)}>
                                Đóng
                            </Button>
                            <Button
                                type="primary"
                                size="small"
                                icon={<SendOutlined />}
                                loading={submittingReply}
                                onClick={handleSendReply}
                            >
                                Gửi
                            </Button>
                        </div>
                    </div>

                    <ReviewReplyList
                        reviewId={review.id}
                        replies={review.replies}
                        onToggleReplyLike={onToggleReplyLike}
                    />
                </div>
            )}
        </div>
    );
}

export default ReviewItemCard;
