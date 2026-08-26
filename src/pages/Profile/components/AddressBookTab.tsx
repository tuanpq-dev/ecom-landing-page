import React from "react";
import { Button, Tag, Popconfirm, Modal, Form, type FormInstance } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined } from "@ant-design/icons";
import FormInput from "../../../@crema/core/Form/FormInput";
import AntInputTextArea from "../../../@crema/core/Form/AntInputTextArea";
import type { AddressItem } from "../types";

interface AddressBookTabProps {
    addresses: AddressItem[];
    addressForm: FormInstance;
    addressModalVisible: boolean;
    editingAddress: AddressItem | null;
    onOpenAddressModal: (item?: AddressItem) => void;
    onCloseAddressModal: () => void;
    onSaveAddress: () => void;
    onSetDefaultAddress: (id: number) => void;
    onDeleteAddress: (id: number) => void;
}

export const AddressBookTab: React.FC<AddressBookTabProps> = React.memo(({
    addresses,
    addressForm,
    addressModalVisible,
    editingAddress,
    onOpenAddressModal,
    onCloseAddressModal,
    onSaveAddress,
    onSetDefaultAddress,
    onDeleteAddress,
}) => {
    return (
        <div>
            <div className="tab-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <h2 className="tab-title">Sổ Địa Chỉ Giao Hàng</h2>
                    <p className="tab-desc">Quản lý địa chỉ nhận hàng thuận tiện cho thanh toán</p>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => onOpenAddressModal()}
                    style={{ backgroundColor: "#22242a", borderColor: "#22242a", borderRadius: 8 }}
                >
                    Thêm Địa Chỉ Mới
                </Button>
            </div>

            <div className="address-grid">
                {addresses.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px 0", color: "#8892a0", gridColumn: "1 / -1" }}>
                        Chưa có địa chỉ nào được lưu.
                    </div>
                ) : (
                    addresses.map((item) => (
                        <div
                            key={item.id}
                            className={`address-card ${item.isDefault ? "is-default" : ""}`}
                        >
                            <div className="address-header">
                                <span className="address-name">{item.name}</span>
                                {item.isDefault && (
                                    <Tag icon={<CheckCircleOutlined />} color="gold">
                                        Mặc định
                                    </Tag>
                                )}
                            </div>
                            <div className="address-phone">SĐT: {item.phone}</div>
                            <div className="address-detail">{item.address}</div>

                            <div className="address-actions">
                                {!item.isDefault && (
                                    <Button
                                        type="link"
                                        size="small"
                                        onClick={() => onSetDefaultAddress(item.id)}
                                        style={{ padding: 0, color: "#c89968" }}
                                    >
                                        Thiết lập mặc định
                                    </Button>
                                )}
                                <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
                                    <Button
                                        type="link"
                                        size="small"
                                        icon={<EditOutlined />}
                                        onClick={() => onOpenAddressModal(item)}
                                        style={{ padding: 0, color: "#666" }}
                                    >
                                        Sửa
                                    </Button>
                                    {!item.isDefault && (
                                        <Popconfirm
                                            title="Xóa địa chỉ này?"
                                            onConfirm={() => onDeleteAddress(item.id)}
                                            okText="Xóa"
                                            cancelText="Hủy"
                                        >
                                            <Button
                                                type="link"
                                                size="small"
                                                danger
                                                icon={<DeleteOutlined />}
                                                style={{ padding: 0 }}
                                            >
                                                Xóa
                                            </Button>
                                        </Popconfirm>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Address Modal */}
            <Modal
                title={editingAddress ? "Chỉnh Sửa Địa Chỉ" : "Thêm Địa Chỉ Mới"}
                open={addressModalVisible}
                onCancel={onCloseAddressModal}
                onOk={onSaveAddress}
                okText="Lưu Địa Chỉ"
                cancelText="Hủy"
                okButtonProps={{ style: { backgroundColor: "#22242a", borderColor: "#22242a" } }}
            >
                <Form form={addressForm} layout="vertical" style={{ marginTop: 16 }}>
                    <FormInput
                        fieldName="name"
                        label="Họ và tên người nhận"
                        placeholder="Nguyễn Văn A"
                        rules={[{ required: true, message: "Vui lòng nhập tên người nhận!" }]}
                    />

                    <FormInput
                        fieldName="phone"
                        label="Số điện thoại nhận hàng"
                        placeholder="0912345678"
                        rules={[
                            { required: true, message: "Vui lòng nhập số điện thoại!" },
                            { pattern: /^[0-9]{10,11}$/, message: "Số điện thoại gồm 10-11 chữ số!" }
                        ]}
                    />

                    <AntInputTextArea
                        fieldName="address"
                        label="Địa chỉ chi tiết"
                        rows={3}
                        placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố"
                        rules={[{ required: true, message: "Vui lòng nhập địa chỉ chi tiết!" }]}
                    />
                </Form>
            </Modal>
        </div>
    );
});
