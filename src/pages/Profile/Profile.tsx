import Dropdown from "@/components/Dropdown/Dropdown";
import S from "./Profile.module.css";
import Logo from "@assets/Logo_white.png";
import { useEffect, useRef, useState } from "react";
import {
    getParsingUrl,
    getProfile,
    postProfile,
    updateProfile,
    type requsetImage,
    type requsetProfile,
    type responseProfile,
} from "@/api/profile";
import Input from "@/components/Input/Input";
import { debounce } from "@/utils/debounce";
import type { StackItem, StackResult } from "../MyPage/MyPage";
import { getStack } from "@/api/stack";
import Button from "@/components/Button/Button";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/store/authStore";
import { CAREER_OPTIONS, PURPOSE_OPTIONS } from "@/api/profile";
import ProfileImage from "@/components/ProfileImage/ProfileImage";

function Profile() {
    const [profileDate, setProfileDate] = useState<requsetProfile | null>(null);
    const [stackOptions, setStackOptions] = useState<StackItem[]>([]);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [selectImage, setSelectImage] = useState<requsetImage | null>(null);
    const [value, setValue] = useState<string>("");
    const { isLoggedIn, isFirstLogin } = useAuthStore();

    const navigate = useNavigate();
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
        if (!isLoggedIn) {
            navigate("/login");
            return;
        }
        if (!isFirstLogin) {
            navigate("/");
            return;
        }
        setProfileDate({
            career: CAREER_OPTIONS[0],
            purpose: PURPOSE_OPTIONS[0],
            goal: "",
            techStacks: [],
            profileImage: "",
        });
    }, []);

    const handleCarrerChange = (value: string) => {
        setProfileDate(prev =>
            prev
                ? { ...prev, career: value as responseProfile["career"] }
                : prev,
        );
    };
    const handlePurposeChange = (value: string) => {
        setProfileDate(prev =>
            prev
                ? { ...prev, purpose: value as responseProfile["purpose"] }
                : prev,
        );
    };
    const handleGoal = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfileDate(prev =>
            prev ? { ...prev, goal: e.target.value } : prev,
        );
    };
    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        debouncedSearch(e.target.value);
    };
    const handleImageChange = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];
        console.log(file);
        if (!file) return;
        setPreviewImage(URL.createObjectURL(file));
        setSelectImage({
            fileName: file.name,
            contentType: file.type,
        });
        if (!selectImage) return;
        console.log("gogo");
        await handleSaveProfileImage(selectImage);
    };
    const addStack = (stackIndex: number) => {
        console.log(profileDate);
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
    const handleSaveProfileImage = async (updateImageFile: requsetImage) => {
        if (!updateImageFile) return;
        const parsingUrl = await getParsingUrl(updateImageFile);
        setProfileDate(prev =>
            prev
                ? {
                      ...prev,
                      profileImage: parsingUrl.key,
                  }
                : prev,
        );
        console.log(parsingUrl);
    };
    const handleSkip = async () => {
        await postProfile();
        navigate("/");
    };

    const handleSubmit = async () => {
        if (!profileDate) return;
        await postProfile();
        await updateProfile(profileDate);
        navigate("/");
    };

    return (
        <div className={S.container}>
            <div className={S.decorateConatainer}>
                <img src={Logo} alt="DevTimelogoImage" />
                <span>개발자를 위한 타이머</span>
            </div>
            <div className={S.profileContainer}>
                <div
                    style={{
                        minWidth: "420px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                        alignItems: "center",
                    }}
                >
                    <h1>프로필 설정</h1>
                    <Dropdown
                        inputLabel="개발 경력"
                        options={CAREER_OPTIONS}
                        onChange={value => {
                            handleCarrerChange(value);
                        }}
                        value={profileDate?.career ?? "경력 없음"}
                    />
                    <Dropdown
                        inputLabel="공부 목적"
                        options={PURPOSE_OPTIONS}
                        onChange={value => {
                            handlePurposeChange(value);
                        }}
                        value={profileDate?.purpose ?? "취업 준비"}
                    />
                    <Input
                        inputLabel="공부목표"
                        name="nickName"
                        type="text"
                        feedBackText=""
                        onChange={e => {
                            handleGoal(e);
                        }}
                        placeholder=""
                        isValid={true}
                    />
                    <div className={S.stackBox}>
                        <Input
                            inputLabel="공부/사용 중인 스택(선택)"
                            name="nickName"
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
                                    (techStacks, index) => (
                                        <div className={S.bedge} key={index}>
                                            <span>{techStacks}</span>
                                        </div>
                                    ),
                                )}
                            </div>
                        )}
                        <span>프로필 이미지</span>
                        <ProfileImage
                            previewImage={previewImage}
                            handleImageChange={handleImageChange}
                        />
                        <Button
                            onClick={() => handleSubmit()}
                            variant="primary"
                            disabled={
                                !!!profileDate?.techStacks?.length &&
                                !!!profileDate?.goal?.length
                            }
                        >
                            저장하기
                        </Button>
                        <div className={S.skipBox}>
                            <span>다음에 하시겠어요?</span>
                            <button onClick={handleSkip}>건너뛰기</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
