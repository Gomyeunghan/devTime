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

export const isFormField = <T extends object>(
    obj: T,
    field: PropertyKey,
): field is keyof T => {
    return field in obj;
};

//제너릭을 오브젝트로 정함
//field 는 속성들의 키 타입임 string symbol num 등
//타입 가드 함수가 ture일시 field 는 제너릭의 키 의 타입이 좁혀짐

// 이 함수는 런타임에서 field in obj 를 검사하고,
// 컴파일 타임에서는 true 분기 안에서 field 를 keyof T 로 타입을 좁힘 해주는 타입가드 함수이다.
