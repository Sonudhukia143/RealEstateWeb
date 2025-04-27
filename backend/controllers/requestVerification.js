import {sendVerificationEmail} from "../utils/nodeMailer.cjs";

export default async function requestVerification (req,res) {
    const user = req.user;
    if(!reqUser) return res.status(404).json({message:"No user info provided."});

    try {
        const user = reqUser.id;

        if (user.emailVerified) {
            const jsonUser = {
                gmail: user.gmail,
                username: user.username,
                profile: user?.profile[0]?.url?user?.profile[0]?.url:null,
                emailVerified: user?.emailVerified,
            }
            return res.status(201).json({ message: 'Email Verified Successfully', user:jsonUser , token:token});
        }

        await sendVerificationEmail(user.gmail,token);
        return res.status(200).json({ message: 'Verification email sent successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error });
    }
}