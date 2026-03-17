import Union from "@assets/Union.png";
import S from "./Header.module.css";
import { Link } from "react-router-dom";
import { tokenStorage } from "@/utils/storage";
import useAuthStore from "@/store/authStore";
import User from "@assets/User.svg";
import Logout from "@assets/Logout.svg";
import { getProfile } from "@/api/profile";
import { useQuery } from "@tanstack/react-query";
import DefaultProfile from "@assets/Profile.jpg";
import { useState } from "react";

function Header() {
    const { isLoggedIn } = useAuthStore(state => state);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const { data: profileData } = useQuery({
        queryKey: ["profile"],
        queryFn: getProfile,
        enabled: isLoggedIn,
    });
    const { logout } = useAuthStore();

    return (
        <header className={S.header}>
            <div className={S.container}>
                <h1>
                    <Link to="/">
                        <img src={Union} alt="Logo" />
                    </Link>
                </h1>
                <nav className={S.navWrapper}>
                    <Link to="dashboard">대시보드</Link>
                    <Link to="ranking">랭킹</Link>
                </nav>
            </div>
            {tokenStorage.getAccessToken() && isLoggedIn ? (
                <div
                    className={S.profileBox}
                    onClick={() => {
                        setIsModalOpen(!isModalOpen);
                    }}
                >
                    <img
                        src={
                            profileData
                                ? `https://dev-time-bucket.s3.ap-northeast-2.amazonaws.com/${profileData?.profile.profileImage}`
                                : DefaultProfile
                        }
                        style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "100%",
                        }}
                    />
                    {profileData?.nickname}
                </div>
            ) : (
                <nav className={S.navWrapper}>
                    <Link to="login">로그인</Link>
                    <Link to="signup"> 회원가입</Link>
                </nav>
            )}
            {isModalOpen ? (
                <>
                    <div
                        className={S.overlay}
                        onClick={() => setIsModalOpen(!isModalOpen)}
                    >
                        <div
                            className={S.modalWrapper}
                            onClick={e => e.stopPropagation()}
                        >
                            <Link
                                to={"/myPage"}
                                onClick={() => setIsModalOpen(!isModalOpen)}
                            >
                                <img src={User} />
                                마이페이지
                            </Link>
                            <span className={S.solid}></span>
                            <button onClick={() => logout()}>
                                <img src={Logout} />
                                로그아웃
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                ""
            )}
        </header>
    );
}

export default Header;
