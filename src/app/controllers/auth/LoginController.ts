import { Request, Response } from "express";
import bcrypt from "bcrypt";
import JWT from "../../../middlewares/auth";
import User from "../../models/User";
import APIError from "../../../@utils/error";
import ResponseMessage from "../../../@utils/response";

export const Login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName });

    if (!user) {
      new ResponseMessage("Kullanıcı adı ya da şifre hatalıdır!").error401(res);
      return;
    }
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      new ResponseMessage("Kullanıcı adı ya da şifre hatalıdır!").error401(res);
      return;
    }
    JWT.createToken({ userName: user.userName }, res);
  } catch (error) {
    throw new APIError("Oturum açarken bir hata oluştu", 401);
  }
};
