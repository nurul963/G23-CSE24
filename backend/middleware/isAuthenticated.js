import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET } from '../utils/env.js';
export const isAuthenticated = (req, resp, next) => {
    const token = req.headers?.token || req.cookies?.token || null;
    try {
        if (!token) {
            return resp.status(401).json({
                message: "UnAuthorized",
                success: false
            })
        }
        const decode = jwt.verify(token, ACCESS_TOKEN_SECRET);
        req.user = decode;
        next();
    } catch (error) {
        return resp.status(500).json({
            message: error.message,
            success: false
        })
    }
}