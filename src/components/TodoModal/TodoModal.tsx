import { useState } from "react";
import BaseModal from "../BaseModal/BaseModal";
import Button from "../Button/Button";
import S from "./TodoModal.module.css";
import { useTimer } from "../Timer/TimerContext";
import { updateTasks, type Task } from "@/api/timer";
import AddTodoInput from "../AddTodoInput/AddTodoInput";
import TodoItem from "../TodoItem/TodoItem";

function TodoModal() {
    const {
        review,
        timerId,
        start,
        tasks,
        addTask,
        updateTask,
        todayGoal,
        isModalOpen,
        studyLogId,
        isTimerStop,
        setIsModalOpen,
        setTodayGoal,
        setTasks,
        setIsTimerStop,
        setReview,
    } = useTimer();

    const [newTask, setNewTask] = useState("");
    const [editingMap, setEditingMap] = useState<Record<number, string>>({});
    const [isEditing, setIsEditing] = useState(false);
    const [inputEditMode, setInputEditMode] = useState(false);

    const handleAddTask = () => {
        if (!newTask.trim()) return;

        const task: Task = {
            content: newTask,
            isCompleted: false,
        };

        addTask(task);
        setNewTask("");
    };

    const handleToggleTask = (index: number) => {
        updateTask(index, {
            ...tasks[index],
            isCompleted: !tasks[index].isCompleted,
        });
    };

    const handleModal = () => {
        setIsModalOpen(!isModalOpen);
        setIsTimerStop(false);
    };

    const handleChange = (index: number, value: string) => {
        setEditingMap(prev => ({
            ...prev,
            [index]: value,
        }));
    };
    const handleStartEdit = (index: number) => {
        setEditingMap(prev => ({
            ...prev,
            [index]: tasks[index].content,
        }));
    };

    const handleConfirmEdit = (index: number) => {
        setTasks(prev =>
            prev.map((task, i) =>
                i === index ? { ...task, content: editingMap[index] } : task,
            ),
        );

        setEditingMap(prev => {
            const copy = { ...prev };
            delete copy[index];
            return copy;
        });
    };
    const handleUpdateTasks = async () => {
        if (!studyLogId) return;
        await updateTasks(studyLogId, tasks);
    };
    const handleDelete = (index: number) => {
        setTasks(prev => prev.filter((_, i) => i !== index));
    };

    const renderAction = () => {
        if (inputEditMode) {
            return (
                <Button
                    variant="secondary"
                    onClick={() => {
                        handleUpdateTasks();
                        handleModal();
                        setInputEditMode(!inputEditMode);
                    }}
                >
                    수정사항 저장하기
                </Button>
            );
        }
        if (timerId) {
            return (
                <Button
                    variant="secondary"
                    onClick={() => {
                        handleUpdateTasks();
                        start(todayGoal, tasks);
                        handleModal();
                    }}
                >
                    저장하기
                </Button>
            );
        }
        return (
            <Button
                variant="secondary"
                onClick={() => {
                    handleAddTask();
                    start(todayGoal, tasks);
                    handleModal();
                }}
            >
                시작하기
            </Button>
        );
    };

    const headerRenderAction = () => {
        if (timerId && isTimerStop) {
            return (
                <div>
                    <h3>오늘도 수고하셨어요!!!!</h3>
                    <span>
                        완료한 일을 체크하고 오늘의 학습 회고를 작성해 주세요!
                    </span>
                </div>
            );
        }
        if (timerId) {
            return "";
        }
        if (!timerId) {
            return (
                <input
                    className={S.todayGoal}
                    placeholder="오늘의 목표"
                    onChange={e => setTodayGoal(e.target.value)}
                    value={todayGoal}
                />
            );
        }
    };
    const onChageReview = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const changeReview = e.target.value;
        setReview(changeReview);
    };
    return (
        <BaseModal isOpen={isModalOpen} onClose={handleModal}>
            <BaseModal.Header>
                {headerRenderAction()}
                <AddTodoInput
                    value={newTask}
                    onChange={e => setNewTask(e.target.value)}
                    onAdd={handleAddTask}
                />
            </BaseModal.Header>
            <BaseModal.Body>
                <div className={S.todoListContainer}>
                    <div className={S.spanWrapper}>
                        <span className={S.todoListTitle}>할 일 목록</span>
                        <button
                            onClick={() => setInputEditMode(!inputEditMode)}
                            className={`${inputEditMode ? S.hidden : ""}`}
                        >
                            할 일 수정
                        </button>
                    </div>
                    {tasks.map((item, index) => {
                        const isEditing = editingMap[index] !== undefined;

                        return (
                            <TodoItem
                                key={index}
                                value={
                                    isEditing ? editingMap[index] : item.content
                                }
                                isCompleted={item.isCompleted}
                                isEditing={isEditing}
                                inputEditMode={inputEditMode}
                                onToggle={() => handleToggleTask(index)}
                                onDelete={() => handleDelete(index)}
                                onEditClick={() =>
                                    isEditing
                                        ? handleConfirmEdit(index)
                                        : handleStartEdit(index)
                                }
                                onChange={e =>
                                    handleChange(index, e.target.value)
                                }
                            />
                        );
                    })}
                </div>
                {isTimerStop ? (
                    <div>
                        <label id="review">학습회고</label>
                        <textarea
                            className={S.reviewBox}
                            onChange={onChageReview}
                        ></textarea>
                    </div>
                ) : (
                    ""
                )}
            </BaseModal.Body>

            <BaseModal.Footer>
                <Button variant="primary" onClick={handleModal}>
                    취소
                </Button>
                {renderAction()}
            </BaseModal.Footer>
        </BaseModal>
    );
}

export default TodoModal;
