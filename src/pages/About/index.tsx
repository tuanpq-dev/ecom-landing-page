import {
    HeartOutlined,
    StarOutlined,
    SafetyOutlined,
    InstagramOutlined,
    FacebookOutlined,
} from "@ant-design/icons";
import "./About.css";
import heroBg from "../../assets/about/hero.png";
import storyImg from "../../assets/about/story.png";
import Counter from "../../utils/counter";

/* ── Team data ── */
const team = [
    { id: 1, name: "Nguyễn Minh Anh", role: "Nhà sáng lập & CEO", seed: "t1" },
    { id: 2, name: "Trần Thị Hoa", role: "Giám đốc Sáng tạo", seed: "t2" },
    { id: 3, name: "Lê Quốc Bảo", role: "Trưởng phòng Thiết kế", seed: "t3" },
    { id: 4, name: "Phạm Thu Hiền", role: "Quản lý Vận hành", seed: "t4" },
];

/* ── Stats ── */
const stats = [
    { target: 500, suffix: "+", label: "Khách hàng thân thiết" },
    { target: 200, suffix: "+", label: "Mẫu sản phẩm" },
    { target: 5, suffix: "+", label: "Năm kinh nghiệm" },
    { target: 4.8, suffix: "★", label: "Đánh giá trung bình" },
];

/* ── Values ── */
const values = [
    {
        icon: <StarOutlined />,
        title: "Chất lượng hàng đầu",
        desc: "Mỗi sản phẩm đều được kiểm định kỹ lưỡng từ khâu chọn vải đến hoàn thiện may mặc, đảm bảo đạt tiêu chuẩn cao nhất trước khi đến tay khách hàng.",
    },
    {
        icon: <HeartOutlined />,
        title: "Khách hàng là trung tâm",
        desc: "Chúng tôi lắng nghe và thấu hiểu nhu cầu của từng khách hàng, mang đến trải nghiệm mua sắm thời trang cá nhân hóa và đáng nhớ.",
    },
    {
        icon: <SafetyOutlined />,
        title: "Bền vững & có trách nhiệm",
        desc: "Cam kết sử dụng nguyên liệu thân thiện môi trường và quy trình sản xuất bền vững, góp phần bảo vệ hành tinh cho thế hệ mai sau.",
    },
];

function About() {
    return (
        <div className="about-page">
            {/* ── 1. Hero ── */}
            <section className="about-hero">
                <img src={heroBg} alt="Cửa hàng" className="about-hero-bg" />
                <div className="about-hero-content">
                    <div className="about-hero-eyebrow">
                        <div className="about-hero-line" />
                        <span>Về chúng tôi</span>
                    </div>
                    <h1 className="about-hero-title">
                        Thời trang <em>tinh tế</em>,<br />
                        phong cách <em>riêng</em>
                    </h1>
                    <p className="about-hero-desc">
                        Chúng tôi tin rằng thời trang không chỉ là quần áo — đó là ngôn ngữ
                        thể hiện bản thân. Sứ mệnh của chúng tôi là giúp bạn kể câu chuyện
                        của mình qua từng bộ trang phục.
                    </p>
                </div>
            </section>

            {/* ── 2. Story ── */}
            <section className="about-story">
                <div className="about-story-image-wrap">
                    <img src={storyImg} alt="Câu chuyện thương hiệu" className="about-story-img" />
                    <div className="about-story-image-accent" />
                </div>
                <div className="about-story-text-col">
                    <div className="about-story-eyebrow">
                        <div className="about-story-eyebrow-line" />
                        <span>Câu chuyện của chúng tôi</span>
                    </div>
                    <h2 className="about-story-title">
                        Từ đam mê đến<br />thương hiệu
                    </h2>
                    <p className="about-story-text">
                        Được thành lập năm 2019 bởi nhà thiết kế Nguyễn Minh Anh, thương hiệu
                        của chúng tôi ra đời từ một ước mơ giản dị: mang thời trang chất lượng
                        cao đến gần hơn với người Việt. Bắt đầu từ một xưởng nhỏ tại Hà Nội,
                        chúng tôi đã không ngừng lớn mạnh với phương châm "chất lượng trước,
                        số lượng sau".
                    </p>
                    <p className="about-story-text">
                        Mỗi bộ trang phục là kết quả của hàng trăm giờ thiết kế, lựa chọn
                        nguyên liệu và hoàn thiện tỉ mỉ. Chúng tôi tự hào khi được hàng ngàn
                        khách hàng tin tưởng và đồng hành suốt những năm qua.
                    </p>
                    <div className="about-story-milestones">
                        <div className="about-milestone">
                            <div className="about-milestone-year">2019</div>
                            <div className="about-milestone-label">Thành lập</div>
                        </div>
                        <div className="about-milestone">
                            <div className="about-milestone-year">2021</div>
                            <div className="about-milestone-label">Mở rộng online</div>
                        </div>
                        <div className="about-milestone">
                            <div className="about-milestone-year">2024</div>
                            <div className="about-milestone-label">500+ khách hàng</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 3. Stats ── */}
            <section className="about-stats">
                <div className="about-stats-inner">
                    {stats.map((s) => (
                        <div key={s.label} className="about-stat">
                            <Counter target={s.target} suffix={s.suffix} />
                            <div className="about-stat-label">{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── 4. Team ── */}
            <section className="about-team">
                <div className="about-section-header">
                    <div className="about-section-tag">Đội ngũ</div>
                    <h2 className="about-section-title">Những con người phía sau</h2>
                    <p className="about-section-subtitle">
                        Chúng tôi là những người trẻ đầy nhiệt huyết, cùng chung một niềm
                        đam mê với thời trang và nghề thủ công Việt Nam.
                    </p>
                </div>
                <div className="about-team-grid">
                    {team.map((member) => (
                        <div key={member.id} className="about-team-card">
                            <div className="about-team-avatar-wrap">
                                <img
                                    src={`https://picsum.photos/seed/${member.seed}/400/400`}
                                    alt={member.name}
                                    className="about-team-avatar"
                                />
                                <div className="about-team-social">
                                    <a href="#" aria-label="Facebook">
                                        <FacebookOutlined />
                                    </a>
                                    <a href="#" aria-label="Instagram">
                                        <InstagramOutlined />
                                    </a>
                                </div>
                            </div>
                            <div className="about-team-name">{member.name}</div>
                            <div className="about-team-role">{member.role}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── 5. Values ── */}
            <section className="about-values">
                <div className="about-values-inner">
                    <div className="about-section-header">
                        <div className="about-section-tag">Giá trị cốt lõi</div>
                        <h2 className="about-section-title">Điều chúng tôi tin tưởng</h2>
                        <p className="about-section-subtitle">
                            Ba giá trị cốt lõi dẫn dắt mọi quyết định và hành động của chúng tôi
                            mỗi ngày.
                        </p>
                    </div>
                    <div className="about-values-grid">
                        {values.map((v) => (
                            <div key={v.title} className="about-value-card">
                                <div className="about-value-icon">{v.icon}</div>
                                <div className="about-value-title">{v.title}</div>
                                <p className="about-value-desc">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default About;