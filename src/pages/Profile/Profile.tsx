import Input from "@/components/Input/Input";
import S from "./Profile.module.css";
import DefultProfile from "@assets/Profile.jpg";
import Button from "@/components/Button/Button";
import { useEffect, useState } from "react";
import { getProfile } from "@/api/profile";

function Profile() {
    const [nickName, setNickName] = useState("");
    useEffect(() => {
        const responesProfile = async () => {
            try {
                const fetchProifle = await getProfile();
                if (!fetchProifle) return;
                setNickName(fetchProifle.nickname);
            } catch (error) {
                console.error("eerror");
            }
        };

        responesProfile();
    }, []);

    console.log(nickName);
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
                                value={nickName}
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
                        <Input
                            inputLabel="공부 목적"
                            name="nickName"
                            type="text"
                            feedBackText=""
                            onChange={() => {
                                return;
                            }}
                            placeholder="공부 목적을 입력해 주세요."
                            isValid={true}
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
                        <Input
                            inputLabel="개발경력"
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
