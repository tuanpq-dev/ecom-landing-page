import React from "react";
import { Tag } from "antd";
import { CheckCircleOutlined, CarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import type { CustomerOrder } from "../types";

interface RecentOrdersTabProps {
    orders: CustomerOrder[];
    totalOrders: number;
    totalExpend: number;
    formatCurrency: (amount: number) => string;
}

export const RecentOrdersTab: React.FC<RecentOrdersTabProps> = React.memo(({
    orders,
    totalOrders,
    totalExpend,
    formatCurrency,
}) => {
    const processingCount = React.useMemo(() => {
        return orders.filter((o) => o.status === "PROCESSING" || o.status === "PENDING").length;
    }, [orders]);

    const completedCount = React.useMemo(() => {
        return orders.filter((o) => o.status === "COMPLETED").length;
    }, [orders]);

    return (
        <div>
            <div className="tab-header">
                <h2 className="tab-title">Đơn Hàng Của Tôi</h2>
                <p className="tab-desc">Theo dõi trạng thái các đơn hàng gần đây của bạn</p>
            </div>

            {/* Order Stats Header */}
            <div className="order-stats-grid">
                <div className="order-stat-card">
                    <div className="stat-number">{totalOrders || orders.length}</div>
                    <div className="stat-label">Tổng đơn hàng</div>
                </div>
                <div className="order-stat-card">
                    <div className="stat-number" style={{ color: "#1677ff" }}>
                        {processingCount}
                    </div>
                    <div className="stat-label">Đang xử lý</div>
                </div>
                <div className="order-stat-card">
                    <div className="stat-number" style={{ color: "#52c41a" }}>
                        {completedCount}
                    </div>
                    <div className="stat-label">Đã hoàn thành</div>
                </div>
                <div className="order-stat-card">
                    <div className="stat-number" style={{ color: "#faad14" }}>
                        {formatCurrency(totalExpend)}
                    </div>
                    <div className="stat-label">Tổng chi tiêu</div>
                </div>
            </div>

            {/* Orders List */}
            <div>
                {orders.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px 0", color: "#8892a0" }}>
                        Bạn chưa có đơn hàng nào.
                    </div>
                ) : (
                    orders.map((order) => {
                        const orderTotal = order.items?.reduce(
                            (sum, item) => sum + Number(item.price || 0) * (item.quantity || 1),
                            0
                        ) || 0;
                        const totalItemsCount = order.items?.reduce(
                            (sum, item) => sum + (item.quantity || 1),
                            0
                        ) || 0;

                        return (
                            <div
                                className="order-row-item"
                                key={order.id}
                                style={{ flexDirection: "column", alignItems: "stretch", gap: 12, marginBottom: 16 }}
                            >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: 14, color: "#22242a" }}>
                                            {order.orderCode || `Mã đơn: ORD-${order.id}`}
                                        </div>
                                        <div style={{ fontSize: 12, color: "#8892a0", marginTop: 2 }}>
                                            Ngày đặt: {dayjs(order.createdAt).format("DD/MM/YYYY HH:mm")} • {totalItemsCount} sản phẩm
                                        </div>
                                    </div>

                                    <div style={{ textAlign: "right" }}>
                                        <div style={{ fontWeight: 700, fontSize: 15, color: "#c89968" }}>
                                            {formatCurrency(orderTotal)}
                                        </div>
                                        <div style={{ marginTop: 4 }}>
                                            {order.status === "COMPLETED" && (
                                                <Tag icon={<CheckCircleOutlined />} color="success">
                                                    Hoàn thành
                                                </Tag>
                                            )}
                                            {(order.status === "PROCESSING" || order.status === "PENDING") && (
                                                <Tag icon={<CarOutlined />} color="processing">
                                                    Đang xử lý
                                                </Tag>
                                            )}
                                            {order.status === "CANCELLED" && (
                                                <Tag color="error">Đã hủy</Tag>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Items detail list */}
                                {order.items && order.items.length > 0 && (
                                    <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 10 }}>
                                        {order.items.map((item) => (
                                            <div
                                                key={item.id}
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    fontSize: 13,
                                                    color: "#555",
                                                    marginBottom: 4,
                                                }}
                                            >
                                                <span>
                                                    {item.productName}{" "}
                                                    <span style={{ color: "#888", fontSize: 12 }}>(x{item.quantity})</span>
                                                </span>
                                                <span style={{ fontWeight: 600, color: "#222" }}>
                                                    {formatCurrency(Number(item.price || 0) * item.quantity)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
});
