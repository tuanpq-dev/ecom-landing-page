import { useEffect } from "react";
import { Layout } from "antd";
import { useLocation } from "react-router";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";
import config from "../../../config/config";
import "./AppLayout.css";

type AppLayoutProps = React.PropsWithChildren;

function AppLayout({ children }: AppLayoutProps) {
    const location = useLocation();

    // Scroll to top of window on route change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname, location.search]);

    // Check if the current path is Auth page (Login, Register, Forgot Password, Reset Password)
    const isAuthPage =
        location.pathname === `/${config.routes.LOGIN}` ||
        location.pathname === `/${config.routes.REGISTER}` ||
        location.pathname === `/${config.routes.FORGOT_PASSWORD}` ||
        location.pathname === `/${config.routes.RESET_PASSWORD}` ||
        location.pathname.startsWith(`/${config.routes.LOGIN}`) ||
        location.pathname.startsWith(`/${config.routes.REGISTER}`) ||
        location.pathname.startsWith(`/${config.routes.FORGOT_PASSWORD}`) ||
        location.pathname.startsWith(`/${config.routes.RESET_PASSWORD}`);

    if (isAuthPage) {
        return (
            <div className="auth-standalone-layout" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
                {children}
            </div>
        );
    }

    return (
        <Layout className="app-layout">
            <AppHeader />

            <Layout.Content className="app-content">
                {children}
            </Layout.Content>

            <AppFooter />
        </Layout>
    );
}

export default AppLayout;