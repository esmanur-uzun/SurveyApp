import { Request, Response } from "express";
import APIError from "../../../@utils/error";
import ResponseMessage from "../../../@utils/response";
import AuthService from "../../services/authService/authService";

export const Login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userName, password } = req.body;
    const result = await AuthService.login(userName, password);

    if (!result) {
      new ResponseMessage("Kullanıcı adı ya da şifre hatalıdır!").error401(res);
      return;
    }
    new ResponseMessage(
      { token: result.token, user: { userName: result.user.userName } },
      "Giriş başarılı"
    ).success(res);
  } catch (error) {
    throw new APIError("Oturum açarken bir hata oluştu", 401);
  }
};
