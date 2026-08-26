import { useState, useEffect, useCallback, useMemo } from "react";
import { message } from "antd";
import { socketIO } from "../../../../socket/socket.io";
import { getReviewsByProductIdApi, createReplyApi } from "../../../../api/reviewApi";
import type { ReviewData } from "../components/types";
import { mapRawReviewToReviewData, mapRawReplyToReplyItem } from "../utils/reviewMapper";

export function useProductReviews(productId?: number | string) {
    const [reviews, setReviews] = useState<ReviewData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [activeFilter, setActiveFilter] = useState<string>("all");

    const fetchReviews = useCallback(async () => {
        if (!productId) return;
        setLoading(true);
        try {
            const res: any = await getReviewsByProductIdApi(productId);
            const rawList = Array.isArray(res) ? res : res?.data || [];
            if (Array.isArray(rawList)) {
                const mapped = rawList.map((item: any) => mapRawReviewToReviewData(item));
                setReviews(mapped);
            }
        } catch (err) {
            console.error("Fetch reviews error:", err);
            message.error("Khởi tạo danh sách đánh giá thất bại");
        } finally {
            setLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    useEffect(() => {
        if (!productId) return;

        const socket = socketIO();
        socket.emit("join_post", { productId });

        const handleNewReview = (rawReview: any) => {
            if (!rawReview) return;
            const formatted = mapRawReviewToReviewData(rawReview);
            setReviews((prev) => {
                if (prev.some((r) => r.id === formatted.id)) return prev;
                return [formatted, ...prev];
            });
        };

        const handleNewReply = (data: { reviewId: number; reply: any }) => {
            if (!data || !data.reviewId || !data.reply) return;
            const formattedReply = mapRawReplyToReplyItem(data.reply, data.reviewId);

            setReviews((prev) =>
                prev.map((r) => {
                    if (r.id !== data.reviewId) return r;
                    const existingReplies = r.replies || [];
                    if (existingReplies.some((rep) => rep.id === formattedReply.id)) return r;
                    return {
                        ...r,
                        replies: [formattedReply, ...existingReplies],
                    };
                })
            );
        };

        socket.on("new_review", handleNewReview);
        socket.on("new_reply", handleNewReply);
        socket.on("review:replied", handleNewReply);

        return () => {
            socket.emit("leave_post", { productId });
            socket.off("new_review", handleNewReview);
            socket.off("new_reply", handleNewReply);
            socket.off("review:replied", handleNewReply);
        };
    }, [productId]);

    const handleSendReply = useCallback(
        async (reviewId: number, content: string) => {
            if (!productId || !content.trim()) return;

            try {
                const res: any = await createReplyApi({
                    productId,
                    reviewId,
                    content,
                });
                message.success("Đã gửi phản hồi thành công!");

                if (res?.data || res?.reply) {
                    const newReplyObj = res.data || res.reply;
                    const formatted = mapRawReplyToReplyItem(newReplyObj, reviewId);
                    setReviews((prev) =>
                        prev.map((r) =>
                            r.id === reviewId
                                ? {
                                    ...r,
                                    replies: [formatted, ...(r.replies || []).filter((rep) => rep.id !== formatted.id)],
                                }
                                : r
                        )
                    );
                }
            } catch (err) {
                console.error("Create reply error:", err);
                message.error("Gửi phản hồi thất bại, vui lòng thử lại!");
                throw err;
            }
        },
        [productId]
    );

    const handleToggleReaction = useCallback((reviewId: number, type: "like" | "heart") => {
        setReviews((prev) =>
            prev.map((item) => {
                if (item.id !== reviewId) return item;

                let newLikes = item.likesCount;
                let newHearts = item.heartsCount;
                let newReaction: "like" | "heart" | null = type;

                if (item.userReaction === type) {
                    newReaction = null;
                    if (type === "like") newLikes = Math.max(0, newLikes - 1);
                    if (type === "heart") newHearts = Math.max(0, newHearts - 1);
                } else {
                    if (item.userReaction === "like") newLikes = Math.max(0, newLikes - 1);
                    if (item.userReaction === "heart") newHearts = Math.max(0, newHearts - 1);

                    if (type === "like") newLikes += 1;
                    if (type === "heart") newHearts += 1;
                }

                return {
                    ...item,
                    likesCount: newLikes,
                    heartsCount: newHearts,
                    userReaction: newReaction,
                };
            })
        );
    }, []);

    const handleToggleReplyLike = useCallback((reviewId: number, replyId: number) => {
        setReviews((prev) =>
            prev.map((item) => {
                if (item.id !== reviewId) return item;

                return {
                    ...item,
                    replies: item.replies.map((reply) => {
                        if (reply.id !== replyId) return reply;
                        const isLiked = !reply.isLiked;
                        return {
                            ...reply,
                            isLiked,
                            likesCount: isLiked ? reply.likesCount + 1 : Math.max(0, reply.likesCount - 1),
                        };
                    }),
                };
            })
        );
    }, []);

    const filteredReviews = useMemo(() => {
        return reviews.filter((r) => {
            if (activeFilter === "5star") return r.rating === 5;
            if (activeFilter === "4star") return r.rating === 4;
            if (activeFilter === "3star") return r.rating === 3;
            return true;
        });
    }, [reviews, activeFilter]);

    const stats = useMemo(() => {
        const totalReviews = reviews.length;
        const averageRating =
            totalReviews > 0
                ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1))
                : 5.0;

        const count5 = reviews.filter((r) => r.rating === 5).length;
        const count4 = reviews.filter((r) => r.rating === 4).length;
        const count3 = reviews.filter((r) => r.rating === 3).length;
        const count2 = reviews.filter((r) => r.rating === 2).length;
        const count1 = reviews.filter((r) => r.rating === 1).length;

        return {
            totalReviews,
            averageRating,
            count5,
            count4,
            count3,
            count2,
            count1,
            percent5: totalReviews > 0 ? Math.round((count5 / totalReviews) * 100) : 0,
            percent4: totalReviews > 0 ? Math.round((count4 / totalReviews) * 100) : 0,
            percent3: totalReviews > 0 ? Math.round((count3 / totalReviews) * 100) : 0,
            percent2: totalReviews > 0 ? Math.round((count2 / totalReviews) * 100) : 0,
            percent1: totalReviews > 0 ? Math.round((count1 / totalReviews) * 100) : 0,
        };
    }, [reviews]);

    return {
        reviews,
        filteredReviews,
        loading,
        activeFilter,
        setActiveFilter,
        handleSendReply,
        handleToggleReaction,
        handleToggleReplyLike,
        stats,
        refetch: fetchReviews,
    };
}
