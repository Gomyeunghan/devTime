import { useEffect, useState } from "react";
import S from "./DashBoard.module.css";
import {
    getHeatmap,
    getStudyLog,
    getStudyStats,
    type StudyStatsResponse,
    type StudyLog,
} from "@/api/dashboard";

const BAR_DAYS = ["S", "M", "T", "W", "T", "F", "S"];
const WEEK_DAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MAX_HOURS = 24;
const Y_LABELS = [24, 16, 8];
const MONTHS = [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
];

const CELL_COLORS = ["#eef0f8", "#c5cff0", "#8b9fdf", "#4d6dcb", "#1a3fa8"];

interface HeatmapCell {
    date: Date;
    colorLevel: number;
    studyTimeHours: number;
}
const WEEKDAY_ORDER = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
] as const;
const buildWeeksFromData = (days: HeatmapCell[]) => {
    const weeks: (HeatmapCell | null)[][] = [];
    if (days.length === 0) return weeks;
    const firstDay = days[0].date.getDay();
    let week: (HeatmapCell | null)[] = Array(firstDay).fill(null);
    for (const day of days) {
        week.push(day);
        if (week.length === 7) {
            weeks.push(week);
            week = [];
        }
    }
    if (week.length > 0) {
        while (week.length < 7) week.push(null);
        weeks.push(week);
    }
    return weeks;
};

const getMonthLabels = (weeks: (HeatmapCell | null)[][]) => {
    const labels: { month: number; weekIndex: number }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, wi) => {
        const firstReal = week.find(d => d !== null);
        if (!firstReal) return;
        const month = firstReal.date.getMonth();
        if (month !== lastMonth) {
            labels.push({ month, weekIndex: wi });
            lastMonth = month;
        }
    });
    return labels;
};

const formatHours = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    return h > 0 ? `${h}시간 ${m}분` : `${m}분`;
};

const formatSeconds = (ms: number) => {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    return h > 0 ? `${h}시간 ${m}분` : `${m}분`;
};

const PAGE_SIZE = 10;

