import Poll from "../../models/Poll";
import User from "../../models/User";

export default class PollService {
  static async createPoll(
    userId: string,
    title: string,
    questions: { questionText: string; options: string[] }[],
    expiresAt: Date | undefined
  ) {
    const user = await User.findById(userId);
    if (!user) {
      return null;
    }
    const newPoll = new Poll({
      title,
      questions,
      expiresAt,
      isActive: true,
      user: userId,
    });
    await newPoll.save();
    return newPoll;
  }
  static async updatePoll(
    pollId: string,
    userId: string,
    updateData: {
      title?: string;
      expiresAt?: Date;
      questions?: Array<{
        _id?: string;
        questionText?: string;
        options?: string[];
      }>;
    }
  ) {
    const poll = await Poll.findOne({
      _id: pollId,
      user: userId,
      isActive: true,
    });

    if (!poll) return null;
    const updateFields: any = {};
    if (updateData.title) {
      updateFields.title = updateData.title;
    }
    if (updateData.questions) {
      for (const question of updateData.questions) {
        if (question._id) {
          await Poll.updateOne(
            {
              _id: pollId,
              "questions._id": question._id,
            },
            {
              $set: {
                "questions.$.questionText": question.questionText,
                "questions.$.options": question.options,
              },
            }
          );
        }
      }
    }
    const updatedPoll = await Poll.findOneAndUpdate(
      { _id: pollId },
      { $set: updateFields },
      { new: true }
    );

    return updatedPoll;
  }
  static async deletePoll(pollId: string, userId: string, questionId?: string) {
    if (questionId) {
      const poll = await Poll.findOneAndUpdate(
        { _id: pollId, user: userId },
        { $pull: { questions: { _id: questionId } } },
        { new: true }
      );

      if (!poll) {
        return null;
      }

      return poll;
    } else {
      const poll = await Poll.findOneAndDelete({
        _id: pollId,
        user: userId,
      });

      if (!poll) {
        return null;
      }

      return poll;
    }
  }
}
