import { User } from "../models/user.model.js";
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken, getRefreshExpiry, hashToken, verifyRefreshToken } from "../utils/tokens.js";
import RefreshSession from "../models/RefreshSession.js";
import { NODE_ENV } from "../utils/env.js";
const COOKIE_NAME="refereshToken";
const cookieOption={
    httpOnly:true,
    secure:NODE_ENV==="production",
    sameSite:"strict",
    path:"/api/auth"
}
const setRefreshCookie = (res, token) => {
  res.cookie(COOKIE_NAME, token, {
    ...cookieOption,
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};
const clearRefreshCookie = (res) => {
  res.clearCookie(COOKIE_NAME, cookieOption);
};


export const register = async (req, resp) => {
    try {
        const { name, email, password,role } = req.body;
        if (!name.trim() || !email.trim() || !password.trim()) {
            return resp.status(400).json({
                message: "Bad request",
                success: false
            })
        }
        const exsist = await User.findOne({ email });
        if (exsist) {
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
        const user = await User.findOne({ email }).select("+password");
        if (!user || user.length === 0) {
            return resp.status(400).json({
                message: "User is not registered",
                success: false
            })
        }
        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched) {
            return resp.status(400).json({
                message: "Invalid Credential",
                success: false
            })
        }
        const refreshToken = generateRefreshToken(user);
        const accessToken = generateAccessToken(user);
        setRefreshCookie(resp,refreshToken);
        await RefreshSession.create({
            userId: user._id,
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
export const refreshAccessToken=async(req,resp)=>{
    const oldeSession=req.cookies?.refereshToken;
    if(!oldeSession){
        return resp.status(401).json({
            message:"Refresh token is missing"
        })
    }
    try {
        const decode=verifyRefreshToken(oldeSession);
        // console.log(decode);
        if(decode.type!=="refresh"){
            return resp.status(401).json({
                message:"Invalid token",
                success:false
            })
        }
        const accessToken=generateAccessToken({_id:decode.sub,role:decode.role});
        const oldeSessionToken=await RefreshSession.findOneAndUpdate(
            {
                userId:decode.sub,
                tokenHash:hashToken(oldeSession),
                expiresAt:{$gt:new Date()}
            },
            {
                $set:{revokedAt:new Date()}
            },
            {new:true}
        )
        if(!oldeSessionToken){
            return resp.status(401).json({
                message:"Refresh token has been expired",
                success:false
            })
        }
        const newRefreshToken=generateRefreshToken({_id:decode.sub,role:decode.role})
        setRefreshCookie(resp,newRefreshToken)
        await RefreshSession.create({
            userId:decode.sub,
            tokenHash:hashToken(newRefreshToken),
            expiresAt:getRefreshExpiry(newRefreshToken)

        })
        return resp.status(200).json({
            message:"New Access Token",
            success:true,
            accessToken
        })
        
    } catch (error) {
        clearRefreshCookie(resp);
       return resp.status(401).json({
        message:error.message,
        success:false
       }) 
    }
}
export const logout=async(req,resp)=>{
    clearRefreshCookie(resp);
    return resp.status(200).json({
        message:"Logout Success",
        success:true
    })
}