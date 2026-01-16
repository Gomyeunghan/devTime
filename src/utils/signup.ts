export interface SignupRequest {
    email: string;
    nickname: string;
    password: string;
    confirmPassword: string;
}

export interface SignupResponse {
    success: boolean;
    message: string;
}

export interface ErrorResponse {
    success: boolean;
    error: {
        message: string;
        statusCode: number;
    };
}
export interface CheckDuplicateResponse {
    success: boolean;
    available: boolean;
    message: string;
}

export async function signup(data: SignupRequest): Promise<SignupResponse> {
    const BASE_URL = import.meta.env.VITE_BASE_URL;

    const response = await fetch(`${BASE_URL}/api/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData: ErrorResponse = await response.json();

        // error.error.message로 접근해야 함!
        switch (errorData.error.statusCode) {
            case 409:
                throw new Error("이미 존재하는 이메일 또는 닉네임입니다.");
            case 400:
                throw new Error(errorData.error.message); // 서버 메시지 사용
            default:
                throw new Error(errorData.error.message || "회원가입 실패");
        }
    }

    return response.json();
}

export async function checkEmailDuplicate(
    email: string,
): Promise<CheckDuplicateResponse> {
    const BASE_URL = import.meta.env.VITE_BASE_URL;

    const response = await fetch(
        `${BASE_URL}/api/signup/check-email?email=${encodeURIComponent(email)}`,
        {
            method: "GET",
            headers: {
                accept: "application/json",
            },
        },
    );

    if (!response.ok) {
        throw new Error("이메일 중복 확인 실패");
    }
    return response.json();
}
export async function checkNicknameDuplicate(
    nickname: string,
): Promise<CheckDuplicateResponse> {
    const BASE_URL = import.meta.env.VITE_BASE_URL;

    const response = await fetch(
        `${BASE_URL}/api/signup/check-nickname?nickname=${encodeURIComponent(
            nickname,
        )}`,
        {
            method: "GET",
            headers: {
                accept: "application/json",
            },
        },
    );

    if (!response.ok) {
        throw new Error("닉네임 중복 확인 실패");
    }

    return response.json();
}
