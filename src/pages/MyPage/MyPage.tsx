import S from "./MyPage.module.css";
import DefultProfile from "@assets/Profile.jpg";
import { useEffect, useRef, useState } from "react";
import {
    getProfile,
    type responseGetProfile,
    type responseProfile,
} from "@/api/profile";
import { debounce } from "@/utils/debounce";
import { getStack } from "@/api/stack";
import { checkNicknameDuplicate } from "@/api/signup";
import { Link, useNavigate } from "react-router-dom";
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
    const { isLoggedIn } = useAuthStore();

    const navigator = useNavigate();

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
                    email: fetchProifle.email,
                };
                setProfileDate(fetched);
            } catch (error) {
                console.error(error);
            }
        };

        responesProfile();
    }, []);

    return (
        <>
            <div className={S.container}>
                <div>
                    <img
                        src={
                            profileDate?.profileImage
                                ? `https://dev-time-bucket.s3.ap-northeast-2.amazonaws.com/${profileDate?.profileImage}`
                                : DefultProfile
                        }
                        alt="프로필이미지"
                        style={{
                            width: "160px",
                            height: "160px",
                            borderRadius: "12px",
                        }}
                    />
                </div>
                <div className={S.userData}>
                    <div className={S.userDataHeader}>
                        <span className={S.nickname}>
                            {profileDate?.nickname}
                        </span>
                        <span className={S.purpose}>
                            {profileDate?.purpose}
                        </span>
                    </div>
                    <div className={S.profileBox}>
                        <div className={S.spanWrapper}>
                            <span>이메일 주소</span>
                            <span>{profileDate?.email}</span>
                        </div>
                        <div className={S.spanWrapper}>
                            <span>개발 경력</span>
                            <span>{profileDate?.career}</span>
                        </div>
                        <div className={S.spanWrapper}>
                            <span>공부목적</span>
                            <span>{profileDate?.purpose}</span>
                        </div>
                        <div>
                            <span>개발 스텍</span>
                            {!!profileDate?.techStacks?.length && (
                                <div className={S.bedgeWapper}>
                                    {profileDate?.techStacks?.map(
                                        (stack, index) => (
                                            <div
                                                className={S.bedge}
                                                key={index}
                                            >
                                                <span>{stack}</span>
                                            </div>
                                        ),
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className={S.editWrapper}>
                    <Link className={S.edit} to={"/edit"}>
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="#717887"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M14.9017 4.27001C15.6629 3.50843 16.8972 3.50791 17.659 4.26885L19.7295 6.33692C20.4916 7.09817 20.4921 8.33315 19.7306 9.09504L9.95693 18.8741C9.68533 19.1458 9.33951 19.3313 8.96287 19.4072L4.59689 20.2869C4.35061 20.3365 4.09585 20.2595 3.91826 20.0819C3.74067 19.9042 3.66384 19.6494 3.7136 19.4031L4.59491 15.0423C4.67087 14.6664 4.85596 14.3213 5.12703 14.0501L14.9017 4.27001ZM16.599 5.33011C16.4232 5.15451 16.1383 5.15463 15.9627 5.33038L14.4258 6.86811L17.1314 9.57376L18.6697 8.03467C18.8454 7.85885 18.8453 7.57386 18.6694 7.39818L16.599 5.33011ZM16.0711 10.6347L13.3654 7.92906L6.18798 15.1104C6.12543 15.173 6.08271 15.2527 6.06518 15.3394L5.40757 18.5934L8.66658 17.9367C8.7535 17.9192 8.83331 17.8764 8.89598 17.8137L16.0711 10.6347Z"
                                fill="currentColor"
                            />
                        </svg>
                        <span>회원 정보수정</span>
                    </Link>
                </div>
            </div>
        </>
    );
}

export default MyPage;
