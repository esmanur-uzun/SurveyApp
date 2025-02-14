import { Document, Schema } from "mongoose";

export interface IBaseModel extends Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

const baseSchemaFields = {
  _id: {
    type: Schema.Types.ObjectId,
    auto: true,
  },
};

const baseSchemaOptions = {
  timestamps: {
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  },
  _id: false,
};

const baseSchema = new Schema(baseSchemaFields, baseSchemaOptions);

export default baseSchema;
