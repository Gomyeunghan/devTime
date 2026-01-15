import Input from "@/components/Input/Input";
import S from "./SignUp.module.css";
import Logo from "@assets/Logo_white.png";
import Button from "@/components/Button/Button";
import { useState } from "react";
import {
    validateEmail,
    validateNickname,
    validatePassword,
    validatePasswordConfirm,
} from "@/utils/validation";
import {
    checkEmailDuplicate,
    checkNicknameDuplicate,
    signup,
} from "@/utils/signUp";

function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nickName, setNickName] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [emailCheckMessage, setEmailCheckMessage] = useState("");
    const [emailAvailable, setEmailAvailable] = useState(false);
    const [nickNameCheckMessage, setNicknameCheckMessage] = useState("");
    const [nickNameAvailable, setNicknameAvailable] = useState(false);
    const [isEmailChecked, setIsEmailChecked] = useState(false);
    const [isNicknameChecked, setIsNicknameChecked] = useState(false);

    const [touched, setTouched] = useState({
        email: false,
        password: false,
        nickName: false,
        passwordConfirm: false,
    });

    const getEmailFeedback = () => {
        if (isEmailChecked && emailCheckMessage) {
            return emailCheckMessage;
        }

        if (email && validateEmail(email) && !isEmailChecked) {
            return "중복 확인이 필요합니다.";
        }

        return "이메일 형식으로 작성해 주세요.";
    };

    const getEmailValid = () => {
        if (isEmailChecked) {
            return emailAvailable;
        }

        return validateEmail(email);
    };

    const getNicknameFeedback = () => {
        if (isNicknameChecked && nickNameCheckMessage) {
            return nickNameCheckMessage;
        }
        if (nickName && validateNickname(nickName) && !isNicknameChecked) {
            return "중복 확인이 필요합니다.";
        }
        return "닉네임을 입력해 주세요.";
    };

    const getNicknameValid = () => {
        if (isNicknameChecked) {
            return nickNameAvailable;
        }
        return validateNickname(nickName);
    };
    const handleBlur = (field: keyof typeof touched) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setEmailCheckMessage("");
        setEmailAvailable(false);
    };
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };
    const handlePasswordConfirmChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setPasswordConfirm(e.target.value);
    };

    const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNickName(e.target.value);
        setNicknameCheckMessage("");
        setNicknameAvailable(false);
    };

    const handleSubmit = async () => {
        if (!isEmailChecked && !isNicknameChecked) {
            return;
        }
        try {
            const result = await signup({
                email,
                nickname: nickName,
                password,
                confirmPassword: passwordConfirm,
            });

            alert(result.message);
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert("알 수 없는 오류가 발생했습니다.");
            }
        }
    };
    const clickEmailDuplicate = async () => {
        try {
            const result = await checkEmailDuplicate(email);
            setEmailCheckMessage(result.message);
            setEmailAvailable(result.available);
            setIsEmailChecked(true);
            console.log(result);
        } catch (error) {
            throw error;
        }
    };
    const clickNickNameDuplicate = async () => {
        try {
            const result = await checkNicknameDuplicate(nickName);
            setNicknameAvailable(result.available);
            setNicknameCheckMessage(result.message);
            setIsNicknameChecked(true);
            console.log(result);
        } catch (error) {
            throw error;
        }
    };

    return (
        <div className={S.container}>
            <div className={S.decorateConatainer}>
                <img src={Logo} alt="DevTimelogoImage" />
                <span>개발자를 위한 타이머</span>
            </div>
            <div className={S.signupContainer}>
                <div style={{ minWidth: "420px", padding: "0px 240px" }}>
                    <h1>회원가입</h1>
                    <div className={S.formWrapper}>
                        <Input
                            placeholder="이메일을 입력해주세요"
                            isValid={getEmailValid()}
                            available={emailAvailable}
                            inputLabel="아이디"
                            feedBackText={getEmailFeedback()}
                            onChanage={e => handleEmailChange(e)}
                            type="email"
                            onBlur={() => handleBlur("email")}
                        />
                        <Button
                            variant="secondary"
                            disabled={!validateEmail(email)}
                            onClick={clickEmailDuplicate}
                        >
                            중복확인
                        </Button>
                    </div>
                    <div className={S.formWrapper}>
                        <Input
                            placeholder="닉네임을 입력해주세요"
                            isValid={getNicknameValid()}
                            available={nickNameAvailable}
                            inputLabel="닉네임"
                            feedBackText={getNicknameFeedback()}
                            onChanage={e => handleNicknameChange(e)}
                            type="text"
                            onBlur={() => handleBlur("nickName")}
                        />
                        <Button
                            variant="secondary"
                            disabled={!validateNickname(nickName)}
                            onClick={clickNickNameDuplicate}
                        >
                            중복확인
                        </Button>
                    </div>
                    <Input
                        placeholder="비밀번호를 입력해주세요"
                        isValid={validatePassword(password)}
                        inputLabel="비밀번호"
                        feedBackText="비밀번호는 8자 이상, 영문과 숫자 조합이어야 합니다."
                        onChanage={e => handlePasswordChange(e)}
                        onBlur={() => handleBlur("password")}
                        type="password"
                    />
                    <Input
                        placeholder="비밀번호를 다시 입력해 주세요"
                        isValid={validatePasswordConfirm(
                            password,
                            passwordConfirm,
                        )}
                        inputLabel="비밀번호"
                        feedBackText="비밀번호가 일치하지 않습니다."
                        onChanage={e => handlePasswordConfirmChange(e)}
                        onBlur={() => handleBlur("passwordConfirm")}
                        type="password"
                    />
                    <div style={{ marginBottom: "36px" }}>
                        <div className={S.agreement_wrapper}>
                            <span>이용악관</span>
                            <label className={S.label_wrapper}>
                                <span>동의함</span>
                                <input type="checkbox"></input>
                            </label>
                        </div>
                        <div className={S.terms_box}>
                            <div className={S.terms_scroll}>
                                <p>제1조 (목적)</p>
                                <p>
                                    이 약관은 DevTime(이하 “서비스”)의 이용 조건
                                    및 절차, 사용자와 서비스 제공자(회사) 간의
                                    권리, 의무 및 책임사항을 규정함을 목적으로
                                    합니다.
                                </p>

                                <p>제2조 (정의)</p>
                                <p>
                                    서비스: 개발자들이 일상 업무 및 할 일을
                                    효과적으로 관리할 수 있도록 제공되는
                                    DevTime(데브타임) TODO 앱 및 관련 기능을
                                    말합니다.
                                </p>
                                <p>
                                    사용자: 이 약관에 따라 서비스를 이용하는
                                    개인 및 단체를 의미합니다.
                                </p>
                                <p>
                                    계정: 사용자가 서비스를 이용하기 위해
                                    등록하는 고유 식별 정보를 의미합니다.
                                </p>

                                <p>제3조 (약관의 효력 및 변경)</p>
                                <p>
                                    본 약관은 사용자가 서비스에 최초 가입하거나
                                    서비스를 이용하는 시점부터 효력을
                                    발생합니다.
                                </p>
                                <p>
                                    회사는 필요에 따라 본 약관을 변경할 수
                                    있으며, 변경된 약관은 앱 내 공지사항 또는
                                    이메일 등으로 사전에 고지합니다.
                                </p>

                                <p>제4조 (서비스 제공 및 변경)</p>
                                <p>
                                    회사는 사용자가 할 일을 등록, 수정, 삭제하고
                                    일정을 관리할 수 있도록 서비스를 제공합니다.
                                </p>

                                <p>제5조 (사용자의 의무)</p>
                                <p>
                                    사용자는 서비스 이용 시 관련 법령 및 본
                                    약관을 준수해야 합니다.
                                </p>

                                <p>제6조 (개인정보 보호)</p>
                                <p>
                                    회사는 개인정보 보호 관련 법령을 준수하며,
                                    별도의 개인정보 처리방침에 따라 사용자의
                                    개인정보를 안전하게 관리합니다.
                                </p>

                                <p>제7조 (서비스 이용 제한 및 중지)</p>
                                <p>
                                    회사는 사용자가 본 약관을 위반한 경우 경고
                                    후 서비스 이용을 제한하거나 중지할 수
                                    있습니다.
                                </p>

                                <p>제8조 (책임의 제한)</p>
                                <p>
                                    회사는 천재지변, 불가항력적 사유 등으로 인한
                                    서비스 제공 중단에 대해 책임을 지지
                                    않습니다.
                                </p>

                                <p>제9조 (준거법 및 관할법원)</p>
                                <p>
                                    본 약관은 대한민국 법률에 따라 해석 및
                                    적용됩니다.
                                </p>

                                <p>제10조 (부칙)</p>
                                <p>본 약관은 2024년 2월 1일부터 시행됩니다.</p>
                            </div>
                        </div>
                    </div>
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={
                            !validateEmail(email) ||
                            !validatePassword(password) ||
                            !validateNickname(nickName) ||
                            !validatePasswordConfirm(
                                password,
                                passwordConfirm,
                            ) ||
                            !isEmailChecked ||
                            !emailAvailable ||
                            !isNicknameChecked ||
                            !nickNameAvailable
                        }
                    >
                        회원가입
                    </Button>
                </div>
            </div>
        </div>
    );
}
export default Signup;
