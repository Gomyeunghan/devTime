import S from "./TodoInput.module.css";

interface TodoInputProps {
    isAdd: boolean;
    value: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClick?: () => void;
    isCompleted?: boolean;
    onToggle?: () => void;
    onDelete?: () => void;
}

function TodoInput({
    isAdd,
    value,
    onChange,
    onClick,
    isCompleted,
    onToggle,
    onDelete,
}: TodoInputProps) {
    return (
        <div className={`${S.container} ${isAdd ? S.add : ""}`}>
            <input
                placeholder="할 일을 추가해 주세요."
                value={value}
                onChange={onChange}
                disabled={isAdd} // 목록에서는 수정 불가
            />
            {isAdd ? (
                <>
                    <input
                        type="checkbox"
                        checked={isCompleted}
                        onChange={onToggle}
                        value={value}
                    />
                    {onDelete && <button onClick={onDelete}>삭제</button>}
                </>
            ) : (
                <button className={S.button} onClick={onClick}>
                    추가
                </button>
            )}
        </div>
    );
}

export default TodoInput;
