import {sendVerificationEmail} from "../utils/nodeMailer.cjs";

export default async function requestVerification (req,res) {
    const user = req.user;
    if(!user) return res.status(404).json({message:"No user info provided."});

    try {
        if (user.emailVerified) {
            const jsonUser = {
                gmail: user.gmail,
                username: user.username,
                profile: user?.profile[0]?.url?user?.profile[0]?.url:null,
                emailVerified: user?.emailVerified,
            }
            return res.status(201).json({ message: 'Email Verified Successfully', user:jsonUser , token:req.token});
        }

        await sendVerificationEmail(user.gmail,req.token);
        return res.status(200).json({ message: 'Verification email sent successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error', error });
    }
}