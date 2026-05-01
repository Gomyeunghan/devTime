const Config = {
    preset: "ts-jest",
    testEnvironment: "jsdom", // React는 jsdom
    globals: {
        "ts-jest": {
            tsconfig: "tsconfig.jest.json", // 여기서 jest용 tsconfig 연결
        },
    },
    setupFilesAfterEnv: ["@testing-library/jest-dom"], // jest-dom 매처 사용시
    testMatch: ["**/__tests__/**/*.test.tsx", "**/__tests__/**/*.test.ts"],
};

export default Config;
