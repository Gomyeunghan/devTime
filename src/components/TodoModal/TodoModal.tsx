import { useState } from "react";
import TodoInput from "../TodoInput/TodoInput";
import S from "./TodoModal.module.css";
import { useTimer } from "../Timer/TimerContext";
import type { Task } from "@/api/timer";

function TodoModal() {
    const { tasks } = useTimer();
    const [todoList, setTodoList] = useState<Task[]>([]);

    console.log(tasks);
    return (
        <div className={S.container}>
            <div>
                <TodoInput isAdd={false} />
                <div className={S.todoheader}>
                    <span>할 일 목록</span>
                    <span>할 일 수정</span>
                </div>
                {todoList.map((items, index) => {
                    return (
                        <TodoInput
                            todo={items.content}
                            isAdd={true}
                            key={index}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default TodoModal;

// 추가작업이 필요합니다..
// 명세를 깊게 읽지않아서 타이머 기능 부터 구현하다보니 완전히 꼬여버렸네요 ㅠㅠ
// 다음주까지 최대한 완성해보겠습니다!
