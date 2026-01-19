import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../pages/Home/Home";
import App from "../App";
import DashBoard from "../pages/DashBoard/DashBoard";
import Login from "../pages/Login/Login";
import Profile from "../pages/Profile/Profile";
import Ranking from "../pages/Ranking/Ranking";
import Signup from "../pages/Signup/Signup";

const router = createBrowserRouter([
    {
        path: "/",
        Component: App,
        children: [
            {
                path: "/",
                Component: Home,
            },
            {
                path: "/DashBoard",
                Component: DashBoard,
            },
            {
                path: "/Login",
                Component: Login,
            },
            {
                path: "/Profile",
                Component: Profile,
            },
            {
                path: "/Ranking",
                Component: Ranking,
            },
            {
                path: "/Signup",
                Component: Signup,
            },
        ],
    },
]);

export default router;
