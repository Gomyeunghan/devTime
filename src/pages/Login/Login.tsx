import S from "./Login.module.css";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import Logo from "@assets/Logo-1.png";
import SymbolLogo from "@assets/SymbolLogo.svg";
import { Link } from "react-router-dom";
import { useState } from "react";
import { validateEmail, validatePassword } from "@/utils/validation";
import type { FieldStatus } from "@/types/feedback.type";
import { EMAIL_MESSAGE } from "@/constants/messages/email";
import { login } from "@/api/login";
import { useNavigate } from "react-router-dom";
import Modal from "@/components/Modal/Modal";

function Login() {
    let navigate = useNavigate();
    const [formValue, setFormValue] = useState({
        email: "",
        password: "",
    });
    const [emailStatus, setEmailStatus] = useState<FieldStatus>("IDLE");
    const [emailMessage, setEmailMessage] = useState<string>("");
    const [touched, setTouched] = useState({
        email: false,
        password: false,
    });
    const [isShowModal, setShowModal] = useState(false);

    const handleBlur = (field: keyof typeof touched) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const validateEmailField = (email: string) => {
        if (!validateEmail(email)) {
            return {
                status: "INVALID_FORMAT" as const,
            };
        }

        return {
            status: "AVAILABLE" as const,
        };
    };

    const fieldHandler: Partial<
        Record<keyof typeof formValue, (valie: string) => void>
    > = {
        email: value => {
            const { status } = validateEmailField(value);
            setEmailStatus(status);
            setEmailMessage(EMAIL_MESSAGE[status]);
        },
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const field = e.target.name as keyof typeof formValue;
        const value = e.target.value;

        setFormValue(prev => ({
            ...prev,
            [field]: value,
        }));

        fieldHandler[field]?.(value);
    };
    const emailFeedbackMessage =
        emailStatus === "AVAILABLE" || emailStatus === "DUPLICATE"
            ? emailMessage
            : EMAIL_MESSAGE[emailStatus];

    const handleSubmit = async () => {
        try {
            const result = await login(formValue);
            console.log(result);
            // navigate("/");
            localStorage.setItem("accessToken : ", result.accessToken);
            localStorage.setItem("refreshToken : ", result.refreshToken);
        } catch (error) {
            if (error instanceof Error) {
                setShowModal(!isShowModal);
            } else {
                alert("알수없는 오류가 발생했습니다.");
            }
        }
    };
    /*
인증/인가를 처음 구현하면서 XSS 공격에 취약한 로컬스토리지에
토큰(특히 refresh token)을 저장하는 방식은 지양해야 한다는 점을 학습했다.

다만 현재 서버 구현에서는 refresh token이
Set-Cookie 헤더(HttpOnly)로 내려오지 않고 response body로 전달되고 있어,
프론트엔드 단에서 쿠키로 안전하게 관리할 수 없는 구조였다.

이로 인해 임시적으로 access / refresh token 모두
로컬 저장소에 저장하여 사용하고 있다.
*/

    const onClick = () => {
        setShowModal(!isShowModal);
    };

    return (
        <>
            <div className={S.container}>
                <Modal isShowModal={isShowModal} onClick={onClick}>
                    로그인 정보를 확인해주세요
                </Modal>
                <img
                    src={SymbolLogo}
                    alt="devTimeLogo"
                    className={S.imgPosition}
                />
                <div className={`${S.loginFormContainer} ${S.bgStyled}`}>
                    <h1 className={S.logo}>
                        <img src={Logo} alt="devTimeLogo" />
                    </h1>
                    <Input
                        name="email"
                        isValid={emailStatus === "AVAILABLE"}
                        placeholder="이메일 주소를 입력해주세요"
                        inputLabel="아이디"
                        feedBackText={emailFeedbackMessage}
                        onChange={e => handleChange(e)}
                        type="email"
                        onBlur={() => handleBlur}
                    />
                    <Input
                        name="password"
                        isValid={validatePassword(formValue.password)}
                        placeholder="비밀번호를 입력해 주세요"
                        inputLabel="비밀번호"
                        feedBackText={
                            validatePassword(formValue.password)
                                ? ""
                                : "비밀번호는 8자 이상, 영문과 숫자 조합이어야 합니다."
                        }
                        onChange={e => handleChange(e)}
                        type="password"
                        onBlur={() => handleBlur}
                    />
                    <div className={S.buttonContainer}>
                        <Button
                            onClick={handleSubmit}
                            disabled={
                                emailStatus !== "AVAILABLE" ||
                                !validatePassword(formValue.password)
                            }
                            variant="primary"
                        >
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
