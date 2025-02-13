import { Request, Response } from "express";
import User from "../../models/User";
import bcrypt from "bcrypt";
import APIError from "../../../@utils/error";
import ResponseMessage from "../../../@utils/response";

export const Register = async (req: Request, res: Response) => {
  try {
    const { fullName, userName, password } = req.body;

    const userCheck = await User.findOne({ userName });

    if (userCheck) {
      throw new ResponseMessage("Bu kullanıcı adı zaten mevcut!").error400(res);
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      userName,
      password: hashedPassword,
    });
    await newUser.save();
    return new ResponseMessage("Kullanıcı başarıyla eklendi").created(res);
  } catch (error) {
    return new APIError("Kullanıcı kayıt esnasında bir sorun oluştu!", 400);
  }
};
