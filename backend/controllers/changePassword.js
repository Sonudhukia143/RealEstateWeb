import bcrypt from 'bcrypt';

export default async function changePassword (req,res) {
    const { newPassword, confirmPassword } = JSON.parse(req.body);
    console.log(newPassword,confirmPassword);
    console.log(JSON.parse(req.body));
    if(!newPassword || !confirmPassword) return res.status(400).json({ message: 'Please fill all fields' });
    if(newPassword !== confirmPassword) return res.status(400).json({ message: 'Passwords do not match' });

    try{
        const user = req.user;
        if (!user) return res.status(404).json({ message: "User not found" });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        if(!hashedPassword) return res.status(404).json({message:"Unable to hash password."});

        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({ message: 'Password changed successfully.' });
    }catch(err){
        return res.status(400).json({ message: 'Invalid or expired token.' });
    }
}