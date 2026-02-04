import { useState } from "react";
import TodoInput from "../TodoInput/TodoInput";
import S from "./TodoModal.module.css";
import { useTimer } from "../Timer/TimerContext";
import type { Task } from "@/api/timer";
import { Portal } from "../Potal/Potal";

function TodoModal() {
    const { tasks, addTask, updateTask, deleteTask } = useTimer();
    const [newTask, setNewTask] = useState<string>("");

    // 새 할 일 추가
    const handleAddTask = () => {
        if (!newTask.trim()) return;

        const task: Task = {
            content: newTask,
            isCompleted: false,
        };
        addTask(task);
        setNewTask(""); // 초기화
    };

    // 체크박스 토글
    const handleToggleTask = (index: number) => {
        const updatedTask = {
            ...tasks[index],
            isCompleted: !tasks[index].isCompleted,
        };
        updateTask(index, updatedTask);
    };

    return (
        <Portal>
            <div className={S.backdrop}>
                <div className={S.container}>
                    <div className={S.headerContainer}>
                        {/* 새 할 일 추가 */}
                        <TodoInput
                            isAdd={false}
                            value={newTask}
                            onChange={e => setNewTask(e.target.value)}
                            onClick={handleAddTask}
                        />
                        <div className={S.todoheader}>
                            <span>할 일 목록</span>
                            <span>할 일 수정</span>
                        </div>
                    </div>

                    {/* 기존 할 일 목록 */}
                    <div className={S.todoListContainer}>
                        {tasks.map((item, index) => (
                            <TodoInput
                                key={index}
                                isAdd={true}
                                value={item.content}
                                isCompleted={item.isCompleted}
                                onToggle={() => handleToggleTask(index)}
                                onDelete={() => deleteTask(index)} // 삭제 기능 추가
                            />
                        ))}
                    </div>
                </div>
            </div>
        </Portal>
    );
}

export default TodoModal;
