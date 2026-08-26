const routes = {
    ABOUT: 'about',

    CART: 'cart',
    CONTACT: 'contact',
    CATEGORIES: 'categories',
    CHECKOUT: 'checkout',

    HOME: 'home',

    ORDER: 'order',

    RESGISTER: 'register',
    REGISTER: 'register',

    LOGIN: 'login',
    FORGOT_PASSWORD: 'forgot-password',
    RESET_PASSWORD: 'reset-password',

    FAQ: 'faq',

    SETTING: 'setting',

    PROFILE: 'profile',
    PRODUCT: 'product',
    PRODUCT_DETAIL: (id: number) => `/product/${id}`,
    POLICY: 'policy',

    WISHLIST: 'wishlist',
}

export default routes;