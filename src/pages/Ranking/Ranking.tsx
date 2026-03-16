import RankingCard from "@/components/RankingCard/RankingCard";
import S from "./Ranking.module.css";
import { useEffect, useRef, useState } from "react";
import { getRankings, type RankingData } from "@/api/rank";

function Ranking() {
    const [users, setUsers] = useState<RankingData[]>([]);
    const [active, setActive] = useState<"total" | "avg">("total");
    const requestSeq = useRef(0);

    const loadRankings = async (type: "total" | "avg") => {
        const seq = ++requestSeq.current;
        const response = await getRankings(type);
        if (!response.success || seq !== requestSeq.current) return;
        setUsers(response.data.rankings);
        setActive(type);
    };

    useEffect(() => {
        void loadRankings("total");
    }, []);

    console.log(users);

    return (
        <>
            <div>
                <div className={S.buttonWrapper}>
                    <button
                        onClick={() => void loadRankings("total")}
                        className={
                            active === "total" ? S.activeButton : S.nomalButton
                        }
                        disabled={active === "total"}
                    >
                        총 학습 시간
                    </button>
                    <button
                        onClick={() => void loadRankings("avg")}
                        className={
                            active === "avg" ? S.activeButton : S.normalButton
                        }
                        disabled={active === "avg"}
                    >
                        일 평균 학습 시간
                    </button>
                </div>
                <div className={S.cardWrapper}>
                    {users?.map(user => {
                        return <RankingCard user={user} key={user.userId} />;
                    })}
                </div>
            </div>
        </>
    );
}

export default Ranking;
