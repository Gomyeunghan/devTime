import type { ReactNode } from "react";
import Button from "../Button/Button";
import S from "./Modal.module.css";

function Modal({
    children,
    onClick,
    isShowModal,
}: {
    children: ReactNode;
    onClick?: () => void;
    isShowModal: boolean;
}) {
    return (
        <div className={isShowModal ? S.container : S.hidden}>
            <div className={S.modal}>
                <span>{children}</span>
                <Button variant="primary" onClick={onClick}>
                    확인
                </Button>
            </div>
        </div>
    );
}

export default Modal;
