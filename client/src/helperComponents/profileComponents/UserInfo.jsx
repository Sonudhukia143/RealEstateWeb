export default function UserInfo({ userInfo }) {
    return (
        <>
            {userInfo?.length > 0 && (
                <div className="mt-3">
                    <h6>Additional Information</h6>
                    {userInfo?.map((info, index) => (
                        <div key={index} className="mb-2">
                            <strong>{info.type}: </strong>
                            <span>{info.content}</span>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}