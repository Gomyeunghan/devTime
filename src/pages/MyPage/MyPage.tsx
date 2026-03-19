import Input from "@/components/Input/Input";
import S from "./MyPage.module.css";
import DefultProfile from "@assets/Profile.jpg";
import Button from "@/components/Button/Button";
import { useEffect, useRef, useState } from "react";
import {
    getParsingUrl,
    getProfile,
    updateProfile,
    type requsetImage,
    type responseGetProfile,
    type responseProfile,
} from "@/api/profile";
import Dropdown from "@/components/Dropdown/Dropdown";
import { validatePassword, validatePasswordConfirm } from "@/utils/validation";
import { debounce } from "@/utils/debounce";
import { getStack } from "@/api/stack";
import { CAREER_OPTIONS, PURPOSE_OPTIONS } from "@/api/profile";
import { checkNicknameDuplicate } from "@/api/signup";
import { useNavigate } from "react-router-dom";
import ProfileImage from "@/components/ProfileImage/ProfileImage";
import useAuthStore from "@/store/authStore";
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
    const [profileDate, setProfileDate] = useState<responseProfile | null>(
        null,
    );
    const [originalProfile, setOriginalProfile] = useState<responseProfile>();
    const [passwordConfirm, setPasswordConfirm] = useState<string>("");
    const [stackOptions, setStackOptions] = useState<StackItem[]>([]);
    const [nickNameFeedbackText, setNickNameFeedbackText] =
        useState<string>("");
    const [nickNameFeedbackTextStatus, setNickNameFeedbackTextStatus] =
        useState<boolean>(true);
    const [isNickNameInputChaged, setIsNickNameInputChaged] =
        useState<boolean>(false);
    const [value, setValue] = useState<string>("");
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const { isLoggedIn } = useAuthStore();

    const navigator = useNavigate();

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
        if (!isLoggedIn) navigator("/");
    }, [isLoggedIn]);

    useEffect(() => {
        const responesProfile = async () => {
            try {
                const fetchProifle: responseGetProfile = await getProfile();
                console.log(fetchProifle);
                if (!fetchProifle) return;
                const fetched: responseProfile = {
                    nickname: fetchProifle.nickname,
                    career: fetchProifle.profile.career,
                    purpose: fetchProifle.profile.purpose,
                    goal: fetchProifle.profile.goal,
                    techStacks: fetchProifle.profile.techStacks,
                    profileImage: fetchProifle.profile.profileImage,
                };
                setProfileDate(fetched);
                setOriginalProfile(fetched);
                if (fetched.profileImage) {
                    setPreviewImage(
                        `https://dev-time-bucket.s3.ap-northeast-2.amazonaws.com/${fetched.profileImage}`,
                    );
                }
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
        setIsNickNameInputChaged(true);
    };

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        debouncedSearch(e.target.value);
    };

    const hasChanges =
        JSON.stringify(profileDate) !== JSON.stringify(originalProfile) ||
        !!passwordConfirm;

    const clickNickNameDuplicate = async () => {
        try {
            if (!profileDate?.nickname) return;
            const result = await checkNicknameDuplicate(profileDate?.nickname);
            console.log(result);
            setNickNameFeedbackText(result.message);
            setNickNameFeedbackTextStatus(result.available);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSaveChanges = async () => {
        if (!profileDate) return;
        const { nickname, ...reset } = profileDate;
        const payload = isNickNameInputChaged ? profileDate : reset;
        try {
            await updateProfile(payload);
            setOriginalProfile(profileDate);
            setPasswordConfirm("");
            alert("프로필이 성공적으로 업데이트되었습니다.");
            navigator("/");
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
    const handleImageChange = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setPreviewImage(URL.createObjectURL(file));
        const imageInfo: requsetImage = {
            fileName: file.name,
            contentType: file.type,
        };
        await handleSaveProfileImage(imageInfo, file);
    };
    const handleSaveProfileImage = async (
        updateImageFile: requsetImage,
        file: File,
    ) => {
        const { presignedUrl, key } = await getParsingUrl(updateImageFile);
        await fetch(presignedUrl, {
            method: "PUT",
            headers: { "Content-Type": updateImageFile.contentType },
            body: file,
        });
        setProfileDate(prev => (prev ? { ...prev, profileImage: key } : prev));
    };

    return (
        <>
            <div className={S.container}>
                <div className={S.imgBox}>
                    <span>프로필 이미지</span>
                    <button
                        onClick={() => {
                            console.log(profileDate);
                        }}
                    >
                        ddd
                    </button>
                    {}
                    <ProfileImage
                        previewImage={previewImage}
                        handleImageChange={handleImageChange}
                    />
                </div>
                <div className={S.inputContainer}>
                    <div className={S.inputBoxRight}>
                        <div className={S.inputWrapper}>
                            <Input
                                inputLabel="닉네임"
                                name="nickName"
                                type="text"
                                feedBackText={nickNameFeedbackText}
                                onChange={e => {
                                    handleNickNameChange(e);
                                }}
                                placeholder="변경할 닉네임을 입력해주세요."
                                isValid={nickNameFeedbackTextStatus}
                                value={profileDate?.nickname || ""}
                            />

                            <Button
                                disabled={!isNickNameInputChaged}
                                variant="secondary"
                                onClick={() => {
                                    clickNickNameDuplicate();
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
                            navigator("/");
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
                        disabled={!hasChanges}
                    >
                        변경사항저장
                    </Button>
                </div>
            </div>
        </>
    );
}

export default MyPage;
