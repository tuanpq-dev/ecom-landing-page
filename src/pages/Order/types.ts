export interface ApiOrderItem {
    id: number;
    productName: string;
    variantSku?: string | null;
    variantAttributes?: any;
    quantity: number;
    price: number | string;
    image?: string | null;
    variant?: {
        id?: number;
        sku?: string;
        image?: string | null;
        product?: {
            id?: number;
            name?: string;
            image?: string | null;
        };
    };
}

export interface ApiOrderUser {
    id: number;
    email?: string;
    fullname?: string;
    phone?: string;
    [key: string]: any;
}

export interface ApiOrder {
    id: number;
    orderCode: string;
    userId: number;
    user?: ApiOrderUser;
    status: string; // "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "PENDING"
    paymentStatus?: string;
    shippingStatus?: string;
    shippingAddress: string;
    paymentMethod: string;
    note?: string | null;
    image?: string | null;
    isDeleted?: boolean;
    history?: any[];
    createdAt: string;
    updatedAt?: string;
    items: ApiOrderItem[];
    reviews: any;
}

export function parseOrderItemImage(item: ApiOrderItem): string {
    const rawImage = item?.image || item?.variant?.image || item?.variant?.product?.image;

    if (rawImage) {
        if (Array.isArray(rawImage) && rawImage.length > 0) {
            return parseOrderItemImage({ ...item, image: rawImage[0] });
        }
        if (typeof rawImage === "string") {
            const trimmed = rawImage.trim();
            if (trimmed.startsWith("[")) {
                try {
                    const parsed = JSON.parse(trimmed);
                    if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]) {
                        return parsed[0];
                    }
                } catch {
                    // Ignore JSON parse error
                }
            } else if (trimmed.length > 0) {
                return trimmed;
            }
        }
    }

    return `https://picsum.photos/seed/${item?.id || 1}/400/300`;
}
