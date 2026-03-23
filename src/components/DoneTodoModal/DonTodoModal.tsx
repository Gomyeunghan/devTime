import type { detailStudyLogData } from "@/api/dashboard";
import BaseModal from "../BaseModal/BaseModal";
import Button from "../Button/Button";
import S from "./DoneTodoModal.module.css";
import clsx from "clsx";

function DoneTodoModal({
    data,
    isOpen,
    handleModal,
}: {
    data: detailStudyLogData;
    isOpen: boolean;
    handleModal: () => void;
}) {
    console.log(data);
    return (
        <BaseModal isOpen={isOpen} onClose={handleModal}>
            <BaseModal.Header>
                <h2 className={S.mainText}>{data.todayGoal}</h2>
            </BaseModal.Header>
            <BaseModal.Body>
                <ul className={S.listWrapper}>
                    {data.tasks.map(item => {
                        return (
                            <li
                                className={clsx(
                                    S.list,
                                    item.isCompleted && S.listCompleted,
                                )}
                                key={item.id}
                            >
                                {item.content}
                            </li>
                        );
                    })}
                </ul>
                <span className={S.reviewTitle}>한줄소감</span>
                <span className={S.review}>{data.review}</span>
            </BaseModal.Body>
            <BaseModal.Footer>
                <div className={S.buttonWrapper}>
                    <Button variant="secondary" onClick={handleModal}>
                        닫기
                    </Button>
                </div>
            </BaseModal.Footer>
        </BaseModal>
    );
}

export default DoneTodoModal;
