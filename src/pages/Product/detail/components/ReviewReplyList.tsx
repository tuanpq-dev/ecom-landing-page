import { Avatar, Tag } from "antd";
import { UserOutlined, LikeFilled, LikeOutlined } from "@ant-design/icons";
import type { ReplyItem } from "./types";

interface ReviewReplyListProps {
    reviewId: number;
    replies: ReplyItem[];
    onToggleReplyLike: (reviewId: number, replyId: number) => void;
}

export function ReviewReplyList({ reviewId, replies, onToggleReplyLike }: ReviewReplyListProps) {
    if (!replies || replies.length === 0) return null;

    return (
        <div className="review-replies-container">
            {replies.map((reply) => (
                <div key={reply.id} className={`review-reply-card ${reply.isSeller ? "seller" : ""}`}>
                    <div className="review-reply-header">
                        <Avatar
                            src={reply.avatar}
                            size={32}
                            icon={<UserOutlined />}
                            className="review-reply-avatar"
                        />
                        <div className="review-reply-user-meta">
                            <span className="review-reply-user-name">{reply.userName}</span>
                            {reply.isSeller && (
                                <Tag color="volcano" className="review-seller-badge">
                                    Shop Phản Hồi
                                </Tag>
                            )}
                            <span className="review-reply-date">{reply.createdAt}</span>
                        </div>
                    </div>

                    <div className="review-reply-content">{reply.content}</div>

                    <div className="review-reply-footer">
                        <button
                            className={`review-reply-like-btn ${reply.isLiked ? "liked" : ""}`}
                            onClick={() => onToggleReplyLike(reviewId, reply.id)}
                        >
                            {reply.isLiked ? <LikeFilled /> : <LikeOutlined />}
                            <span>{reply.likesCount > 0 ? reply.likesCount : "Thích"}</span>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ReviewReplyList;
