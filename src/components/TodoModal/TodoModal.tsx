import { useState, type ReactHTMLElement } from "react";
import TodoInput from "../TodoInput/TodoInput";
import S from "./TodoModal.module.css";
import { useTimer } from "../Timer/TimerContext";
import type { Task } from "@/api/timer";
import { Portal } from "../Portal/Portal";
import Button from "../Button/Button";

function TodoModal() {
    const {
        start,
        tasks,
        addTask,
        updateTask,
        todayGoal,
        stop,
        isModalOpen,
        setIsModalOpen,
        setTodayGoal,
    } = useTimer();
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
    const handleModal = () => {
        setIsModalOpen(!isModalOpen);
    };
    const changeGoal = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTodayGoal(e.target.value);

        console.log(todayGoal);
    };

    return isModalOpen ? (
        <Portal>
            <div className={S.backdrop}>
                <div className={S.container}>
                    <input
                        className={S.todayGoal}
                        placeholder="오늘의 목표"
                        onChange={e => changeGoal(e)}
                        value={todayGoal}
                    />
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
                        </div>
                    </div>

                    {/* 기존 할 일 목록 */}
                    <div className={S.todoListContainer}>
                        {tasks
                            ? tasks.map((item, index) => (
                                  <TodoInput
                                      key={index}
                                      isAdd={true}
                                      value={item.content}
                                      isCompleted={item.isCompleted}
                                      onToggle={() => handleToggleTask(index)}
                                      isChange={false}
                                  />
                              ))
                            : ""}
                    </div>
                    <div className={S.buttonWrapper}>
                        <Button variant="primary" onClick={handleModal}>
                            취소
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                handleAddTask();
                                start(todayGoal, tasks);
                                handleModal();
                            }}
                        >
                            저장하기
                        </Button>
                    </div>
                </div>
            </div>
        </Portal>
    ) : (
        ""
    );
}

export default TodoModal;
