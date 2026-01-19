import type { FieldStatus } from "@/types/feedback.type";

// constants/emailMessage.ts
export const NICKNAME_MESSAGE: Record<FieldStatus, string> = {
    IDLE: "닉네임 을 입력해주세요",
    INVALID_FORMAT: "닉네임 을 입력해주세요.",
    NEED_CHECK: "중복확인이 필요합니다.",
    AVAILABLE: "",
    DUPLICATE: "",
    ERROR: "닉네임 확인 중 오류가 발생했습니다.",
} as const;
