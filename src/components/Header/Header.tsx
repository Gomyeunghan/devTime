import Union from "@assets/Union.png";
import S from "./Header.module.css";
import { Link } from "react-router-dom";
import { tokenStorage } from "@/utils/storage";
import useAuthStore from "@/store/authStore";

function Header() {
    const { isLoggedIn } = useAuthStore(state => state);
    console.log(isLoggedIn);
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
                <Link to="profile">프로필</Link>
            ) : (
                <nav className={S.navWrapper}>
                    <Link to="login">로그인</Link>
                    <Link to="signup"> 회원가입</Link>
                </nav>
            )}
        </header>
    );
}

export default Header;
