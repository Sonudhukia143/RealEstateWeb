export default function UserInfo({ userInfo }) {
    return (
        <>
            {userInfo && (
                <div className="mt-3">
                    <h6>Additional Information</h6>
                        <div key={userInfo?.pincode} className="mb-2">
                            <strong>Pincode: </strong>
                            <span>{userInfo?.pincode}</span>
                        </div>
                        <div key={userInfo?.country} className="mb-2">
                            <strong>Country: </strong>
                            <span>{userInfo?.country}</span>
                        </div>
                        <div key={userInfo?.state} className="mb-2">
                            <strong>State: </strong>
                            <span>{userInfo?.state}</span>
                        </div>
                        <div key={userInfo?.city} className="mb-2">
                            <strong>City: </strong>
                            <span>{userInfo?.city}</span>
                        </div>                        
                        <div key={userInfo?.UserType} className="mb-2">
                            <strong>Usertype: </strong>
                            <span>{userInfo?.UserType}</span>
                        </div>
                </div>
            )}
        </>
    );
}