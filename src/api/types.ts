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
export interface LoginRequest {
    email: string;
    password: string;
}
export interface LoginResponse {
    accessToken: string;
    isDuplicateLogin: boolean;
    isFirstLogin: boolean;
    message: string;
    refreshToken: string;
    success: boolean;
}
