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
    userId?: string;
  }
}

const JWT = {
  createToken(user: { userName: string }) {
    try {
      const secretKey = config.jwt_access_secret as string;

      const token = jwt.sign({ userName: user.userName }, secretKey, {
        algorithm: "HS512",
        expiresIn: Number(config.jwt_expires_in) || "1h",
      });
      return token;
    } catch (error) {
      throw new APIError("Token oluşturulurken bir hata oluştu!", 401);
    }
  },

  async verifyToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const headerToken =
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ");

      if (!headerToken) {
        new ResponseMessage("Geçersiz oturum, lütfen giriş yapın!").error401(
          res
        );
        return;
      }

      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        new ResponseMessage("Token bulunamadı, lütfen giriş yapın!").error401(
          res
        );
        return;
      }

      const decoded = jwt.verify(
        token,
        config.jwt_access_secret as string
      ) as JwtPayload & { userName: string };

      if (decoded && typeof decoded === "object" && "userName" in decoded) {
        const userInfo = await User.findOne({ userName: decoded.userName });

        if (!userInfo) {
          new ResponseMessage("Kullanıcı bulunamadı!").error401(res);
          return;
        }

        req.user = userInfo;
        req.userId = userInfo._id.toString();
      }
      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        new ResponseMessage("Geçersiz token!").error401(res);
        return;
      }
      if (error instanceof jwt.TokenExpiredError) {
        new ResponseMessage(
          "Token süresi dolmuş, lütfen tekrar giriş yapın!"
        ).error401(res);
        return;
      }
      throw new APIError("Yetkilendirme hatası!", 401);
    }
  },
};

export default JWT;
