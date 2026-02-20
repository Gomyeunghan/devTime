import type { ReactNode } from "react";
import { Portal } from "../Portal/Portal";
import S from "./BaseModal.module.css";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    className?: string;
}

function BaseModal({ isOpen, onClose, children, className }: ModalProps) {
    if (!isOpen) return null;

    return (
        <Portal>
            <div className={S.backdrop} onClick={onClose}>
                <div
                    className={`${S.container} ${className || ""}`}
                    onClick={e => e.stopPropagation()}
                >
                    {children}
                </div>
            </div>
        </Portal>
    );
}
BaseModal.Header = function Header({ children }: { children: ReactNode }) {
    return <div className={S.header}>{children}</div>;
};

BaseModal.Body = function Body({ children }: { children: ReactNode }) {
    return <div className={S.body}>{children}</div>;
};

BaseModal.Footer = function Footer({ children }: { children: ReactNode }) {
    return <div className={S.footer}>{children}</div>;
};

export default BaseModal;
