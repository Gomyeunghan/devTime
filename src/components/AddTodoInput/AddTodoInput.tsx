import S from "./AddTodoInput.module.css";

interface AddTodoInputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onAdd: () => void;
}

function AddTodoInput({ value, onChange, onAdd }: AddTodoInputProps) {
    return (
        <div className={S.container}>
            <input
                placeholder="할 일을 추가해 주세요."
                value={value}
                onChange={onChange}
            />
            <button onClick={onAdd}>추가</button>
        </div>
    );
}
export default AddTodoInput;
