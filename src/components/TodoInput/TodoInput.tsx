import S from "./TodoInput.module.css";
import Edit from "@/assets/edit.svg";
import Delete from "@/assets/delete.svg";
import { useState } from "react";

interface TodoInputProps {
    isAdd: boolean;
    value: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClick?: () => void;
    isCompleted?: boolean;
    onToggle?: () => void;
    onDelete?: () => void;
    isChange?: boolean;
    editMode?: boolean;
    isEditing?: boolean;
    onEditClick?: () => void;
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
    editMode,
    onEditClick,
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
                        {editMode ? (
                            <div className={S.iconButtons}>
                                <button onClick={onEditClick}>
                                    <img src={Edit} alt="edit icon" />
                                </button>
                                <button onClick={onDelete}>
                                    <img src={Delete} alt="delete icon" />
                                </button>
                            </div>
                        ) : (
                            <input
                                className={S.checkbox}
                                type="checkbox"
                                checked={isCompleted}
                                onChange={onToggle}
                                value={value}
                            />
                        )}
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
