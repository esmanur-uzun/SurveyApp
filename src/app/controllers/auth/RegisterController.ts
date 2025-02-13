import { Request, Response } from "express";
import User from "../../models/User";
import bcrypt from "bcrypt";
import APIError from "../../../@utils/error";
import ResponseMessage from "../../../@utils/response";

export const Register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, userName, password } = req.body;

    const userCheck = await User.findOne({ userName });

    if (userCheck) {
      new ResponseMessage("Bu kullanıcı adı zaten mevcut!").error400(res);
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      userName,
      password: hashedPassword,
    });
    await newUser.save();
    new ResponseMessage("Kullanıcı başarıyla eklendi").created(res);
    return;
  } catch (error) {
    throw new APIError("Kullanıcı kayıt esnasında bir sorun oluştu!", 400);
  }
};
