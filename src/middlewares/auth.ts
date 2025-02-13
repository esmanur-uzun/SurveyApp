import jwt, { JwtPayload } from "jsonwebtoken";
import { Response, Request, NextFunction } from "express";
import { config } from "../@utils/config";
import APIError from "../@utils/error";
import User from "../app/models/User";
import ResponseMessage from "../@utils/response";

interface UserPayload {
  userName: string;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: UserPayload;
  }
}

const JWT = {
  createToken(user: { userName: string }, res: Response) {
    try {
      const secretKey = config.jwt_access_secret as string;

      const token = jwt.sign({ userName: user.userName }, secretKey, {
        algorithm: "HS512",
        expiresIn: Number(config.jwt_expires_in) || "1h",
      });
      return res.status(201).json({
        success: true,
        token,
        message: "Giriş başarılı",
      });
    } catch (error) {
      throw new APIError("Token oluşturulurken bir hata oluştu!", 401);
    }
  },

  async tokenCheck(req: Request, res: Response, next: NextFunction) {
    try {
      const headerToken =
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ");

      if (!headerToken) {
        return new ResponseMessage(
          "Geçersiz oturum, lütfen giriş yapın!"
        ).error401(res);
      }

      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return new ResponseMessage(
          "Token bulunamadı, lütfen giriş yapın!"
        ).error401(res);
      }

      const decoded = jwt.verify(
        token,
        config.jwt_access_secret as string
      ) as JwtPayload & { userName: string };

      if (decoded && typeof decoded === "object" && "userName" in decoded) {
        const userInfo = await User.findOne({ userName: decoded.userName });

        if (!userInfo) {
          return new ResponseMessage("Kullanıcı bulunamadı!").error401(res);
        }

        req.user = userInfo;
      }
      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return new ResponseMessage("Geçersiz token!").error401(res);
      }
      if (error instanceof jwt.TokenExpiredError) {
        return new ResponseMessage(
          "Token süresi dolmuş, lütfen tekrar giriş yapın!"
        ).error401(res);
      }
      throw new APIError("Yetkilendirme hatası!", 401);
    }
  },
};

export default JWT;