function DashBoard() {
    const [tooltip, setTooltip] = useState<{
        x: number;
        y: number;
        text: string;
    } | null>(null);
    const [page, setPage] = useState(1);
    const [records, setRecords] = useState<StudyLog[]>([]);
    const [weeks, setWeeks] = useState<(HeatmapCell | null)[][]>([]);
    const [monthLabels, setMonthLabels] = useState<
        { month: number; weekIndex: number }[]
    >([]);
    const [studyStats, setStudyStats] = useState<StudyStatsResponse | null>(
        null,
    );

    const totalPages = Math.max(1, Math.ceil(records.length / PAGE_SIZE));
    const pageRecords = records.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    useEffect(() => {
        const fetchData = async () => {
            const [studyLogResponse, heatmapResponse, studyStatsResponse] =
                await Promise.all([
                    getStudyLog(),
                    getHeatmap(),
                    getStudyStats(),
                ]);

            console.log(heatmapResponse);

            setRecords(studyLogResponse.data.studyLogs ?? []);
            const dataMap = new Map(
                heatmapResponse.heatmap.map(d => [d.date, d]),
            );
            setStudyStats(studyStatsResponse);
            console.log(studyLogResponse);

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const allDays: HeatmapCell[] = [];
            for (let i = 364; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(today.getDate() - i);
                const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
                const apiDay = dataMap.get(dateStr);
                allDays.push({
                    date,
                    colorLevel: apiDay?.colorLevel ?? 0,
                    studyTimeHours: apiDay?.studyTimeHours ?? 0,
                });
                console.log(apiDay?.studyTimeHours);
            }

            const builtWeeks = buildWeeksFromData(allDays);
            setWeeks(builtWeeks);
            setMonthLabels(getMonthLabels(builtWeeks));
        };
        fetchData();
    }, []);

    const handleDelete = (index: number) => {
        const globalIndex = (page - 1) * PAGE_SIZE + index;
        setRecords(prev => prev.filter((_, i) => i !== globalIndex));
    };

    const getPaginationRange = () => {
        const groupSize = 5;
        const groupStart = Math.floor((page - 1) / groupSize) * groupSize + 1;
        const groupEnd = Math.min(groupStart + groupSize - 1, totalPages);
        return Array.from(
            { length: groupEnd - groupStart + 1 },
            (_, i) => groupStart + i,
        );
    };
    const barData = WEEKDAY_ORDER.map(
        day => (studyStats?.weekdayStudyTime?.[day] ?? 0) / 3600000,
    );

    return (
        <div className={S.pageWrapper}>
            {/* 상단 통계 + 바 차트 */}
            <div className={S.headerContainer}>
                <div className={S.timBoxContainer}>
                    <div className={S.myStudyTimeBox}>
                        <span className={S.subText}>누적 공부 시간</span>
                        <div className={S.mainTextBox}>
                            <span className={S.textBold}>
                                {studyStats?.totalStudyTime
                                    ? Math.floor(
                                          studyStats?.totalStudyTime /
                                              (100 * 60 * 60),
                                      )
                                    : 0}
                            </span>
                            <span>시간</span>
                            <span className={S.textBold}>
                                {studyStats?.totalStudyTime
                                    ? Math.floor(
                                          (studyStats?.totalStudyTime %
                                              (1000 * 60 * 60)) /
                                              (1000 * 60),
                                      )
                                    : 0}
                            </span>
                            <span>분</span>
                        </div>
                    </div>
                    <div className={S.myStudyTimeBox}>
                        <span className={S.subText}>누적 공부 일수</span>
                        <div className={S.mainTextBox}>
                            <span className={S.textBold}>
                                {studyStats?.consecutiveDays}
                            </span>
                            <span>일째</span>
                        </div>
                    </div>
                    <div className={S.myStudyTimeBox}>
                        <span className={S.subText}>하루 평균 공부 시간</span>
                        <div className={S.mainTextBox}>
                            <span className={S.textBold}>
                                {" "}
                                {studyStats?.averageDailyStudyTime
                                    ? Math.floor(
                                          studyStats?.averageDailyStudyTime /
                                              (100 * 60 * 60),
                                      )
                                    : 0}
                            </span>
                            <span>시간</span>
                            <span className={S.textBold}>
                                {" "}
                                {studyStats?.averageDailyStudyTime
                                    ? Math.floor(
                                          (studyStats?.averageDailyStudyTime %
                                              (1000 * 60 * 60)) /
                                              (1000 * 60),
                                      )
                                    : 0}
                            </span>
                            <span>분</span>
                        </div>
                    </div>
                    <div className={S.myStudyTimeBox}>
                        <span className={S.subText}>목표 달성률</span>
                        <div className={S.mainTextBox}>
                            <span className={S.textBold}>
                                {studyStats
                                    ? Math.floor(studyStats?.taskCompletionRate)
                                    : 0}
                            </span>
                            <span>%</span>
                        </div>
                    </div>
                </div>
                <div className={S.studyGraph}>
                    <span className={S.graphTitle}>요일별 공부 시간 평균</span>
                    <div className={S.graphContent}>
                        <div className={S.yAxis}>
                            {Y_LABELS.map(label => (
                                <span key={label}>{label}시간</span>
                            ))}
                        </div>
                        <div className={S.barsContainer}>
                            {barData.map((hours, i) => (
                                <div key={i} className={S.barWrapper}>
                                    <div className={S.bar}>
                                        <div
                                            className={S.barFill}
                                            style={{
                                                height: `${(hours / MAX_HOURS) * 100}%`,
                                            }}
                                        />
                                    </div>
                                    <span className={S.dayLabel}>
                                        {BAR_DAYS[i]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 공부 시간 바다 */}
            <div className={S.heatmapContainer}>
                <span className={S.heatmapTitle}>공부 시간 바다</span>
                <div className={S.heatmapWrapper}>
                    <div className={S.monthRow}>
                        <div className={S.dayAxisSpacer} />
                        <div className={S.monthLabels}>
                            {monthLabels.map(({ month, weekIndex }) => (
                                <span
                                    key={weekIndex}
                                    className={S.monthLabel}
                                    style={{
                                        left: `${(weekIndex / weeks.length) * 100}%`,
                                    }}
                                >
                                    {MONTHS[month]}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className={S.heatmapBody}>
                        <div className={S.dayAxis}>
                            {WEEK_DAYS.map((d, i) => (
                                <span key={i} className={S.dayAxisLabel}>
                                    {d}
                                </span>
                            ))}
                        </div>
                        <div className={S.grid}>
                            {weeks.map((week, wi) => (
                                <div key={wi} className={S.weekCol}>
                                    {week.map((day, di) => (
                                        <div
                                            key={di}
                                            className={S.cell}
                                            style={{
                                                background: day
                                                    ? CELL_COLORS[
                                                          day.colorLevel
                                                      ]
                                                    : "transparent",
                                            }}
                                            onMouseEnter={e => {
                                                if (!day) return;
                                                const rect = (
                                                    e.target as HTMLElement
                                                ).getBoundingClientRect();
                                                setTooltip({
                                                    x:
                                                        rect.left +
                                                        rect.width / 2,
                                                    y: rect.top,
                                                    text: `${day.date.toLocaleDateString("ko-KR")} · ${formatHours(day.studyTimeHours)}`,
                                                });
                                            }}
                                            onMouseLeave={() =>
                                                setTooltip(null)
                                            }
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={S.legend}>
                        <span>Shallow</span>
                        <div className={S.legendCells}>
                            {CELL_COLORS.map((color, i) => (
                                <div
                                    key={i}
                                    className={S.cell}
                                    style={{ background: color }}
                                />
                            ))}
                        </div>
                        <span>Deep</span>
                    </div>
                </div>
                {tooltip && (
                    <div
                        className={S.tooltip}
                        style={{ left: tooltip.x, top: tooltip.y - 36 }}
                    >
                        {tooltip.text}
                    </div>
                )}
            </div>

            {/* 학습 기록 */}
            <div className={S.recordContainer}>
                <span className={S.recordTitle}>학습 기록</span>
                <table className={S.table}>
                    <thead>
                        <tr>
                            <th>날짜</th>
                            <th>목표</th>
                            <th>공부 시간</th>
                            <th>할 일 갯수</th>
                            <th>미완료 할 일</th>
                            <th>달성률</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageRecords.map((record, i) => (
                            <tr key={record.id}>
                                <td>{record.date}</td>
                                <td className={S.goalCell}>
                                    {record.todayGoal}
                                </td>
                                <td>{formatSeconds(record.studyTime)}</td>
                                <td>{record.totalTasks}</td>
                                <td>{record.incompleteTasks}</td>
                                <td>{record.completionRate}%</td>
                                <td>
                                    <button
                                        className={S.deleteBtn}
                                        onClick={() => handleDelete(i)}
                                    >
                                        🗑
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* 페이지네이션 */}
                <div className={S.pagination}>
                    <button
                        className={S.pageBtn}
                        onClick={() => setPage(1)}
                        disabled={page === 1}
                    >
                        «
                    </button>
                    <button
                        className={S.pageBtn}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        ‹
                    </button>
                    {getPaginationRange().map(p => (
                        <button
                            key={p}
                            className={`${S.pageBtn} ${p === page ? S.activePage : ""}`}
                            onClick={() => setPage(p)}
                        >
                            {p}
                        </button>
                    ))}
                    <button
                        className={S.pageBtn}
                        onClick={() =>
                            setPage(p => Math.min(totalPages, p + 1))
                        }
                        disabled={page === totalPages}
                    >
                        ›
                    </button>
                    <button
                        className={S.pageBtn}
                        onClick={() => setPage(totalPages)}
                        disabled={page === totalPages}
                    >
                        »
                    </button>
                </div>
            </div>
        </div>
    );
}
export default DashBoard;
