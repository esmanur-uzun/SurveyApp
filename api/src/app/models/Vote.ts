import mongoose, { Schema } from "mongoose";
import { IBaseModel } from "../../@base/baseModel";

export interface IVote extends IBaseModel {
  poll: mongoose.Schema.Types.ObjectId;
  questionId: mongoose.Schema.Types.ObjectId;
  user: mongoose.Schema.Types.ObjectId;
  selectedOption: string;
}

const voteSchema = new Schema(
  {
    poll: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Poll",
      required: true,
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    selectedOption: {
      type: String,
      required: [true, "Boş seçenek kaydedilemez!"],
    },
  },
  {
    timestamps: true,
  }
);

const Vote = mongoose.model<IVote>("Vote", voteSchema);
export default Vote;
