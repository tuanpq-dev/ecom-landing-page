import React from "react";
import { Form, Button, Radio, DatePicker, type FormInstance } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import FormInput from "../../../@crema/core/Form/FormInput";
import type { UserProfileData } from "../types";

interface PersonalInfoTabProps {
    form: FormInstance;
    profileData: UserProfileData;
    onSaveProfile: (values: Partial<UserProfileData>) => void;
    saving: boolean;
}

export const PersonalInfoTab: React.FC<PersonalInfoTabProps> = React.memo(({
    form,
    profileData,
    onSaveProfile,
    saving,
}) => {
    return (
        <div>
            <div className="tab-header">
                <h2 className="tab-title">Thông Tin Cá Nhân</h2>
                <p className="tab-desc">Quản lý thông tin hồ sơ cá nhân để bảo vệ tài khoản</p>
            </div>

            <Form
                form={form}
                layout="vertical"
                className="profile-form"
                initialValues={profileData}
                onFinish={onSaveProfile}
                style={{ maxWidth: 540 }}
            >
                <FormInput
                    fieldName="fullName"
                    label="Họ và tên"
                    prefix={<UserOutlined />}
                    size="large"
                    rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
                />

                <FormInput
                    fieldName="email"
                    label="Địa chỉ Email"
                    prefix={<MailOutlined />}
                    size="large"
                    disabled
                />

                <FormInput
                    fieldName="phone"
                    label="Số điện thoại"
                    prefix={<PhoneOutlined />}
                    size="large"
                    rules={[
                        { required: true, message: "Vui lòng nhập số điện thoại!" },
                        { pattern: /^[0-9]{10,11}$/, message: "Số điện thoại gồm 10-11 chữ số!" }
                    ]}
                />

                <Form.Item label="Giới tính" name="gender">
                    <Radio.Group>
                        <Radio value="male">Nam</Radio>
                        <Radio value="female">Nữ</Radio>
                        <Radio value="other">Khác</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item label="Ngày sinh" name="dob">
                    <DatePicker
                        format="DD/MM/YYYY"
                        style={{ width: "100%" }}
                        size="large"
                        placeholder="Chọn ngày sinh"
                    />
                </Form.Item>

                <Form.Item style={{ marginTop: 24 }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="profile-submit-btn"
                        loading={saving}
                    >
                        Lưu Thay Đổi
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
});
