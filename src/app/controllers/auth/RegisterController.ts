import { Request, Response } from "express";
import APIError from "../../../@utils/error";
import ResponseMessage from "../../../@utils/response";
import AuthService from "../../services/authService/authService";

export const Register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, userName, password } = req.body;

    const result = await AuthService.register(fullName, userName, password);

    if (result.error) {
      new ResponseMessage(result.error).error400(res);
      return;
    }
    new ResponseMessage("Kullanıcı başarıyla eklendi").created(res);
    return;
  } catch (error) {
    throw new APIError("Kullanıcı kayıt esnasında bir sorun oluştu!", 400);
  }
};
