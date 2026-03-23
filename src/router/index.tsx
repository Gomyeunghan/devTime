import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home/Home";
import DashBoard from "../pages/DashBoard/DashBoard";
import Login from "../pages/Login/Login";
import MyPageEdit from "../pages/MyPageEdit/MyPageEdit";
import Ranking from "../pages/Ranking/Ranking";
import Signup from "@/pages/Signup/Signup";
import Profile from "@/pages/Profile/Profile";
import MyPage from "@/pages/MyPage/MyPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />, // App이 Layout 역할
        children: [
            // 기존 routes가 children으로
            { index: true, element: <Home /> },
            { path: "DashBoard", element: <DashBoard /> },
            { path: "mypage", element: <MyPage /> },
            { path: "edit", element: <MyPageEdit /> },
            { path: "Ranking", element: <Ranking /> },
        ],
    },
    // Login, Signup은 Header 없이 별도 분리
    { path: "/Login", element: <Login /> },
    { path: "/Signup", element: <Signup /> },
    { path: "Profile", element: <Profile /> },
]);

export default router;
