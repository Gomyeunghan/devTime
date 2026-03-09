import S from "./ProfileImage.module.css";

function ProfileImage({
    previewImage,
    handleImageChange,
}: {
    previewImage: string | null;
    handleImageChange: (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => Promise<void>;
}) {
    return (
        <div className={S.addImageBox}>
            <input
                type="file"
                id="fileInput"
                style={{ display: "none" }}
                onChange={handleImageChange}
            />

            <div>
                {previewImage ? (
                    <label htmlFor="fileInput" className={S.addImage}>
                        <img
                            src={previewImage}
                            style={{
                                width: "100px",
                                height: "100px",
                            }}
                        />
                    </label>
                ) : (
                    <label htmlFor="fileInput" className={S.addImage}>
                        +
                    </label>
                )}
            </div>

            <span>5MB 미만의 .png, .jpg 파일</span>
        </div>
    );
}

export default ProfileImage;
