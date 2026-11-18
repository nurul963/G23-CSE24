import { User } from "../models/user.model.js";

export const getProfile=async(req,resp)=>{
    const user=await User.findById(req.user.sub);
    return resp.status(200).json(user);
}
    