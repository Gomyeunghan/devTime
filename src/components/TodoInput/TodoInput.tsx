import S from "./TodoInput.module.css";

interface TodoInputProps {
    isAdd: boolean;
    value: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClick?: () => void;
    isCompleted?: boolean;
    onToggle?: () => void;
    onDelete?: () => void;
    isChange?: boolean;
}

function TodoInput({
    isAdd,
    value,
    onChange,
    onClick,
    isCompleted,
    onToggle,
    onDelete,
    isChange,
}: TodoInputProps) {
    return (
        <div
            className={`${S.container} ${isAdd ? S.add : ""} ${isCompleted ? S.isCompleted : ""}`}
        >
            <input
                placeholder="할 일을 추가해 주세요."
                value={value}
                onChange={onChange}
                disabled={isAdd} // 목록에서는 수정 불가
            />
            <div className={S.addInput}>
                {isAdd ? (
                    <>
                        <input
                            className={S.checkbox}
                            type="checkbox"
                            checked={isCompleted}
                            onChange={onToggle}
                            value={value}
                        />

                        {onDelete &&
                            (isChange ? (
                                <button
                                    className={S.deleteButton}
                                    onClick={onDelete}
                                >
                                    삭제
                                </button>
                            ) : (
                                ""
                            ))}
                    </>
                ) : (
                    <button className={S.addButton} onClick={onClick}>
                        추가
                    </button>
                )}
            </div>
        </div>
    );
}

export default TodoInput;
