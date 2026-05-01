import { secondsToTime } from "../time";
describe("secondsToTime", () => {
    it("3661초는 1시간 1분 1초", () => {
        expect(secondsToTime(3661)).toEqual({
            hours: "01",
            minutes: "01",
            seconds: "01",
        });
    });
});
