import { useState, type HTMLInputTypeAttribute } from "react";
import S from "./Input.module.css";

function Input({
    name,
    placeholder,
    inputLabel,
    isValid,
    feedBackText,
    onChange,
    type,
    onBlur,
}: {
    name: string;
    placeholder: string;
    inputLabel?: string;
    isValid: boolean | null;
    feedBackText: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
            <div className={`${S.input} ${showError ? S.wrong : ""}`}>
                <input
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    onChange={onChange}
                    onBlur={handleBlur}
                />
            </div>

            <span
                className={`${S.feedBackText} ${
                    showError ? S.wrong : showSuccess ? S.success : ""
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
