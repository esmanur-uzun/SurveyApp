import mongoose, { Schema } from "mongoose";
import { IBaseModel } from "../../@base/baseModel";

interface IQuestion {
  _id: mongoose.Schema.Types.ObjectId;
  questionText: string;
  options: string[];
}

export interface IPoll extends IBaseModel {
  title: string;
  questions: IQuestion[];
  isActive: boolean;
  expiresAt?: Date;
  user: mongoose.Schema.Types.ObjectId;
}

const questionSchema = new Schema({
  questionText: {
    type: String,
    required: [true, "Soru metni gereklidir"],
  },
  options: {
    type: [String],
    required: [true, "Seçenekler gereklidir"],
  },
});

const pollSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Anket başlığı gereklidir"],
    },
    questions: [questionSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "polls",
  }
);

const Poll = mongoose.model<IPoll>("Poll", pollSchema);
export default Poll;
