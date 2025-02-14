import bcrypt from "bcrypt";
import JWT from "../../../middlewares/auth.middleware";
import User from "../../models/User";

export default class AuthService {
  static async login(userName: string, password: string) {
    const user = await User.findOne({ userName });

    if (!user) {
      return null;
    }
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return null;
    }
    const token = JWT.createToken({ userName: user.userName });
    return { user, token };
  }
  static async register(fullName: string, userName: string, password: string) {
    const userCheck = await User.findOne({ userName });
    if (userCheck) {
      return { error: "Kullanıcı adı zaten mevcut!" };
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      userName,
      password: hashedPassword,
    });
    await newUser.save();
    return { user: newUser };
  }
}
