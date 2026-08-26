import "./Home.css";
import HeroBanner from "./components/HeroBanner";
import FeaturesBar from "./components/FeaturesBar";
import CategoryGrid from "./components/CategoryGrid";
import ProductGrid from "./components/ProductGrid";
import Testimonials from "./components/Testimonials";
import NewsletterVoucher from "./components/NewsletterVoucher";

function Home() {
    return (
        <main className="home-page-layout">
            <HeroBanner />
            <FeaturesBar />
            <CategoryGrid />
            <ProductGrid />
            <Testimonials />
            <NewsletterVoucher />
        </main>
    );
}

export default Home;