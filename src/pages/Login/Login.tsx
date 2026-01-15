import S from "./Login.module.css";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import Logo from "@assets/Logo-1.png";
import SymbolLogo from "@assets/SymbolLogo.svg";
import { Link } from "react-router-dom";

function Login() {
    const isClick = () => {
        console.log("Clicked");
    };

    const onChangeInput = (e: InputEvent) => {
        console.log("e : ", e);
    };
    return (
        <>
            <div className={S.container}>
                <img
                    src={SymbolLogo}
                    alt="devTimeLogo"
                    className={S.img_position}
                />
                <div className={`${S.loginFormContainer} ${S.bg_styled}`}>
                    <h1 className={S.logo}>
                        <img src={Logo} alt="devTimeLogo" />
                    </h1>
                    <Input
                        isValid={true}
                        placeholder="이메일 주소를 입력해주세요"
                        inputLabel="아이디"
                        feedBackText="아매알 형식으로 작성해 주세요."
                        onChanage={onChangeInput(e)}
                        type="email"
                    />
                    <Input
                        isValid={true}
                        placeholder="비밀번호를 입력해 주세요"
                        inputLabel="비밀번호"
                        feedBackText="아매알 형식으로 작성해 주세요."
                        onChanage={onChangeInput}
                        type="password"
                    />
                    <div className={S.buttonContainer}>
                        <Button onClick={isClick} disabled={true}>
                            로그인
                        </Button>
                    </div>
                    <span className={S.signUpText}>
                        <Link to="/signup">회원가입</Link>
                    </span>
                </div>
            </div>
        </>
    );
}

export default Login;
