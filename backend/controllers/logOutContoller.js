export default async function logout (req,res) {
    
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'None',
        path:'/',
    });

    return res.status(200).json({ message: 'Logged out successfully' });
}