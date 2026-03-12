import RankingCard from "@/components/RankingCard/RankingCard";
import S from "./Ranking.module.css";
import { useEffect, useState } from "react";
import { getRankings, type Ranking } from "@/api/rank";

function Ranking() {
    const [users, setUsers] = useState<Ranking[]>();
    const [active, setActive] = useState<string>("left");

    useEffect(() => {
        const rankings = async () => {
            const response = await getRankings("total");
            if (!response.success) return;
            setUsers(response.data.rankings);
        };
        rankings();
    }, []);

    const clickFetchTotal = async () => {
        const response = await getRankings("total");
        setUsers(response.data.rankings);
    };
    const clickFetchAvg = async () => {
        const response = await getRankings("avg");
        setUsers(response.data.rankings);
    };

    console.log(users);

    return (
        <>
            <div>
                <div className={S.buttonWrapper}>
                    <button
                        onClick={() => {
                            clickFetchTotal();
                            setActive("left");
                        }}
                        className={
                            active === "left" ? S.activeButton : S.nomalButton
                        }
                        disabled={active === "left"}
                    >
                        총 학습 시간
                    </button>
                    <button
                        onClick={() => {
                            clickFetchAvg();
                            setActive("right");
                        }}
                        className={
                            active === "right" ? S.activeButton : S.nomalButton
                        }
                        disabled={active === "right"}
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
