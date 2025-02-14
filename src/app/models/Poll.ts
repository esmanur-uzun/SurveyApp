import mongoose, { Schema } from "mongoose";
import { IBaseModel } from "../../@base/baseModel";

export interface IPoll extends IBaseModel {
  title: string;
  questions: {
    questionText: string;
    options: string[];
    votes: number[];
  }[];
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
  votes: {
    type: [Number],
    default: [],
  },
});

const pollSchemaFields = {
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
};

const pollSchema = new Schema(pollSchemaFields, {
  collection: "polls",
  timestamps: true, // Bu özellik, createdAt ve updatedAt'ı otomatik olarak ekler
});

const Poll = mongoose.model<IPoll>("Poll", pollSchema);

export default Poll;
