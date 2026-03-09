import Input from "@/components/Input/Input";
import S from "./MyPage.module.css";
import DefultProfile from "@assets/Profile.jpg";
import Button from "@/components/Button/Button";
import { useEffect, useRef, useState } from "react";
import {
    getProfile,
    updateProfile,
    type responseGetProfile,
    type responseProfile,
} from "@/api/profile";
import Dropdown from "@/components/Dropdown/Dropdown";
import { validatePassword, validatePasswordConfirm } from "@/utils/validation";
import { debounce } from "@/utils/debounce";
import { getStack } from "@/api/stack";
import { CAREER_OPTIONS, PURPOSE_OPTIONS } from "@/api/profile";
export interface StackItem {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface StackResult {
    results: StackItem[];
}

function MyPage() {
    const [profileDate, setProfileDate] = useState<responseProfile>();
    const [passwordConfirm, setPasswordConfirm] = useState<string>("");
    const [stackOptions, setStackOptions] = useState<StackItem[]>([]);
    const [value, setValue] = useState<string>("");
    const debouncedSearch = useRef(
        debounce(async (keyword: string) => {
            if (!keyword) {
                setStackOptions([]);
                return;
            }
            await getStack<StackResult>(keyword).then(res =>
                setStackOptions(res.results),
            );
            console.log(keyword, "keyword");
        }, 500),
    ).current;

    useEffect(() => {
        const responesProfile = async () => {
            try {
                const fetchProifle: responseGetProfile = await getProfile();
                console.log(fetchProifle);
                if (!fetchProifle) return;
                setProfileDate(prev => ({
                    ...prev,
                    nickname: fetchProifle.nickname,
                    career: fetchProifle.profile.career,
                    purpose: fetchProifle.profile.purpose,
                    goal: fetchProifle.profile.goal,
                    techStacks: fetchProifle.profile.techStacks,
                    prfileImage: fetchProifle.profile.profileImage,
                }));
            } catch (error) {
                console.error(error);
            }
        };

        responesProfile();
    }, []);

    const handlePurposeChange = (value: string) => {
        setProfileDate(prev =>
            prev
                ? { ...prev, purpose: value as responseProfile["purpose"] }
                : prev,
        );
    };
    const handleCareerChange = (value: string) => {
        setProfileDate(prev =>
            prev
                ? { ...prev, career: value as responseProfile["career"] }
                : prev,
        );
        console.log(profileDate);
    };
    const handleGoal = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfileDate(prev =>
            prev ? { ...prev, goal: e.target.value } : prev,
        );
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setProfileDate(prev => (prev ? { ...prev, password: value } : prev));
        console.log(value);
    };

