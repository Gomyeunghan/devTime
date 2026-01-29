import S from "./TodoInput.module.css";

function TodoInput({
    isAdd,
    onClick,
    todo,
}: {
    isAdd: boolean;
    onClick?: () => void;
    todo?: string;
}) {
    return (
        <div className={`${S.container} ${isAdd ? S.add : ""}`}>
            <input placeholder="할 일을 추가해 주세요." value={todo} />
            {isAdd ? (
                <input type="checkbox" />
            ) : (
                <button className={S.button} onClick={onClick}>
                    추가
                </button>
            )}
        </div>
    );
}

export default TodoInput;

// TimerProvider 로 감써져있어서 오는
