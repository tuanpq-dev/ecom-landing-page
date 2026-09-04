import { useRoutes, useNavigate } from "react-router";
import { useEffect } from "react";
import routeConfig from "./routeConfig";
import { setNavigate } from "../api/axiosClient";

function AppRoutes() {
    const navigate = useNavigate();
    useEffect(() => {
        setNavigate(navigate);
    }, [navigate]);

    return useRoutes(routeConfig);
}

export default AppRoutes;
