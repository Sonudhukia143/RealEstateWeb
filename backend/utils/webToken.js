import jwt from 'jsonwebtoken';

export default function generateToken (userId) {
    return jwt.sign({ id: userId }, process.env.JSON_WEB_SECRET, { expiresIn: '1d' });
};