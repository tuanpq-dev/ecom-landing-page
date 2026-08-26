import { useState } from 'react';
import { Form, message } from 'antd';
import {
    SendOutlined,
} from '@ant-design/icons';
import AntInputTextArea from '../../@crema/core/Form/AntInputTextArea';
import FormInput from '../../@crema/core/Form/FormInput';
import './Contact.css';

const TOPICS = ['Tư vấn sản phẩm', 'Đổi / Trả hàng', 'Đặt hàng số lượng lớn', 'Hợp tác', 'Khác'];

function Contact() {
    const [form] = Form.useForm();
    const [activeTopic, setActiveTopic] = useState<string>('Tư vấn sản phẩm');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        try {
            setLoading(true);
            await new Promise(r => setTimeout(r, 1000));
            message.success('Gửi thành công! Chúng tôi sẽ liên hệ bạn sớm nhất.');
            form.resetFields();
            setActiveTopic('Tư vấn sản phẩm');
        } catch {
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="contact-page">
            <div className="contact-body">
                <div className="contact-form-card">
                    <div className="contact-form-title">Gửi tin nhắn</div>
                    <div className="contact-form-subtitle">Điền thông tin bên dưới, chúng tôi sẽ liên hệ lại sớm nhất</div>

                    <Form form={form} layout="vertical">
                        <div className="contact-form-topic">
                            <div className="contact-form-topic-label">Chủ đề</div>
                            <div className="contact-form-topic-list">
                                {TOPICS.map((t) => (
                                    <button
                                        key={t}
                                        type="button"
                                        className={`contact-topic-btn${activeTopic === t ? ' active' : ''}`}
                                        onClick={() => setActiveTopic(t)}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="contact-form-row">
                            <FormInput
                                fieldName="name"
                                label="Họ và tên"
                                rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                            />
                            <FormInput
                                fieldName="phone"
                                label="Số điện thoại"
                                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                            />
                        </div>

                        <FormInput
                            fieldName="email"
                            label="Email"
                            rules={[
                                { required: true, message: 'Vui lòng nhập email' },
                                { type: 'email', message: 'Email không hợp lệ' },
                            ]}
                        />

                        <AntInputTextArea
                            fieldName="content"
                            label="Nội dung"
                            rows={5}
                            placeholder="Mô tả chi tiết câu hỏi hoặc yêu cầu của bạn..."
                        />

                        <button
                            type="button"
                            className="contact-submit-btn"
                            onClick={handleSubmit}
                            disabled={loading}
                            id="contact-submit"
                        >
                            {loading ? 'Đang gửi…' : (
                                <><SendOutlined style={{ marginRight: 8 }} />Gửi tin nhắn</>
                            )}
                        </button>
                    </Form>
                </div>

                <div className="contact-info">
                    <div className="contact-map">
                        <iframe
                            title="Bản đồ cửa hàng"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4451.039263392364!2d105.80031377595536!3d21.042876180609934!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab0068c613ef%3A0x45b002caa61f9c4f!2sOpenBox%20Coffee%20%26%20Working%20Space!5e1!3m2!1svi!2s!4v1786176425289!5m2!1svi!2s"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contact;