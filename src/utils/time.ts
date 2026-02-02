export function secondsToTime(totalSeconds: number) {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    return {
        hours: String(h).padStart(2, "0"),
        minutes: String(m).padStart(2, "0"),
        seconds: String(s).padStart(2, "0"),
    };
}
export const calcElapsedSeconds = (
    startTime: string,
    lastUpdateTime: string,
) => {
    const now = Date.now();

    const start = new Date(startTime).getTime(); // 사용하지않고있음 검토후 삭제확인
    const last = new Date(lastUpdateTime).getTime();
    console.log((now - start) / 1000 / 60);
    console.log((now - last) / 1000 / 60);

    return Math.floor((now - last) / 1000);
};
