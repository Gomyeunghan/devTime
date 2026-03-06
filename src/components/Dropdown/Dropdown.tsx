import { useState, useRef, useEffect } from "react";
import S from "./Dropdown.module.css";

function Dropdown({
    inputLabel,
    options,
    value,
    onChange,
}: {
    inputLabel?: string;
    options: readonly string[];
    value: string;
    onChange: (value: string) => void;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (option: string) => {
        onChange(option);
        setIsOpen(false);
    };

    return (
        <div className={S.container} ref={ref}>
            {inputLabel && <div>{inputLabel}</div>}
            <div className={S.trigger} onClick={() => setIsOpen(prev => !prev)}>
                <span>{value || options[0]}</span>
                <span className={`${S.arrow} ${isOpen ? S.open : ""}`}>∧</span>
            </div>
            {isOpen && (
                <ul className={S.list}>
                    {options.map(option => (
                        <li
                            key={option}
                            className={`${S.item} ${value === option ? S.selected : ""}`}
                            onClick={() => handleSelect(option)}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Dropdown;
