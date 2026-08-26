import React from "react";
import config from "../config/config";

const Home = React.lazy(() => import("../pages/Home"));
const Product = React.lazy(() => import("../pages/Product"));
const About = React.lazy(() => import("../pages/About"));
const Contact = React.lazy(() => import("../pages/Contact"));
const ProductDetail = React.lazy(() => import("../pages/Product/detail"));
const Login = React.lazy(() => import("../pages/Login"));
const Register = React.lazy(() => import("../pages/Register"));
const ForgotPassword = React.lazy(() => import("../pages/ForgotPassword"));
const ResetPassword = React.lazy(() => import("../pages/ResetPassword"));
const Cart = React.lazy(() => import("../pages/Cart"));
const Checkout = React.lazy(() => import("../pages/Checkout"));
const Profile = React.lazy(() => import("../pages/Profile"));
const Order = React.lazy(() => import("../pages/Order"));
const Wishlist = React.lazy(() => import("../pages/Wishlist"));

export const routeConfig = [
    {
        path: "/",
        element: <Home />,
    },
    {
        path: config.routes.HOME,
        element: <Home />,
    },
    {
        path: config.routes.LOGIN,
        element: <Login />,
    },
    {
        path: config.routes.REGISTER,
        element: <Register />,
    },
    {
        path: config.routes.FORGOT_PASSWORD,
        element: <ForgotPassword />,
    },
    {
        path: config.routes.RESET_PASSWORD,
        element: <ResetPassword />,
    },
    {
        path: config.routes.CART,
        element: <Cart />,
    },
    {
        path: config.routes.CHECKOUT,
        element: <Checkout />,
    },
    {
        path: config.routes.PROFILE,
        element: <Profile />,
    },
    {
        path: config.routes.ORDER,
        element: <Order />,
    },
    {
        path: config.routes.WISHLIST,
        element: <Wishlist />,
    },
    {
        path: config.routes.PRODUCT,
        element: <Product />
    },
    {
        path: config.routes.PRODUCT_DETAIL(":id"),
        element: <ProductDetail />
    },
    {
        path: config.routes.ABOUT,
        element: <About />
    },
    {
        path: config.routes.CONTACT,
        element: <Contact />
    }
];

export default routeConfig;