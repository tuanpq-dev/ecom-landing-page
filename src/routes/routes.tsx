import { useRoutes } from "react-router";
import routeConfig from "./routeConfig";

function AppRoutes() {
    return useRoutes(routeConfig);
}

export default AppRoutes;
