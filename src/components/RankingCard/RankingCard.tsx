import type { Ranking, TechStack } from "@/api/rank";
import clsx from "clsx";
import S from "./RankingCard.module.css";
import profile from "@assets/Profile.jpg";

function RankingCard({ user }: { user: Ranking }) {
    return (
        <div className={S.container}>
            <div className={S.imageContainer}>
                <span
                    className={clsx(
                        S.rankBadge,
                        user.rank > 3 && user.rank <= 11 && S.secondary,
                        user.rank > 11 && S.third,
                    )}
                >
                    {user.rank}위
                </span>
                <img className={S.image} src={profile} />
            </div>
            <div className={S.infoConatiner}>
                <div>
                    <span className={S.nickname}>{user.nickname}</span>
                    <span className={S.goal}>{user.profile.purpose}</span>
                </div>
                <div className={S.subTextContainer}>
                    <div className={S.subtextWraper}>
                        <span className={S.textNomal}>누적</span>
                        <span className={S.textBold}>
                            {Math.floor(user.totalStudyTime / 1000 / 60 / 60)}
                            시간
                        </span>
                    </div>
                    <div className={S.subtextWraper}>
                        <span className={S.textNomal}>일 평균</span>
                        <span className={S.textBold}>
                            {Math.round(user.averageStudyTime / 1000 / 60 / 60)}
                            시간{Math.round(user.averageStudyTime / 1000 / 60)}
                            분
                        </span>
                    </div>
                    <div className={S.subtextWraper}>
                        <span className={S.textNomal}>경력</span>
                        <span className={S.textBold}>
                            {user.profile.career}
                        </span>
                    </div>
                </div>
                <div className={S.stacksWrapper}>
                    {user.profile.techStacks
                        .slice(0, 5)
                        ?.map((stack: TechStack, index) => {
                            return (
                                <span className={S.stack} key={index}>
                                    {stack.name}
                                </span>
                            );
                        })}
                </div>
            </div>
        </div>
    );
}

export default RankingCard;

// 순위는 인덱스
// 닉네임 공부목표 누적공부시간 일평균 공부시간 경력 스텍
