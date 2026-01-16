/**
 * 이메일 형식 검증
 */
export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim());
};

/**
 * 비밀번호 검증 (8자 이상, 영문+숫자 포함)
 */
export const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
};

/**
 * 닉네임 검증 (2-10자, 한글/영문/숫자)
 */
export const validateNickname = (nickname: string): boolean => {
    return nickname.trim().length > 0;
};
export const validatePasswordConfirm = (
    password: string,
    passwordConfirm: string,
): boolean => {
    return password === passwordConfirm && password.length > 0;
};
