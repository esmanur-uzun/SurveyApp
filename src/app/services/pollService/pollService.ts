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
}
