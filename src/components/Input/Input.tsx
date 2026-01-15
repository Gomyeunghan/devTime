import { useState, type HTMLInputTypeAttribute } from "react";
import S from "./Input.module.css";

function Input({
    placeholder,
    inputLabel,
    isValid,
    feedBackText,
    onChanage,
    type,
    available,
    onBlur,
}: {
    placeholder: string;
    inputLabel?: string;
    isValid: boolean;
    available?: boolean;
    feedBackText?: string;
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

    const hasAvailableCheck = available !== undefined;

    const showError = touched && !isValid;
    const showSuccess = touched && isValid && available === true;

    const showWarning =
        hasAvailableCheck && touched && isValid && available !== true;
    return (
        <div className={S.container}>
            <div>{inputLabel}</div>
            <div className={`${S.input} ${showError ? S.wrong : ""}`}>
                <input
                    type={type}
                    placeholder={placeholder}
                    onChange={onChanage}
                    onBlur={handleBlur}
                />
            </div>
            <span
                className={`${S.feedBackText} ${
                    showError
                        ? S.wrong
                        : showSuccess
                        ? S.sucsses
                        : showWarning
                        ? S.wrong
                        : S.hidden
                }`}
            >
                {feedBackText}
            </span>
        </div>
    );
}
export default Input;
