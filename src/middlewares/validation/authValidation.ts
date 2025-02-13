import z from "zod";
import { Request, Response, NextFunction } from "express";
import APIError from "../../@utils/error";

const userValidationSchema = z.object({
  fullName: z
    .string({
      required_error: "İsim alanı boş geçilemez!",
      invalid_type_error:
        "İsim alanı yalnızca alfabetik karakterler içermelidir!",
    })
    .trim()
    .max(30, "İsim alanı en fazla 30 karakterden oluşabilir!")
    .min(3, "İsim alanı en az 3 karakter içermelidir!"),

  userName: z
    .string({
      required_error: "Kullanıcı adı boş geçilemez!",
    })
    .trim()
    .min(2, "Soyisim alanı en az 2 karakter içermelidir!")
    .max(30, "Soyisim alanı en fazla 30 karakterden oluşabilir!")
    .regex(
      /^[a-zA-Z0-9_.]+$/,
      "Kullanıcı adı yalnızca harf, rakam, nokta ve alt çizgi içerebilir!"
    ),

  password: z
    .string({
      required_error: "Şifre alanı boş geçilemez!",
      invalid_type_error: "Şifre alanı yalnızca karakterler içermelidir!",
    })
    .min(6, "Şifre en az 6 karakterden oluşmalıdır!")
    .max(10, "Şifre en fazla 10 karakter içerebilir!"),
});

const loginValidationSchema = z.object({
  userName: z
    .string({
      required_error: "Kullanıcı adı alanı boş geçilemez!",
    })
    .trim(),
  password: z
    .string({
      required_error: "Şifre alanı boş geçilemez!",
      invalid_type_error: "Şifre alanı yalnızca karakterler içermelidir!",
    })
    .min(6, "Şifre en az 6 karakterden oluşmalıdır!")
    .max(10, "Şifre en fazla 10 karakter içerebilir!"),
});

class authValidation {
  constructor() {}
  static register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await userValidationSchema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors
          .map((err) => err.message)
          .join(", ");
        next(new APIError(formattedErrors, 400));
      } else {
        next(error);
      }
    }
  };
  static login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await loginValidationSchema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors
          .map((err) => err.message)
          .join(", ");
        next(new APIError(formattedErrors, 400));
      } else {
        next(error);
      }
    }
  };
}

export default authValidation;