    const handlePasswordConfirmChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setPasswordConfirm(e.target.value);
    };
    const handleNickNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfileDate(prev =>
            prev ? { ...prev, nickname: e.target.value } : prev,
        );
    };

    // const handleStackChange = debounce(
    //     (e: React.ChangeEvent<HTMLInputElement>) => {
    //         const value = e.target.value;
    //         setValue(value);
    //     },
    //     500,
    // );
    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        debouncedSearch(e.target.value);
    };

    const handleSaveChanges = async () => {
        if (!profileDate) return;
        console.log(profileDate);
        try {
            await updateProfile(profileDate);
            alert("프로필이 성공적으로 업데이트되었습니다.");
        } catch (error) {
            console.error("프로필 업데이트 중 오류 발생:", error);
            alert("프로필 업데이트에 실패했습니다. 다시 시도해주세요.");
        }
    };
    const addStack = (stackIndex: number) => {
        setProfileDate(prev => {
            if (!prev) return prev;
            const selectedStack = stackOptions[stackIndex];
            console.log(stackOptions[stackIndex], "selectedStack");
            if (!selectedStack) return prev;
            const isAlreadyAdded = prev.techStacks?.includes(
                selectedStack.name,
            );
            if (isAlreadyAdded) return prev;
            const updatedStack = prev.techStacks
                ? [...prev.techStacks, selectedStack.name]
                : [selectedStack.name];

            return { ...prev, techStacks: updatedStack };
        });
        setValue("");
        setStackOptions([]);
    };

    return (
        <>
            <div className={S.container}>
                <div className={S.imgBox}>
                    <span>프로필 이미지</span>
                    <img src={DefultProfile} />
                </div>
                <div className={S.inputContainer}>
                    <div className={S.inputBoxRight}>
                        <div className={S.inputWrapper}>
                            <Input
                                inputLabel="닉네임"
                                name="nickName"
                                type="text"
                                feedBackText="중복확인이필요합니다."
                                onChange={e => {
                                    handleNickNameChange(e);
                                }}
                                placeholder="변경할 닉네임을 입력해주세요."
                                isValid={true}
                                value={profileDate?.nickname || ""}
                            />

                            <Button
                                disabled={true}
                                variant="secondary"
                                onClick={() => {
                                    return;
                                }}
                            >
                                중복확인
                            </Button>
                        </div>
                        <Dropdown
                            inputLabel="공부 목적"
                            options={PURPOSE_OPTIONS}
                            onChange={value => {
                                handlePurposeChange(value);
                            }}
                            value={profileDate?.purpose ?? "취업준비"}
                        />

                        <Input
                            inputLabel="새 비밀번호"
                            name="nickName"
                            type="password"
                            feedBackText={
                                validatePassword(profileDate?.password ?? "")
                                    ? ""
                                    : "비밀번호는 8자 이상, 영문과 숫자 조합이어야 합니다."
                            }
                            onChange={e => {
                                handlePasswordChange(e);
                            }}
                            placeholder="비밀번호를 입력해 주세요."
                            isValid={validatePassword(
                                profileDate?.password ?? "",
                            )}
                        />
                        <Input
                            inputLabel="비밀번호 확인"
                            name="nickName"
                            type="password"
                            feedBackText={
                                validatePasswordConfirm(
                                    profileDate?.password ?? "",
                                    passwordConfirm,
                                )
                                    ? ""
                                    : "비밀번호가 일치하지 않습니다."
                            }
                            onChange={e => {
                                handlePasswordConfirmChange(e);
                            }}
                            placeholder="비밀번호를 한 번 더 입력해 주세요."
                            isValid={validatePasswordConfirm(
                                profileDate?.password ?? "",
                                passwordConfirm,
                            )}
                        />
                    </div>
                    <div className={S.inputBoxLeft}>
                        <Dropdown
                            inputLabel="개발 경력"
                            options={CAREER_OPTIONS}
                            onChange={value => {
                                handleCareerChange(value);
                            }}
                            value={profileDate?.career ?? "경력 없음"}
                        />
                        <Input
                            inputLabel="공부목표"
                            name="goal"
                            type="text"
                            feedBackText=""
                            onChange={e => {
                                handleGoal(e);
                            }}
                            placeholder=""
                            isValid={true}
                            value={profileDate?.goal ?? ""}
                        />

                        <Input
                            inputLabel="공부/사용 중인 스택(선택)"
                            name="stacks"
                            type="text"
                            feedBackText=""
                            onChange={e => {
                                handleValueChange(e);
                            }}
                            placeholder="기술 스텍을 검색해 등록해 주세요."
                            isValid={true}
                            value={value}
                        />
                        {!!stackOptions.length && (
                            <div className={S.stackWrapper}>
                                {stackOptions?.map((stack, index) => (
                                    <button
                                        key={stack.id}
                                        onClick={() => addStack(index)}
                                    >
                                        <span>{stack.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                        {!!profileDate?.techStacks?.length && (
                            <div className={S.bedgeWapper}>
                                {profileDate?.techStacks?.map(
                                    (stack, index) => (
                                        <div className={S.bedge} key={index}>
                                            <span>{stack}</span>
                                        </div>
                                    ),
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div className={S.buttonWrapper}>
                    <Button
                        onClick={() => {
                            console.log(profileDate);
                        }}
                        variant="secondary"
                    >
                        취소
                    </Button>
                    <Button
                        onClick={() => {
                            handleSaveChanges();
                        }}
                        variant="secondary"
                        disabled={false}
                    >
                        변경사항저장
                    </Button>
                </div>
            </div>
        </>
    );
}

export default MyPage;
