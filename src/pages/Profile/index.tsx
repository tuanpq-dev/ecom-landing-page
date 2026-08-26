import { useState, useEffect, useCallback } from "react";
import { Breadcrumb, Form, message } from "antd";
import { useNavigate } from "react-router";
import config from "../../config/config";
import { URL } from "../../config/apiUrl";
import axiosClient from "../../api/axiosClient";
import "./Profile.css";

import type { UserProfileData, AddressItem, CustomerOrder } from "./types";
import { ProfileSidebar } from "./components/ProfileSidebar";
import { PersonalInfoTab } from "./components/PersonalInfoTab";
import { ChangePasswordTab } from "./components/ChangePasswordTab";
import { AddressBookTab } from "./components/AddressBookTab";
import { RecentOrdersTab } from "./components/RecentOrdersTab";

const emptyUserData: UserProfileData = {
    fullName: "",
    email: "",
    phone: "",
    gender: "male",
    avatar: "",
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
};

function Profile() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"info" | "password" | "address" | "orders">("info");
    const [profileData, setProfileData] = useState<UserProfileData>(emptyUserData);
    const [userId, setUserId] = useState<number | null>(null);
    const [addresses, setAddresses] = useState<AddressItem[]>([]);
    const [orders, setOrders] = useState<CustomerOrder[]>([]);
    const [totalOrders, setTotalOrders] = useState<number>(0);
    const [totalExpend, setTotalExpend] = useState<number>(0);
    const [saving, setSaving] = useState(false);

    // Form instances
    const [infoForm] = Form.useForm();
    const [passwordForm] = Form.useForm();
    const [addressForm] = Form.useForm();

    // Modal state for Address
    const [addressModalVisible, setAddressModalVisible] = useState(false);
    const [editingAddress, setEditingAddress] = useState<AddressItem | null>(null);

    // Fetch user profile info from GET /auth/me & orders from GET /customer/:id
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res: any = await axiosClient.get(`${URL}/auth/me`);
                if (res) {
                    const currentId = res.id;
                    setUserId(currentId);
                    const formattedData: UserProfileData = {
                        fullName: res.fullname || res.name || "",
                        email: res.email || "",
                        phone: res.phone || "",
                        gender: res.gender || "male",
                        avatar: res.image || res.avatar || "",
                    };
                    setProfileData(formattedData);
                    infoForm.setFieldsValue(formattedData);
                    localStorage.setItem("user", JSON.stringify(res));

                    // Fetch customer orders
                    try {
                        const customerRes: any = await axiosClient.get(`${URL}/customer/${currentId}`);
                        if (customerRes) {
                            if (customerRes.orders) {
                                setOrders(customerRes.orders);
                            }
                            if (customerRes.totalOrders !== undefined) {
                                setTotalOrders(customerRes.totalOrders);
                            }
                            if (customerRes.totalExpend !== undefined) {
                                setTotalExpend(customerRes.totalExpend);
                            }
                        }
                    } catch (customerErr) {
                        console.error("Fetch customer details error:", customerErr);
                    }
                }
            } catch (err) {
                console.error("Fetch profile error:", err);
            }
        };

        fetchUserProfile();
    }, [infoForm]);

    // Save Personal Profile Info (PATCH /auth/:id)
    const handleSaveProfile = useCallback(async (values: Partial<UserProfileData>) => {
        const targetId = userId || JSON.parse(localStorage.getItem("user") || "{}").id;
        setSaving(true);
        try {
            if (targetId) {
                const res: any = await axiosClient.patch(`${URL}/auth/${targetId}`, {
                    name: values.fullName,
                    phone: values.phone,
                });
                message.success(res?.message || "Cập nhật thông tin tài khoản thành công!");
                if (res?.data) {
                    setProfileData((prev) => ({
                        ...prev,
                        fullName: res.data.fullname || values.fullName || prev.fullName,
                        phone: res.data.phone || values.phone || prev.phone,
                    }));
                    localStorage.setItem("user", JSON.stringify(res.data));
                    window.dispatchEvent(new Event("auth-change"));
                }
            } else {
                setProfileData((prev) => ({ ...prev, ...values }));
                message.success("Cập nhật thông tin tài khoản thành công!");
            }
        } catch (err: any) {
            message.error(typeof err === "string" ? err : err.message || "Cập nhật thông tin thất bại!");
        } finally {
            setSaving(false);
        }
    }, [userId]);

    // Save Change Password (PATCH /auth/password/:id)
    const handleChangePassword = useCallback(async (values: any) => {
        const targetId = userId || JSON.parse(localStorage.getItem("user") || "{}").id;

        if (!targetId) {
            message.error("Không tìm thấy thông tin tài khoản!");
            return;
        }

        setSaving(true);
        try {
            const res: any = await axiosClient.patch(`${URL}/auth/password/${targetId}`, {
                old_password: values.currentPassword,
                new_password: values.newPassword,
            });

            message.success(res?.message || "Đổi mật khẩu thành công!");
            passwordForm.resetFields();
        } catch (err: any) {
            message.error(typeof err === "string" ? err : err.message || "Đổi mật khẩu thất bại!");
        } finally {
            setSaving(false);
        }
    }, [userId, passwordForm]);

    // Open Modal for Add/Edit Address
    const handleOpenAddressModal = useCallback((item?: AddressItem) => {
        if (item) {
            setEditingAddress(item);
            addressForm.setFieldsValue(item);
        } else {
            setEditingAddress(null);
            addressForm.resetFields();
        }
        setAddressModalVisible(true);
    }, [addressForm]);

    const handleCloseAddressModal = useCallback(() => {
        setAddressModalVisible(false);
    }, []);

    // Save Address
    const handleSaveAddress = useCallback(async () => {
        try {
            const values = await addressForm.validateFields();
            if (editingAddress) {
                setAddresses((prev) =>
                    prev.map((addr) => (addr.id === editingAddress.id ? { ...addr, ...values } : addr))
                );
                message.success("Cập nhật địa chỉ thành công!");
            } else {
                setAddresses((prev) => [
                    ...prev,
                    {
                        id: Date.now(),
                        ...values,
                        isDefault: prev.length === 0,
                    },
                ]);
                message.success("Thêm địa chỉ mới thành công!");
            }
            setAddressModalVisible(false);
        } catch {
            // Validation failed
        }
    }, [addressForm, editingAddress]);

    // Set Default Address
    const handleSetDefaultAddress = useCallback((id: number) => {
        setAddresses((prev) =>
            prev.map((addr) => ({ ...addr, isDefault: addr.id === id }))
        );
        message.success("Đã đặt làm địa chỉ giao hàng mặc định");
    }, []);

    // Delete Address
    const handleDeleteAddress = useCallback((id: number) => {
        setAddresses((prev) => prev.filter((addr) => addr.id !== id));
        message.success("Đã xóa địa chỉ thành công");
    }, []);

    // Logout (POST /auth/logout)
    const handleLogout = useCallback(async () => {
        try {
            await axiosClient.post(`${URL}/auth/logout`);
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
            window.dispatchEvent(new Event("auth-change"));
            message.info("Đã đăng xuất khỏi tài khoản");
            navigate(`/${config.routes.LOGIN}`);
        }
    }, [navigate]);

    return (
        <div className="profile-page-container">
            <Breadcrumb
                items={[
                    { title: <span onClick={() => navigate("/")} style={{ cursor: "pointer" }}>Trang chủ</span> },
                    { title: "Tài khoản của tôi" },
                ]}
            />

            <div className="profile-layout">
                <ProfileSidebar
                    profileData={profileData}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    addressesCount={addresses.length}
                    onLogout={handleLogout}
                />

                <div className="profile-content-card">
                    {activeTab === "info" && (
                        <PersonalInfoTab
                            form={infoForm}
                            profileData={profileData}
                            onSaveProfile={handleSaveProfile}
                            saving={saving}
                        />
                    )}

                    {activeTab === "password" && (
                        <ChangePasswordTab
                            form={passwordForm}
                            onChangePassword={handleChangePassword}
                            saving={saving}
                        />
                    )}

                    {activeTab === "address" && (
                        <AddressBookTab
                            addresses={addresses}
                            addressForm={addressForm}
                            addressModalVisible={addressModalVisible}
                            editingAddress={editingAddress}
                            onOpenAddressModal={handleOpenAddressModal}
                            onCloseAddressModal={handleCloseAddressModal}
                            onSaveAddress={handleSaveAddress}
                            onSetDefaultAddress={handleSetDefaultAddress}
                            onDeleteAddress={handleDeleteAddress}
                        />
                    )}

                    {activeTab === "orders" && (
                        <RecentOrdersTab
                            orders={orders}
                            totalOrders={totalOrders}
                            totalExpend={totalExpend}
                            formatCurrency={formatCurrency}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default Profile;
