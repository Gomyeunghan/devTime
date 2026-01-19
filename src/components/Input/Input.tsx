import { useState, type HTMLInputTypeAttribute } from "react";
import S from "./Input.module.css";

function Input({
    name,
    placeholder,
    inputLabel,
    isValid,
    feedBackText,
    onChanage,
    type,
    onBlur,
}: {
    name: string;
    placeholder: string;
    inputLabel?: string;
    isValid: boolean | null;
    feedBackText: string;
    onChanage: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type: HTMLInputTypeAttribute;
    onBlur?: () => void;
}) {
    const [touched, setTouched] = useState(false);

    const handleBlur = () => {
        setTouched(true);
        if (onBlur) {
            onBlur();
        }
    };

    const showError = touched && isValid === false;
    const showSuccess = touched && isValid === true;
    const showMessage = touched && feedBackText;

    return (
        <div className={S.container}>
            <div>{inputLabel}</div>
            <div
                className={`${S.input} ${
                    showError ? S.wrong : showSuccess ? S.sucsses : ""
                }`}
            >
                <input
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    onChange={onChanage}
                    onBlur={handleBlur}
                />
            </div>

            <span
                className={`${S.feedBackText} ${
                    showError ? S.wrong : showSuccess ? S.sucsses : ""
                }`}
                style={{
                    visibility: showMessage ? "visible" : "hidden",
                }}
            >
                {feedBackText || "placeholder"}
            </span>
        </div>
    );
}
export default Input;
