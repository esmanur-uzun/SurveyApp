import mongoose, { Schema } from "mongoose";
import { IBaseModel } from "../../@base/baseModel";

export interface User extends IBaseModel {
  fullName: string;
  userName: string;
  password: string;
}

const userSchemaFields = {
  fullName: {
    type: String,
    required: [true, "Name is required"],
  },
  userName: {
    type: String,
    required: [true, "User name is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
};

const userSchema = new Schema(userSchemaFields, {
  collection: "users",
  timestamps: true,
});

const User = mongoose.model<User>("User", userSchema);

export default User;
