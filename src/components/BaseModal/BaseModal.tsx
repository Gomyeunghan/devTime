import type { ReactNode } from "react";
import { Portal } from "../Portal/Portal";
import S from "./BaseModal.module.css";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

function Modal({ isOpen, onClose, children }: ModalProps) {
    if (!isOpen) return null;

    return (
        <Portal>
            <div className={S.backdrop} onClick={onClose}>
                <div className={S.container} onClick={e => e.stopPropagation()}>
                    {children}
                </div>
            </div>
        </Portal>
    );
}
Modal.Header = function Header({ children }: { children: ReactNode }) {
    return <div className={S.header}>{children}</div>;
};

Modal.Body = function Body({ children }: { children: ReactNode }) {
    return <div className={S.body}>{children}</div>;
};

Modal.Footer = function Footer({ children }: { children: ReactNode }) {
    return <div className={S.footer}>{children}</div>;
};

export default Modal;
