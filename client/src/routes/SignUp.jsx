import { useState, useEffect } from "react";

export default function SignUp() {
    const [img, setImg] = useState("/assets/profile.webp");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const handleImageChange = (event) => {
        const file = event.target.files[0]; // Get the selected file
        if (file) {
            // Check file size
            const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
            if (file.size > MAX_FILE_SIZE) {
                alert("File size exceeds 5MB. Please upload a smaller file.");
                return;
            }

            // Create a preview URL for the selected image
            const previewUrl = URL.createObjectURL(file);
            setImg(previewUrl); // Set the preview image
        }
    };

    useEffect(() => {
        // Revoke the object URL when the component unmounts or when `img` changes
        return () => {
            if (img && img !== "/src/assets/profile.webp") {
                URL.revokeObjectURL(img);
            }
        };
    }, [img]);

    const handleSubmit = (event) => {
        event.preventDefault();

        // Check if password and confirm password match
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        // Handle form submission (e.g., send data to a server)
        alert("Form submitted successfully!");
    };

    return (
        <>
            <div className="log-in-form-wrapper">
                <form className="log-in-form" onSubmit={handleSubmit}>
                    <h1>Sign Up</h1>
                    <div>
                        <label htmlFor="profile-image-upload" className="profile-image-container">
                            <img
                                id="profile-image-preview"
                                src={img}
                                alt="Profile Image Preview"
                            />
                            <input
                                type="file"
                                id="profile-image-upload"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </label>

                        <span className="row mb-3">
                            <label htmlFor="name" className="col-sm-12 col-form-label">
                                Name
                            </label>
                            <span className="col-sm-12">
                                <input type="text" className="form-control" id="name" required />
                            </span>
                        </span>
                        <span className="row mb-3">
                            <label htmlFor="email" className="col-sm-12 col-form-label">
                                Email
                            </label>
                            <span className="col-sm-12">
                                <input type="email" className="form-control" id="email" required />
                            </span>
                        </span>
                        <span className="row mb-3">
                            <label htmlFor="password" className="col-sm-12 col-form-label">
                                Password
                            </label>
                            <span className="col-sm-12">
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </span>
                        </span>
                        <span className="row mb-3">
                            <label htmlFor="confirmpassword" className="col-sm-12 col-form-label">
                                Confirm Password
                            </label>
                            <span className="col-sm-12">
                                <input
                                    type="password"
                                    className="form-control"
                                    id="confirmpassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </span>
                        </span>
                    </div>
                    {error && <div style={{ color: "red" }}>{error}</div>}
                    <button type="submit" className="btn btn-primary">Sign Up</button>
                </form>
            </div>
        </>
    );
}
