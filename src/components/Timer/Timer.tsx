import { useEffect, useRef, useState } from "react";
import S from "./Timer.module.css";
import type { time } from "@/types/time.type";
import Start from "@assets/start.svg";
import Pause from "@assets/Pause.svg";
import Finish from "@assets/Finish.svg";

function Timer() {
    const totalSecondsRef = useRef(0);
    const intervalRef = useRef<number | null>(null);
    const [time, setTime] = useState<time>({
        hours: "00",
        minutes: "00",
        seconds: "00",
    });
    const start = () => {
        if (intervalRef.current !== null) return;

        // const now = Date.now();
        // const isoDate = new Date(now).toISOString();

        // console.log(isoDate);
        intervalRef.current = window.setInterval(() => {
            totalSecondsRef.current += 1;

            const h = Math.floor(totalSecondsRef.current / 3600);
            const m = Math.floor((totalSecondsRef.current % 3600) / 60);
            const s = totalSecondsRef.current % 60;

            setTime({
                hours: String(h).padStart(2, "0"),
                minutes: String(m).padStart(2, "0"),
                seconds: String(s).padStart(2, "0"),
            });
        }, 1000);
    };

    const stop = () => {
        if (intervalRef.current === null) return;
        clearInterval(intervalRef.current);
        intervalRef.current = null;
    };
    useEffect(() => {
        return () => stop();
    }, []);

    return (
        <div className={S.container}>
            <div className={S.time}>
                <div className={S.timeCard}>
                    <span className={S.timeNumber}>{time.hours}</span>
                    <span className={S.timeCardText}>H O U R S</span>
                </div>
                <div className={S.colon}></div>
                <div className={S.timeCard}>
                    <span className={S.timeNumber}>{time.minutes}</span>
                    <span className={S.timeCardText}>M I N U T E S</span>
                </div>
                <div className={S.colon}></div>
                <div className={S.timeCard}>
                    <span className={S.timeNumber}>{time.seconds}</span>
                    <span className={S.timeCardText}>S E C O N D S</span>
                </div>
            </div>
            <div className={S.controlBox}>
                <button onClick={start}>
                    <img src={Start} />
                </button>
                <button onClick={stop}>
                    <img src={Pause} />
                </button>
                <button>
                    <img src={Finish} />
                </button>
            </div>
        </div>
    );
}
//활성화된 버튼 색상 빠지게 스타일 추가 및 상태 관리
// 추후에 컴파운드 컴포넌트로 수정가능할듯?

export default Timer;
