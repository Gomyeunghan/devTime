import { useEffect, useState } from "react";
import S from "./DashBoard.module.css";
import {
    getHeatmap,
    getStudyLog,
    getStudyStats,
    type StudyStatsResponse,
    type StudyLog,
    deleteStudyLog,
    getStudyLogDetail,
    type detailStudyLog,
} from "@/api/dashboard";
import Trash from "@assets/trash.svg";
import DoneTodoModal from "@/components/DoneTodoModal/DonTodoModal";

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

// 레벨 0 = 공부 없음(투명), 1~5 = 점점 진한 파란색
const CELL_COLORS = [
    "transparent",
    "#dce8ff",
    "#a8c4f5",
    "#6699e8",
    "#3366cc",
    "#0033aa",
];

const getColorLevel = (hours: number): number => {
    if (hours <= 0) return 0;
    if (hours <= 2) return 1;
    if (hours <= 4) return 2;
    if (hours <= 6) return 3;
    if (hours <= 8) return 4;
    return 5;
};

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

const formatTooltipTime = (hours: number) => {
    const totalSeconds = Math.round(hours * 3600);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `공부 시간: ${h}시간 ${m}분 ${s}초`;
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
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [todoItem, setTodoItem] = useState<detailStudyLog | null>(null);

    const handleModal = async (id: string) => {
        setIsOpen(!isOpen);
    };
    const fetchStudyDetail = async (id: string) => {
        try {
            const response: detailStudyLog = await getStudyLogDetail(id);
            if (!response) return;
            setTodoItem(response);
        } catch (error) {
            console.error("Failed to fetch study detail:", error);
        }
    };

    const totalPages = Math.max(1, Math.ceil(records.length / PAGE_SIZE));
    const pageRecords = records.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    useEffect(() => {
        setPage(prev => Math.min(prev, totalPages));
    }, [totalPages]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [studyLogResponse, heatmapResponse, studyStatsResponse] =
                    await Promise.all([
                        getStudyLog(),
                        getHeatmap(),
                        getStudyStats(),
                    ]);

                setRecords(studyLogResponse.data.studyLogs ?? []);
                setStudyStats(studyStatsResponse);

                const dataMap = new Map<string, { studyTimeHours: number }>();
                for (const d of heatmapResponse.heatmap) {
                    const existing = dataMap.get(d.date);
                    if (existing) {
                        existing.studyTimeHours += d.studyTimeHours;
                    } else {
                        dataMap.set(d.date, {
                            studyTimeHours: d.studyTimeHours,
                        });
                    }
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
                            colorLevel: apiDay
                                ? getColorLevel(apiDay.studyTimeHours)
                                : 0,
                            studyTimeHours: apiDay?.studyTimeHours ?? 0,
                        });
                    }
                    const builtWeeks = buildWeeksFromData(allDays);
                    setWeeks(builtWeeks);
                    setMonthLabels(getMonthLabels(builtWeeks));
                }
            } catch {
                setRecords([]);
                setWeeks([]);
                setMonthLabels([]);
                setStudyStats(null);
            }
        };
        fetchData();
    }, []);

    const handleDelete = async (index: number) => {
        const globalIndex = (page - 1) * PAGE_SIZE + index;
        const record = records[globalIndex];
        if (!record) return;
        await deleteStudyLog(record.id);
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
                                              1000 /
                                              60 /
                                              60,
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
                                              1000 /
                                              60 /
                                              60,
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
                                                if (
                                                    !day ||
                                                    day.colorLevel === 0
                                                )
                                                    return;
                                                const rect = (
                                                    e.target as HTMLElement
                                                ).getBoundingClientRect();
                                                setTooltip({
                                                    x:
                                                        rect.left +
                                                        rect.width / 2,
                                                    y: rect.top,
                                                    text: formatTooltipTime(
                                                        day.studyTimeHours,
                                                    ),
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
                            {CELL_COLORS.slice(1).map((color, i) => (
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
                            <tr
                                key={record.id}
                                onClick={() => {
                                    handleModal(record.id);
                                    fetchStudyDetail(record.id);
                                }}
                            >
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
                                        type="button"
                                        className={S.deleteBtn}
                                        aria-label={`${record.date} 학습 기록 삭제`}
                                        onClick={() => handleDelete(i)}
                                    >
                                        <img
                                            src={Trash}
                                            alt=""
                                            aria-hidden="true"
                                        />
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
            {isOpen && todoItem && (
                <DoneTodoModal
                    data={todoItem.data}
                    isOpen={isOpen}
                    handleModal={() => setIsOpen(!isOpen)}
                />
            )}
        </div>
    );
}
export default DashBoard;
