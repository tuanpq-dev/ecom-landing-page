import { memo, useMemo } from "react";
import { Button, Tag, Popconfirm } from "antd";
import {
    FileTextOutlined,
    CarOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    ReloadOutlined,
    StarOutlined,
} from "@ant-design/icons";
import type { ApiOrder } from "../types";
import { parseOrderItemImage } from "../types";
import { formatDateTime } from "../../../utils/dateUtils";

interface OrderCardProps {
    order: ApiOrder;
    onViewDetail: (order: ApiOrder) => void;
    onReOrder: (order: ApiOrder) => void;
    onCancelOrder: (orderId: number) => void;
    formatCurrency: (amount: number) => string;
    onReview: (order: ApiOrder) => void;
}

function OrderCardComponent({
    order,
    onViewDetail,
    onReOrder,
    onCancelOrder,
    formatCurrency,
    onReview,
}: OrderCardProps) {
    let isReviewed = false;
    if (order.reviews && order.reviews.length) {
        isReviewed = true
    }
    const orderTotal = useMemo(() => {
        if (!order.items || order.items.length === 0) return 0;
        return order.items.reduce((sum, item) => {
            const p = typeof item.price === "string" ? parseFloat(item.price) || 0 : item.price;
            return sum + p * item.quantity;
        }, 0);
    }, [order.items]);

    const renderStatusTag = (status: string) => {
        const s = status ? status.toUpperCase() : "PROCESSING";
        switch (s) {
            case "COMPLETED":
                return (
                    <Tag icon={<CheckCircleOutlined />} color="success">
                        Hoàn thành
                    </Tag>
                );
            case "DELIVERED":
                return (
                    <Tag icon={<CheckCircleOutlined />} color="success">
                        Đã giao hàng
                    </Tag>
                );
            case "SHIPPING":
                return (
                    <Tag icon={<CarOutlined />} color="processing">
                        Đang giao hàng
                    </Tag>
                );
            case "PROCESSING":
            case "PENDING":
                return (
                    <Tag icon={<ClockCircleOutlined />} color="warning">
                        Chờ xử lý
                    </Tag>
                );
            case "CANCELLED":
                return (
                    <Tag icon={<CloseCircleOutlined />} color="error">
                        Đã hủy
                    </Tag>
                );
            default:
                return <Tag color="default">{status}</Tag>;
        }
    };

    const isCancelable = order.status?.toUpperCase() === "PROCESSING" || order.status?.toUpperCase() === "PENDING";
    const isCompleted = order.status?.toUpperCase() === "COMPLETED" || order.status?.toUpperCase() === "DELIVERED";

    return (
        <div className="order-card">
            {/* Card Header */}
            <div className="order-card-header">
                <div className="order-meta-info">
                    <span className="order-id">
                        <FileTextOutlined style={{ marginRight: 6, color: "#c89968" }} />
                        #{order.orderCode || order.id}
                    </span>
                    <span className="order-date">
                        Đặt ngày: {formatDateTime(order.createdAt)}
                    </span>
                </div>
                <div>{renderStatusTag(order.status)}</div>
            </div>

            {/* Products inside order */}
            <div className="order-products-list">
                {order.items?.map((item) => {
                    const pPrice = typeof item.price === "string" ? parseFloat(item.price) || 0 : item.price;
                    const imgUrl = parseOrderItemImage(item);

                    return (
                        <div className="order-product-item" key={item.id}>
                            <img src={imgUrl} alt={item.productName} className="order-product-img" />
                            <div className="order-product-info">
                                <div className="order-product-name">{item.productName}</div>
                                <div className="order-product-variant">{item.variantSku || "Mặc định"}</div>
                                <div className="order-product-qty">x{item.quantity}</div>
                            </div>
                            <div className="order-product-price">{formatCurrency(pPrice)}</div>
                        </div>
                    );
                })}
            </div>

            {/* Card Footer */}
            <div className="order-card-footer">
                <div className="order-total-group">
                    <span className="order-total-label">Tổng thanh toán:</span>
                    <span className="order-total-amount">{formatCurrency(orderTotal)}</span>
                </div>

                <div className="order-actions-group">
                    <Button onClick={() => onViewDetail(order)}>
                        Xem chi tiết
                    </Button>

                    {isCompleted && (
                        <Button
                            disabled={isReviewed}
                            icon={<StarOutlined style={{ color: "#faad14" }} />}
                            onClick={() => onReview(order)}
                        >
                            {isReviewed ? 'Đã đánh giá' : 'Đánh giá'}
                        </Button>
                    )}

                    <Button
                        type="primary"
                        className="order-btn-primary"
                        icon={<ReloadOutlined />}
                        onClick={() => onReOrder(order)}
                    >
                        Mua lại
                    </Button>

                    {isCancelable && (
                        <Popconfirm
                            title="Hủy đơn hàng này?"
                            description="Bạn có chắc chắn muốn hủy đơn hàng?"
                            onConfirm={() => onCancelOrder(order.id)}
                            okText="Đồng ý hủy"
                            cancelText="Quay lại"
                            okButtonProps={{ danger: true }}
                        >
                            <Button danger>Hủy đơn</Button>
                        </Popconfirm>
                    )}
                </div>
            </div>
        </div>
    );
}

export default memo(OrderCardComponent);
