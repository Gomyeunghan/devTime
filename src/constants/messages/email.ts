import type { FieldStatus } from "@/types/feedback.type";

export const EMAIL_MESSAGE: Record<FieldStatus, string> = {
    IDLE: "이메일 형식으로 입력해주세요.",
    INVALID_FORMAT: "이메일 형식으로 입력해주세요.",
    NEED_CHECK: "중복확인이 필요합니다.",
    AVAILABLE: "",
    DUPLICATE: "",
    ERROR: "이메일 확인 중 오류가 발생했습니다.",
} as const;
