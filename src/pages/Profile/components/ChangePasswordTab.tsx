import React from "react";
import { Form, Button, type FormInstance } from "antd";
import { LockOutlined } from "@ant-design/icons";
import FormInput from "../../../@crema/core/Form/FormInput";

interface ChangePasswordTabProps {
    form: FormInstance;
    onChangePassword: (values: any) => void;
    saving: boolean;
}

export const ChangePasswordTab: React.FC<ChangePasswordTabProps> = React.memo(({
    form,
    onChangePassword,
    saving,
}) => {
    return (
        <div>
            <div className="tab-header">
                <h2 className="tab-title">Đổi Mật Khẩu</h2>
                <p className="tab-desc">Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác</p>
            </div>

            <Form
                form={form}
                layout="vertical"
                className="profile-form"
                onFinish={onChangePassword}
                style={{ maxWidth: 540 }}
            >
                <FormInput
                    fieldName="currentPassword"
                    label="Mật khẩu hiện tại"
                    isPassword
                    prefix={<LockOutlined />}
                    size="large"
                    placeholder="••••••••"
                    rules={[{ required: true, message: "Vui lòng nhập mật khẩu hiện tại!" }]}
                />

                <FormInput
                    fieldName="newPassword"
                    label="Mật khẩu mới"
                    isPassword
                    prefix={<LockOutlined />}
                    size="large"
                    placeholder="Tối thiểu 6 ký tự"
                    hasFeedback
                    rules={[
                        { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                        { min: 6, message: "Mật khẩu mới tối thiểu 6 ký tự!" }
                    ]}
                />

                <FormInput
                    fieldName="confirmPassword"
                    label="Xác nhận mật khẩu mới"
                    isPassword
                    prefix={<LockOutlined />}
                    size="large"
                    placeholder="Nhập lại mật khẩu mới"
                    dependencies={["newPassword"]}
                    hasFeedback
                    rules={[
                        { required: true, message: "Vui lòng xác nhận mật khẩu mới!" },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue("newPassword") === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error("Mật khẩu mới không khớp!"));
                            },
                        }),
                    ]}
                />

                <Form.Item style={{ marginTop: 24 }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="profile-submit-btn"
                        loading={saving}
                    >
                        Cập Nhật Mật Khẩu
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
});
