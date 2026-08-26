import { memo, useMemo } from "react";
import { Input, Tabs } from "antd";
import { SearchOutlined } from "@ant-design/icons";

interface OrderFilterBarProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    activeStatus: string;
    onStatusChange: (statusKey: string) => void;
}

function OrderFilterBarComponent({
    searchQuery,
    onSearchChange,
    activeStatus,
    onStatusChange,
}: OrderFilterBarProps) {
    const tabItems = useMemo(
        () => [
            { key: "all", label: "Tất cả đơn hàng" },
            { key: "PROCESSING", label: "Chờ xử lý" },
            { key: "SHIPPING", label: "Đang giao" },
            { key: "DELIVERED", label: "Đã giao" },
            { key: "COMPLETED", label: "Hoàn thành" },
            { key: "CANCELLED", label: "Đã hủy" },
        ],
        []
    );

    return (
        <div className="order-filter-bar">
            {/* Search Bar */}
            <div className="order-search-box">
                <Input
                    prefix={<SearchOutlined style={{ color: "#9aa4b2" }} />}
                    placeholder="Tìm kiếm theo Mã đơn hàng hoặc Tên sản phẩm..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    allowClear
                    size="large"
                />
            </div>

            {/* Status Tabs */}
            <Tabs
                activeKey={activeStatus}
                onChange={onStatusChange}
                items={tabItems}
            />
        </div>
    );
}

export default memo(OrderFilterBarComponent);
