import S from "./Timer.module.css";
import Start from "@assets/start.svg";
import StartDisabled from "@assets/StartDisabled.svg";
import Pause from "@assets/Pause.svg";
import Finish from "@assets/Finish.svg";
import TodoList from "@assets/SetTodoList.svg";
import Reset from "@assets/Reset.png";
import PasueDisabled from "@assets/PauseDisabled.svg";
import FinishDisabled from "@assets/FinishDisabled.svg";
import { useTimer } from "./TimerContext";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import { useState } from "react";
import { tokenStorage } from "@/utils/storage";

export default function Timer() {
    const {
        timeFormatted,
        reset,
        resume,
        pause,
        todayGoal,
        timerRunning,
        timerId,
        setIsModalOpen,
        isModalOpen,
        setIsTimerStop,
    } = useTimer();

    // 예시 목표/할일 (모달 추가 전)

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const handleConfirmModal = () => {
        setIsConfirmModalOpen(!isConfirmModalOpen);
    };
    const handleStart = () => {
        if (timerId || !tokenStorage.getAccessToken()) {
            resume(); // 재개
        } else {
            handleModal();
        }
    };

    const handleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleReset = () => {
        reset();
        handleConfirmModal();
    };
    const handleStop = async () => {
        await pause();
        setIsTimerStop(true);
        handleModal();
    };
    return (
        <div className={S.container}>
            {todayGoal ? (
                <div className={`${S.todayGoal} ${S.isRunning}`}>
                    {todayGoal}
                </div>
            ) : (
                <div className={S.todayGoal}>오늘도 열심히 달려봐요!</div>
            )}
            <div className={S.time}>
                <div className={S.timeCard}>
                    <span className={S.timeNumber}>{timeFormatted.hours}</span>
                    <span className={S.timeCardText}>H O U R S</span>
                </div>
                <div className={S.colon}></div>
                <div className={S.timeCard}>
                    <span className={S.timeNumber}>
                        {timeFormatted.minutes}
                    </span>
                    <span className={S.timeCardText}>M I N U T E S</span>
                </div>
                <div className={S.colon}></div>
                <div className={S.timeCard}>
                    <span className={S.timeNumber}>
                        {timeFormatted.seconds}
                    </span>
                    <span className={S.timeCardText}>S E C O N D S</span>
                </div>
            </div>
            <div className={S.controlBox}>
                <button onClick={() => handleStart()} disabled={timerRunning}>
                    <img src={timerRunning ? StartDisabled : Start} />
                </button>
                <button onClick={pause}>
                    <img src={timerRunning ? Pause : PasueDisabled} />
                </button>
                <button onClick={handleStop}>
                    <img src={timerId ? Finish : FinishDisabled} />
                </button>

                <button
                    onClick={() => handleModal()}
                    style={timerId ? {} : { display: "none" }}
                >
                    <img src={TodoList} alt="todoList" />
                </button>
                <button
                    onClick={handleConfirmModal}
                    style={timerId ? {} : { display: "none" }}
                >
                    <img src={Reset} alt="reset" />
                </button>
            </div>
            <ConfirmModal
                title="정말 초기화하시겠습니까?"
                confirmText="초기화"
                cancelText="취소"
                isOpen={isConfirmModalOpen}
                onConfirm={handleReset}
                onCancel={() => setIsConfirmModalOpen(false)}
            />
        </div>
    );
}
