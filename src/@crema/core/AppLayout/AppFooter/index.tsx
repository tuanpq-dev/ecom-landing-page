import { Divider, Layout } from "antd";
import {
    FacebookFilled,
    InstagramFilled,
    MailOutlined,
    MessageFilled,
    PhoneOutlined,
    TikTokFilled,
    YoutubeFilled,
} from "@ant-design/icons";
import './AppFooter.css';

function AppFooter() {
    const { Footer } = Layout;
    return (
        <Footer className="sea-footer">
            <section className="sea-footer-top">
                <div className="sea-footer-top-left-wrapper">
                    <div className="sea-footer-top-left">
                        <div className="sea-foot-title">ESSENTIAL lắng nghe bạn!</div>
                        <div className="sea-foot-caption">Chúng tôi luôn trân trọng và mong đợi nhận được ý kiến đóng góp từ khách hàng để có thể nâng cao trải nghiệm dịch vụ và sản phẩm tốt hơn nữa.</div>
                        <button className="sea-foot-button">ĐÓNG GÓP Ý KIẾN</button>
                    </div>
                    <div>
                        <div className="sea-foot-contact">
                            <div className="sea-foot-contact-icon">
                                <PhoneOutlined />
                            </div>
                            <div className="sea-foot-contact-detail">
                                <div>Hotline</div>
                                <span>0369585104</span>
                            </div>
                        </div>
                        <div className="sea-foot-contact sea-foot-contact-email">
                            <div className="sea-foot-contact-icon">
                                <MailOutlined />
                            </div>
                            <div className="sea-foot-contact-detail">
                                <div>Email</div>
                                <span>essential@gmail.com</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="sea-footer-network">
                    {/* Facebook */}
                    <a href="https://facebook.com" target="_blank" rel="noreferrer" className="sea-network-icon" title="Facebook">
                        <FacebookFilled style={{ fontSize: 20 }} />
                    </a>

                    {/* Zalo / Message */}
                    <a href="https://zalo.me" target="_blank" rel="noreferrer" className="sea-network-icon" title="Zalo">
                        <MessageFilled style={{ fontSize: 20 }} />
                    </a>

                    {/* TikTok */}
                    <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="sea-network-icon" title="TikTok">
                        <TikTokFilled style={{ fontSize: 20 }} />
                    </a>

                    {/* Instagram */}
                    <a href="https://instagram.com" target="_blank" rel="noreferrer" className="sea-network-icon" title="Instagram">
                        <InstagramFilled style={{ fontSize: 20 }} />
                    </a>

                    {/* YouTube */}
                    <a href="https://youtube.com" target="_blank" rel="noreferrer" className="sea-network-icon" title="YouTube">
                        <YoutubeFilled style={{ fontSize: 20 }} />
                    </a>
                </div>
            </section>


            <Divider style={{ borderColor: "#222222", margin: "24px 0" }} />

            <section style={{ textAlign: "center", color: "#666666", fontSize: 13 }}>
                <div>© 2026 ESSENTIAL. All rights reserved.</div>
            </section>
        </Footer>
    );
}

export default AppFooter;