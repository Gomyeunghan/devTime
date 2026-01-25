import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../pages/Home/Home";
import DashBoard from "../pages/DashBoard/DashBoard";
import Login from "../pages/Login/Login";
import Profile from "../pages/Profile/Profile";
import Ranking from "../pages/Ranking/Ranking";
import Signup from "@/pages/Signup/Signup";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/DashBoard",
        element: <DashBoard />,
    },
    {
        path: "/Login",
        element: <Login />,
    },
    {
        path: "/Profile",
        element: <Profile />,
    },
    {
        path: "/Ranking",
        element: <Ranking />,
    },
    {
        path: "/Signup",
        element: <Signup />,
    },
]);

export default router;
