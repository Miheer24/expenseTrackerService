import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getDb } from '../database/connection';

export const register = async (req) => {
    const { email, password } = req;
    const db = await getDb();
    const users = await db.collection('users');

    const existingUser = await users.findOne({ email });
    if (existingUser) {
        throw new Error({ code: 400, msg: 'User already exixts!' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await users.insertOne({
        email,
        password: hashedPassword,
        createdAt: new Date()
    });
    const token = jwt.sign(
        {
            id: result.insertedId,
            email
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    )
    return {
        message: 'User created successfully!',
        user: { id: result.insertedId, email },
        token
    }
}

export const login = async (body) => {
    const { email, password } = body;
    const db = await getDb();
    const users = db.collection('users');
    const user = await users.findOne({ email });
    if (!user) throw new Error({ code: 400, msg: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error({ code: 400, msg: 'Invalid email or password' });

    const token = jwt.sign(
        {
            id: user._id,
            email: user.email
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    )
    return {
        token,
        user: { id: user._id, email: user.email }
    }
}