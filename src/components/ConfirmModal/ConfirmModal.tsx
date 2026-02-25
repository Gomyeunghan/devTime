// ConfirmModal.tsx
import BaseModal from "../BaseModal/BaseModal";
import Button from "../Button/Button";
import S from "./ConfirmModal.module.css";

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
}

function ConfirmModal({
    isOpen,
    title,
    description,
    confirmText = "확인",
    cancelText = "건너뛰기",
    onConfirm,
    onCancel,
}: ConfirmModalProps) {
    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onCancel ?? onConfirm}
            className={S.container} // override
        >
            <BaseModal.Header>
                <h3 className={S.title}>{title}</h3>
            </BaseModal.Header>

            {description && (
                <BaseModal.Body>
                    <p className={S.description}>{description}</p>
                </BaseModal.Body>
            )}

            {/* Footer absolute 문제 때문에 직접 div 사용 */}
            <div className={S.footer}>
                {onCancel && (
                    <Button variant="primary" onClick={onCancel}>
                        {cancelText}
                    </Button>
                )}
                <Button variant="secondary" onClick={onConfirm}>
                    {confirmText}
                </Button>
            </div>
        </BaseModal>
    );
}

export default ConfirmModal;
