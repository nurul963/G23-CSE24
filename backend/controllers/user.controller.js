import { User } from "../models/user.model.js";
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken, getRefreshExpiry, hashToken } from "../utils/tokens.js";
import RefreshSession from "../models/RefreshSession.js";
export const register = async (req, resp) => {
    try {
        const { name, email, password,role } = req.body;
        if (!name.trim() || !email.trim() || !password.trim()) {
            return resp.status(400).json({
                message: "Bad request",
                success: false
            })
        }
        const exsist = await User.find({ email });
        if (exsist.length > 0) {
            return resp.status(400).json({
                message: "User already exsist",
                success: false
            })
        }
        const hashPass = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashPass,role });
        await user.save();
        return resp.status(201).json({
            message: "User registered success",
            success: true,
            id: user._id,
            name: user.name,
            email: user.email
        })
    } catch (error) {
        return resp.status(500).json({
            message: error.message,
            success: false
        })
    }
}
export const login = async (req, resp) => {
    try {
        const { email, password } = req.body;
        if (!email.trim() || !password) {
            return resp.status(400).json({
                message: "Feild cannot be empty",
                success: false
            })
        }
        const user = await User.find({ email }).select("+password");
        if (!user || user.length === 0) {
            return resp.status(400).json({
                message: "User is not registered",
                success: false
            })
        }
        const isMatched = await bcrypt.compare(password, user[0].password);
        if (!isMatched) {
            return resp.status(400).json({
                message: "Invalid Credential",
                success: false
            })
        }
        const refreshToken = generateRefreshToken(user[0]);
        const accessToken = generateAccessToken(user[0]);
        await RefreshSession.create({
            userId: user[0]._id,
            tokenHash: hashToken(refreshToken),
            expiresAt: getRefreshExpiry(refreshToken)
        });
        return resp.status(200).json({
            message: "Login success",
            success: true,
            id:user._id,
            name:user.name,
            email:user.email,
            accessToken
        })

    } catch (error) {
        return resp.status(500).json({
            message: error.message,
            success: false
        })
    }
}