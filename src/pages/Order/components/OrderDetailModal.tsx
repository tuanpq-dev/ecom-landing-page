import { memo, useMemo } from "react";
import { Modal, Button, Tag, Steps } from "antd";
import {
    ReloadOutlined,
    EnvironmentOutlined,
    CreditCardOutlined,
} from "@ant-design/icons";
import type { ApiOrder } from "../types";
import { parseOrderItemImage } from "../types";

interface OrderDetailModalProps {
    order: ApiOrder | null;
    onClose: () => void;
    onReOrder: (order: ApiOrder) => void;
    formatCurrency: (amount: number) => string;
}

function OrderDetailModalComponent({
    order,
    onClose,
    onReOrder,
    formatCurrency,
}: OrderDetailModalProps) {
    const orderTotal = useMemo(() => {
        if (!order || !order.items || order.items.length === 0) return 0;
        return order.items.reduce((sum, item) => {
            const p = typeof item.price === "string" ? parseFloat(item.price) || 0 : item.price;
            return sum + p * item.quantity;
        }, 0);
    }, [order]);

    if (!order) return null;

    const getStepCurrent = (status: string, shippingStatus?: string) => {
        const s = (shippingStatus || status || "PROCESSING").toUpperCase();
        switch (s) {
            case "PROCESSING":
            case "PENDING":
                return 1;
            case "SHIPPING":
                return 2;
            case "DELIVERED":
            case "COMPLETED":
                return 3;
            case "CANCELLED":
                return -1;
            default:
                return 1;
        }
    };

    return (
        <Modal
            title={`Chi Tiết Đơn Hàng #${order.orderCode || order.id}`}
            open={!!order}
            onCancel={onClose}
            footer={[
                <Button key="close" onClick={onClose}>
                    Đóng
                </Button>,
                <Button
                    key="reorder"
                    type="primary"
                    className="order-btn-primary"
                    icon={<ReloadOutlined />}
                    onClick={() => {
                        onClose();
                        onReOrder(order);
                    }}
                >
                    Mua lại đơn này
                </Button>,
            ]}
            width={680}
        >
            <div style={{ paddingTop: 10 }}>
                {/* Status Timeline Steps */}
                <div className="order-detail-section" style={{ marginBottom: 28, padding: "16px 12px", backgroundColor: "#fbfcfd", borderRadius: 10 }}>
                    {order.status?.toUpperCase() === "CANCELLED" ? (
                        <Tag color="error" style={{ fontSize: 13, padding: "4px 12px" }}>
                            Đơn hàng đã được hủy
                        </Tag>
                    ) : (
                        <Steps
                            current={getStepCurrent(order.status, order.shippingStatus)}
                            size="small"
                            items={[
                                { title: "Đặt hàng" },
                                { title: "Chờ xử lý" },
                                { title: "Đang giao" },
                                { title: "Đã giao" },
                            ]}
                        />
                    )}
                </div>

                {/* Recipient Information */}
                <div className="order-detail-section">
                    <div className="order-detail-subtitle">
                        <EnvironmentOutlined style={{ color: "#c89968" }} /> Thông tin người nhận & Địa chỉ
                    </div>
                    <div className="info-box-gray">
                        <div><strong>Địa chỉ & Người nhận:</strong> {order.shippingAddress}</div>
                        {order.note && (
                            <div><strong>Ghi chú:</strong> {order.note}</div>
                        )}
                    </div>
                </div>

                {/* Payment Method */}
                <div className="order-detail-section">
                    <div className="order-detail-subtitle">
                        <CreditCardOutlined style={{ color: "#c89968" }} /> Phương thức thanh toán
                    </div>
                    <div className="info-box-gray">
                        <div><strong>Phương thức:</strong> {order.paymentMethod || "COD"}</div>
                        {order.paymentStatus && (
                            <div style={{ marginTop: 4 }}>
                                <strong>Thanh toán:</strong>{" "}
                                <Tag color={order.paymentStatus.toUpperCase() === "PAID" ? "success" : "warning"}>
                                    {order.paymentStatus.toUpperCase() === "PAID" ? "Đã thanh toán" : "Chưa thanh toán"}
                                </Tag>
                            </div>
                        )}
                    </div>
                </div>

                {/* Products List Breakdown */}
                <div className="order-detail-section">
                    <div className="order-detail-subtitle">Sản phẩm trong đơn hàng</div>
                    {order.items?.map((item) => {
                        const pPrice = typeof item.price === "string" ? parseFloat(item.price) || 0 : item.price;
                        const imgUrl = parseOrderItemImage(item);

                        return (
                            <div className="order-product-item" key={item.id} style={{ padding: "10px 0" }}>
                                <img src={imgUrl} alt={item.productName} className="order-product-img" style={{ width: 54, height: 54 }} />
                                <div className="order-product-info">
                                    <div className="order-product-name">{item.productName}</div>
                                    <div className="order-product-variant">{item.variantSku || "Mặc định"}</div>
                                    <div className="order-product-qty">x{item.quantity}</div>
                                </div>
                                <div className="order-product-price">{formatCurrency(pPrice * item.quantity)}</div>
                            </div>
                        );
                    })}
                </div>

                {/* Order Cost Summary */}
                <div style={{ borderTop: "1px dashed #e2e7ec", paddingTop: 14, fontSize: 13 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid #edf0f5", fontWeight: 700, fontSize: 16 }}>
                        <span>Tổng tiền thanh toán:</span>
                        <span style={{ color: "#c89968", fontSize: 18 }}>{formatCurrency(orderTotal)}</span>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default memo(OrderDetailModalComponent);
