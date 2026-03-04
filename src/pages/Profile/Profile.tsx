import Dropdown from "@/components/Dropdown/Dropdown";
import S from "./Profile.module.css";
import Logo from "@assets/Logo_white.png";
import { useEffect, useRef, useState } from "react";
import { getProfile, type responseProfile } from "@/api/profile";
import Input from "@/components/Input/Input";
import { debounce } from "@/utils/debounce";
import type { StackItem, StackResult } from "../MyPage/MyPage";
import { getStack } from "@/api/stack";
import Button from "@/components/Button/Button";
import { Link } from "react-router-dom";
const CAREER_OPTIONS = ["경력없음", "0-3년", "4-7년", "8-10년", "11년이상"];
const PURPOSE_OPTIONS = [
    "취업준비",
    "이직준비",
    "단순 개발 역량 향상",
    "회사 내 프로젝트 원활하게 수행",
    "기타((직접입력)",
];

function Profile() {
    const [profileDate, setProfileDate] = useState<responseProfile>();
    const [stackOptions, setStackOptions] = useState<StackItem[]>([]);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
                const fetchProifle = await getProfile();
                console.log(fetchProifle);
                if (!fetchProifle) return;
                setProfileDate(prev => ({
                    ...prev,
                    nickname: fetchProifle.nickname,
                    carrer: fetchProifle.career,
                    purpose: fetchProifle.purpose,
                    goal: fetchProifle.goal,
                    stack: fetchProifle.stack,
                    prfileImage: "sss",
                }));
            } catch (error) {
                console.error(error);
            }
        };

        responesProfile();
    }, []);

    const handleCarrerChange = (value: string) => {
        setProfileDate(prev =>
            prev
                ? { ...prev, carrer: value as responseProfile["career"] }
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
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setPreviewImage(URL.createObjectURL(file));
    };
    const addStack = (stackIndex: number) => {
        setProfileDate(prev => {
            if (!prev) return prev;
            const selectedStack = stackOptions[stackIndex];
            console.log(stackOptions[stackIndex], "selectedStack");
            if (!selectedStack) return prev;
            const isAlreadyAdded = prev.stack?.includes(selectedStack.name);
            if (isAlreadyAdded) return prev;
            const updatedStack = prev.stack
                ? [...prev.stack, selectedStack.name]
                : [selectedStack.name];

            return { ...prev, stack: updatedStack };
        });
        setValue("");
        setStackOptions([]);
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
                        value={profileDate?.career ?? "경력없음"}
                    />
                    <Dropdown
                        inputLabel="공부 목적"
                        options={PURPOSE_OPTIONS}
                        onChange={value => {
                            handlePurposeChange(value);
                        }}
                        value={profileDate?.purpose ?? "취업준비"}
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
                        {!!profileDate?.stack?.length && (
                            <div className={S.bedgeWapper}>
                                {profileDate?.stack?.map((stack, index) => (
                                    <div className={S.bedge} key={index}>
                                        <span>{stack}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        <span>프로필 이미지</span>
                        <div className={S.addImageBox}>
                            <button className={S.addImage}>
                                <span>+</span>
                            </button>
                            <span>5MB 미만의 .png, .jpg 파일</span>
                        </div>
                        <Button>저장하기</Button>
                        <div className={S.skipBox}>
                            <span>다음에 하시겠어요?</span>
                            <Link to="/">건너뛰기</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
