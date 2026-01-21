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
} from "@/api/signup";

import type { FieldStatus } from "@/types/feedback.type";
import { NICKNAME_MESSAGE } from "@/constants/messages/nickName";
import { EMAIL_MESSAGE } from "@/constants/messages/email";

/**
 * Render the sign-up form and manage its validation, duplicate checks, and submission flow.
 *
 * The component maintains local form state for email, nickname, password, and confirmation;
 * validates inputs in real time; performs asynchronous email and nickname duplication checks;
 * and submits the collected values to the signup API when validation and duplicate checks pass.
 *
 * @returns The React element for the sign-up form UI
 */
function Signup() {
    const [formValue, setFormValue] = useState({
        email: "",
        nickname: "",
        password: "",
        confirmPassword: "",
    });
    const [emailStatus, setEmailStatus] = useState<FieldStatus>("IDLE");
    const [emailMessage, setEmailMessage] = useState<string>("");
    const [nicknameStatus, setNicknameStatus] = useState<FieldStatus>("IDLE");
    const [nicknameMessage, setNicknameMessage] = useState<string>("");
    const [touched, setTouched] = useState({
        email: false,
        password: false,
        nickName: false,
        confirmPassword: false,
    });

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
            status: "NEED_CHECK" as const,
        };
    };
    const validateNicknameField = (nickName: string) => {
        if (!validateNickname(nickName)) {
            return {
                status: "INVALID_FORMAT" as const,
            };
        }
        return {
            status: "NEED_CHECK" as const,
        };
    };

    const fieldHandler: Partial<Record<keyof typeof formValue, () => void>> = {
        email: () => {
            const { status } = validateEmailField(formValue.email);
            setEmailStatus(status);
            setEmailMessage(EMAIL_MESSAGE[status]);
        },
        nickname: () => {
            const { status } = validateNicknameField(formValue.nickname);
            setNicknameStatus(status);
            setNicknameMessage(NICKNAME_MESSAGE[status]);
        },
    };

    // 타입설명 formValue의 키는 ()=>void 이며 옵셔널하다
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const field = e.target.name as keyof typeof formValue;

        setFormValue(prev => ({
            ...prev,
            [field]: e.target.value,
        }));

        fieldHandler[field]?.();
    };

    const clickEmailDuplicate = async () => {
        try {
            const result = await checkEmailDuplicate(formValue.email);

            const status: FieldStatus = result.available
                ? "AVAILABLE"
                : "DUPLICATE";

            setEmailStatus(status);
            setEmailMessage(result.message);
        } catch {
            setEmailStatus("ERROR");
        }
    };
    const emailFeedbackMessage =
        emailStatus === "AVAILABLE" || emailStatus === "DUPLICATE"
            ? emailMessage
            : EMAIL_MESSAGE[emailStatus];

    const clickNickNameDuplicate = async () => {
        try {
            const result = await checkNicknameDuplicate(formValue.nickname);

            const status: FieldStatus = result.available
                ? "AVAILABLE"
                : "DUPLICATE";
            setNicknameStatus(status);
            setNicknameMessage(result.message);
        } catch (error) {}
    };
    const nicknameFeedbackMessage =
        nicknameStatus === "AVAILABLE" || nicknameStatus === "DUPLICATE"
            ? nicknameMessage
            : NICKNAME_MESSAGE[nicknameStatus];

    const handleSubmit = async () => {
        if (emailStatus !== "AVAILABLE" && nicknameStatus !== "AVAILABLE") {
            return;
        }
        try {
            const result = await signup(formValue);

            alert(result.message);
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert("알 수 없는 오류가 발생했습니다.");
            }
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
                            name="email"
                            placeholder="이메일을 입력해주세요"
                            isValid={emailStatus === "AVAILABLE"}
                            inputLabel="아이디"
                            feedBackText={emailFeedbackMessage}
                            onChanage={e => handleChange(e)}
                            type="email"
                            onBlur={() => handleBlur("email")}
                        />
                        <Button
                            variant="secondary"
                            disabled={!validateEmail(formValue.email)}
                            onClick={clickEmailDuplicate}
                        >
                            중복확인
                        </Button>
                    </div>
                    <div className={S.formWrapper}>
                        <Input
                            name="nickname"
                            placeholder="닉네임을 입력해주세요"
                            isValid={nicknameStatus === "AVAILABLE"}
                            inputLabel="닉네임"
                            feedBackText={nicknameFeedbackMessage}
                            onChanage={e => handleChange(e)}
                            type="text"
                            onBlur={() => handleBlur("nickName")}
                        />
                        <Button
                            variant="secondary"
                            disabled={!validateNickname(formValue.nickname)}
                            onClick={clickNickNameDuplicate}
                        >
                            중복확인
                        </Button>
                    </div>
                    <Input
                        name="password"
                        placeholder="비밀번호를 입력해주세요"
                        isValid={validatePassword(formValue.password)}
                        inputLabel="비밀번호"
                        feedBackText={
                            validatePassword(formValue.password)
                                ? ""
                                : "비밀번호는 8자 이상, 영문과 숫자 조합이어야 합니다."
                        }
                        onChanage={e => handleChange(e)}
                        onBlur={() => handleBlur("password")}
                        type="password"
                    />
                    <Input
                        name="confirmPassword"
                        placeholder="비밀번호를 다시 입력해 주세요"
                        isValid={validatePasswordConfirm(
                            formValue.password,
                            formValue.confirmPassword,
                        )}
                        inputLabel="비밀번호"
                        feedBackText={
                            validatePasswordConfirm(
                                formValue.password,
                                formValue.confirmPassword,
                            )
                                ? ""
                                : "비밀번호가 일치하지 않습니다."
                        }
                        onChanage={e => handleChange(e)}
                        onBlur={() => handleBlur("confirmPassword")}
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
                            !validateEmail(formValue.email) ||
                            !validatePassword(formValue.password) ||
                            !validateNickname(formValue.nickname) ||
                            !validatePasswordConfirm(
                                formValue.password,
                                formValue.confirmPassword,
                            ) ||
                            emailStatus !== "AVAILABLE" ||
                            nicknameStatus !== "AVAILABLE"
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