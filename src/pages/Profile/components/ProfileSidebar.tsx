import React from "react";
import { Avatar, Popconfirm, message } from "antd";
import {
    UserOutlined,
    LockOutlined,
    EnvironmentOutlined,
    ShoppingOutlined,
    LogoutOutlined,
    CameraOutlined,
    CrownOutlined,
} from "@ant-design/icons";
import type { UserProfileData } from "../types";

interface ProfileSidebarProps {
    profileData: UserProfileData;
    activeTab: "info" | "password" | "address" | "orders";
    setActiveTab: (tab: "info" | "password" | "address" | "orders") => void;
    addressesCount: number;
    onLogout: () => void;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = React.memo(({
    profileData,
    activeTab,
    setActiveTab,
    addressesCount,
    onLogout,
}) => {
    return (
        <div className="profile-sidebar">
            <div className="user-profile-header">
                <div className="avatar-wrapper">
                    <Avatar size={76} src={profileData.avatar} icon={<UserOutlined />} />
                    <div
                        className="avatar-upload-badge"
                        onClick={() => message.info("Chức năng tải ảnh đại diện đang phát triển")}
                    >
                        <CameraOutlined />
                    </div>
                </div>
                <div className="user-display-name">{profileData.fullName || "Người dùng"}</div>
                <div className="user-display-email">{profileData.email}</div>
                <div className="user-membership-badge">
                    <CrownOutlined />
                    <span>Thành viên VIP</span>
                </div>
            </div>

            {/* Navigation Menu */}
            <div className="profile-menu-list">
                <div
                    className={`profile-menu-item ${activeTab === "info" ? "active" : ""}`}
                    onClick={() => setActiveTab("info")}
                >
                    <UserOutlined className="menu-icon" />
                    <span>Thông tin cá nhân</span>
                </div>

                <div
                    className={`profile-menu-item ${activeTab === "password" ? "active" : ""}`}
                    onClick={() => setActiveTab("password")}
                >
                    <LockOutlined className="menu-icon" />
                    <span>Đổi mật khẩu</span>
                </div>

                <div
                    className={`profile-menu-item ${activeTab === "address" ? "active" : ""}`}
                    onClick={() => setActiveTab("address")}
                >
                    <EnvironmentOutlined className="menu-icon" />
                    <span>Sổ địa chỉ ({addressesCount})</span>
                </div>

                <div
                    className={`profile-menu-item ${activeTab === "orders" ? "active" : ""}`}
                    onClick={() => setActiveTab("orders")}
                >
                    <ShoppingOutlined className="menu-icon" />
                    <span>Đơn hàng của tôi</span>
                </div>

                <Popconfirm
                    title="Đăng xuất tài khoản?"
                    description="Bạn có chắc chắn muốn đăng xuất không?"
                    onConfirm={onLogout}
                    okText="Đăng xuất"
                    cancelText="Hủy"
                >
                    <div className="profile-menu-item" style={{ color: "#ff4d4f" }}>
                        <LogoutOutlined className="menu-icon" style={{ color: "#ff4d4f" }} />
                        <span>Đăng xuất</span>
                    </div>
                </Popconfirm>
            </div>
        </div>
    );
});
