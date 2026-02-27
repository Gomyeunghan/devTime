import Input from "@/components/Input/Input";
import S from "./Profile.module.css";
import DefultProfile from "@assets/Profile.jpg";
import Button from "@/components/Button/Button";
import { useEffect, useState } from "react";
import { getProfile, type responseProfile } from "@/api/profile";
import Dropdown from "@/components/Dropdown/Dropdown";

const CAREER_OPTIONS = ["경력없음", "0-3년", "4-7년", "8-10년", "11년이상"];
const PURPOSE_OPTIONS = [
    "취업준비",
    "이직준비",
    "단순 개발 역량 향상",
    "회사 내 프로젝트 원활하게 수행",
    "기타((직접입력)",
];

function Profile() {
    const [profileDate, setProfileDate] = useState<responseProfile | null>(
        null,
    );

    useEffect(() => {
        const responesProfile = async () => {
            try {
                const fetchProifle = await getProfile();
                if (!fetchProifle) return;
                setProfileDate(prev => ({
                    ...prev,
                    nickname: fetchProifle.nickname,
                    carrer: fetchProifle.carrer,
                    purpose: fetchProifle.purpose,
                    goal: fetchProifle.goal,
                    stack: fetchProifle.stack,
                    prfileImage: fetchProifle.prfileImage,
                }));
            } catch (error) {
                console.error("eerror");
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
                                onChange={() => {
                                    return;
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
                            type="text"
                            feedBackText="중복확인이필요합니다"
                            onChange={() => {
                                return;
                            }}
                            placeholder="비밀번호를 입력해 주세요."
                            isValid={true}
                        />
                        <Input
                            inputLabel="비밀번호 확인"
                            name="nickName"
                            type="text"
                            feedBackText=""
                            onChange={() => {
                                return;
                            }}
                            placeholder="비밀번호를 한 번 더 입력해 주세요."
                            isValid={true}
                        />
                    </div>
                    <div className={S.inputBoxLeft}>
                        <Dropdown
                            inputLabel="개발 경력"
                            options={CAREER_OPTIONS}
                            onChange={() => {
                                return;
                            }}
                            value={profileDate?.carrer ?? "경력없음"}
                        />
                        <Input
                            inputLabel="공부목표"
                            name="nickName"
                            type="text"
                            feedBackText="중복확인이필요합니다."
                            onChange={() => {
                                return;
                            }}
                            placeholder="ss"
                            isValid={true}
                        />
                        <Input
                            inputLabel="공부/사용 중인 스택(선택)"
                            name="nickName"
                            type="text"
                            feedBackText=""
                            onChange={() => {
                                return;
                            }}
                            placeholder="기술 스텍을 검색해 등록해 주세요."
                            isValid={true}
                        />
                        <div className={S.bedge}>
                            <span>React</span>
                            <button>X</button>
                        </div>
                        {/* 기술스택배열로 저장해서 뿌리기  */}
                    </div>
                </div>
                <div className={S.buttonWrapper}>
                    <Button
                        onClick={() => {
                            return;
                        }}
                        variant="secondary"
                    >
                        취소
                    </Button>
                    <Button
                        onClick={() => {}}
                        variant="secondary"
                        disabled={true}
                    >
                        변경사항저장
                    </Button>
                </div>
            </div>
        </>
    );
}

export default Profile;
