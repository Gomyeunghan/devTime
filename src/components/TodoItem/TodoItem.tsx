import S from "./TodoItem.module.css";
import Edit from "@/assets/edit.svg";
import Delete from "@/assets/delete.svg";
import Check from "@/assets/check.svg";

interface TodoItemProps {
    value: string;
    isCompleted: boolean;
    isEditing: boolean;
    onToggle: () => void;
    onDelete: () => void;
    onEditClick: () => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    inputEditMode: boolean;
}

function TodoItem({
    value,
    isCompleted,
    isEditing,
    onToggle,
    onDelete,
    onEditClick,
    onChange,
    inputEditMode,
}: TodoItemProps) {
    const renderAction = () => {
        if (!inputEditMode) {
            return (
                <input
                    className={S.checkbox}
                    type="checkbox"
                    checked={isCompleted}
                    onChange={onToggle}
                />
            );
        }

        if (isEditing) {
            return (
                <button onClick={onEditClick}>
                    <img src={Check} alt="check" />
                </button>
            );
        }

        return (
            <div className={S.iconButtons}>
                <button onClick={onEditClick}>
                    <img src={Edit} alt="edit" />
                </button>
                <button onClick={onDelete}>
                    <img src={Delete} alt="delete" />
                </button>
            </div>
        );
    };
    return (
        <div className={`${S.container} ${isCompleted ? S.completed : ""}`}>
            <input value={value} onChange={onChange} disabled={!isEditing} />
            {renderAction()}
        </div>
    );
}

export default TodoItem;
