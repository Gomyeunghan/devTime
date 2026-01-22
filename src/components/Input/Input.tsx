import { useState, type HTMLInputTypeAttribute } from "react";
import S from "./Input.module.css";

/**
 * Render an input control with an optional label, validation styling, and a feedback message.
 *
 * @param isValid - Validation state: `true` for valid, `false` for invalid, or `null` when unset.
 * @param feedBackText - Message shown after the field is touched; hidden until the input has been blurred.
 * @param onChanage - Change event handler for the input element.
 * @param onBlur - Optional callback invoked when the input loses focus (after marking the field as touched).
 *
 * @returns The rendered input element with conditional success/error styles and feedback text.
 */
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