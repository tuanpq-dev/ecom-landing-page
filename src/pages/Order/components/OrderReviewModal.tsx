import { memo, useEffect } from "react";
import { Modal, Rate, message, Form, Input } from "antd";
import { LikeOutlined } from "@ant-design/icons";
import AntInputTextArea from "../../../@crema/core/Form/AntInputTextArea";
import type { ApiOrder } from "../types";
import { parseOrderItemImage } from "../types";
import "./OrderReviewModal.css";
import axiosClient from "../../../api/axiosClient";
import { URL } from "../../../config/apiUrl";

interface OrderReviewModalProps {
    order: ApiOrder | null;
    onClose: () => void;
}

interface RatingWithTextProps {
    value?: number;
    onChange?: (val: number) => void;
}

function RatingWithText({ value = 5, onChange }: RatingWithTextProps) {
    return (
        <div className="review-rating-group">
            <Rate
                value={value}
                onChange={onChange}
                className="review-rating-stars"
            />
        </div>
    );
}

function OrderReviewModalComponent({ order, onClose }: OrderReviewModalProps) {
    const [form] = Form.useForm();

    useEffect(() => {
        if (order) {
            form.setFieldsValue({
                rating: 5,
                comment: "",
            });
        } else {
            form.resetFields();
        }
    }, [order, form]);

    if (!order) return null;

    const handleSubmit = async (values: any) => {
        try {
            await axiosClient.post(`${URL}/review/${order.id}`, values)
            message.success("Cảm ơn bạn đã gửi đánh giá sản phẩm!");
        } catch (err) {
            message.error(err);
        }
        onClose();
    };

    return (
        <Modal
            title={
                <div className="review-modal-title">
                    <span>Đánh Giá Sản Phẩm</span>
                    <span className="review-modal-subtitle">
                        (#{order.orderCode || order.id})
                    </span>
                </div>
            }
            open={!!order}
            onCancel={onClose}
            onOk={() => form.submit()}
            okText="Gửi Đánh Giá"
            cancelText="Hủy"
            okButtonProps={{
                type: "primary",
                className: "order-btn-primary",
                icon: <LikeOutlined />,
                style: { borderRadius: 8 },
            }}
            cancelButtonProps={{
                style: { borderRadius: 8 },
            }}
            width={720}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <div className="review-modal-body">
                    {order.items?.map((item, index) => {
                        const imgUrl = parseOrderItemImage(item);
                        return (
                            <div key={item.id} className="review-item-card">
                                <div className="review-product-header">
                                    <img
                                        src={imgUrl}
                                        alt={item.productName}
                                        className="review-product-img"
                                    />
                                    <div>
                                        <div className="review-product-name">{item.productName}</div>
                                        {item.variantSku && (
                                            <div className="review-product-variant">
                                                SKU: {item.variantSku}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <Form.Item
                                    name={["items", index, "rating"]}
                                    label="Chất lượng sản phẩm"
                                    initialValue={5}
                                >
                                    <RatingWithText />
                                </Form.Item>

                                <Form.Item
                                    name={["items", index, "productId"]}
                                    initialValue={(item as any).productId || item.variant?.product?.id || item.variant?.id || item.id}
                                    hidden
                                >
                                    <Input type="hidden" />
                                </Form.Item>

                                <AntInputTextArea
                                    fieldName={["items", index, "content"]}
                                    label="Nhận xét chi tiết"
                                    rows={3}
                                />
                            </div>
                        );
                    })}
                </div>
            </Form>
        </Modal>
    );
}

export default memo(OrderReviewModalComponent);
