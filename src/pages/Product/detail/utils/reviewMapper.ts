import { formatDateTime } from "../../../../utils/dateUtils";
import type { ReviewData, ReplyItem } from "../components/types";

export function mapRawReplyToReplyItem(
    rep: any,
    fallbackReviewId?: number,
    currentUserId?: number | string | null
): ReplyItem {
    const isSeller = Boolean(rep.isSeller || rep.admin || rep.seller);
    const userName =
        rep.userName ||
        rep.admin?.fullname ||
        rep.admin?.name ||
        (isSeller ? "Shop Phản Hồi" : rep.user?.fullname || rep.user?.name || "Khách hàng");
    const avatar = rep.avatar || rep.admin?.avatar || rep.user?.avatar || "";

    const likesList = Array.isArray(rep.likes) ? rep.likes : [];
    const likesCount = typeof rep.likesCount === "number" ? rep.likesCount : likesList.length;

    let isLiked = false;
    if (typeof rep.isLiked === "boolean") {
        isLiked = rep.isLiked;
    } else if (currentUserId && likesList.length > 0) {
        isLiked = likesList.some(
            (like: any) =>
                like.userId !== undefined &&
                like.userId !== null &&
                String(like.userId) === String(currentUserId)
        );
    }

    return {
        id: rep.id ?? (fallbackReviewId ? fallbackReviewId * 1000 + 1 : Date.now()),
        userName,
        avatar,
        isSeller,
        createdAt: formatDateTime(rep.createdAt || rep.updatedAt),
        content: rep.content || rep.reply || "",
        likesCount,
        isLiked,
    };
}

export function mapRawReviewToReviewData(item: any, currentUserId?: number | string | null): ReviewData {
    const userName =
        item.userName ||
        item.user?.fullname ||
        item.user?.name ||
        item.user?.email?.split("@")[0] ||
        `Khách hàng #${item.userId || item.id || ""}`;

    const userAvatar = item.userAvatar || item.user?.avatar || "";

    let replies: ReplyItem[] = [];
    if (Array.isArray(item.replies)) {
        replies = item.replies.map((rep: any) => mapRawReplyToReplyItem(rep, item.id, currentUserId));
    } else if (item.reply) {
        replies = [
            mapRawReplyToReplyItem(
                {
                    id: (item.id || 0) * 1000 + 1,
                    userName: "Shop Phản Hồi",
                    isSeller: true,
                    updatedAt: item.updatedAt || item.createdAt,
                    content: item.reply,
                    likesCount: 0,
                },
                item.id,
                currentUserId
            ),
        ];
    }

    const likesList = Array.isArray(item.likes) ? item.likes : [];
    const likesCount = typeof item.likesCount === "number" ? item.likesCount : likesList.length;

    let isLiked = false;
    if (typeof item.isLiked === "boolean") {
        isLiked = item.isLiked;
    } else if (currentUserId && likesList.length > 0) {
        isLiked = likesList.some(
            (like: any) =>
                like.userId !== undefined &&
                like.userId !== null &&
                String(like.userId) === String(currentUserId)
        );
    } else if (typeof item.userReaction === "string") {
        isLiked = item.userReaction === "like";
    }

    return {
        id: item.id,
        userName,
        userAvatar,
        isVerified: item.isVerified ?? true,
        rating: item.rating || 5,
        createdAt: formatDateTime(item.createdAt),
        variantInfo: item.variantInfo || "",
        content: item.content || "Người dùng không để lại bình luận.",
        images: item.images || [],
        likesCount,
        isLiked,
        replies,
    };
}
