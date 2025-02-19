import Vote from "../../models/Vote";
import Poll from "../../models/Poll";
import mongoose from "mongoose";

export default class VoteService {
  static async castVote(
    pollId: string,
    questionId: string,
    userId: string,
    selectedOption: string
  ) {
    const poll = await Poll.findOne({
      _id: pollId,
      "questions._id": questionId,
    });
    if (!poll) return null;

    const question = poll.questions.find(
      (q) => q._id.toString() === questionId
    );

    if (!question) return null;

    const hasVoted = await Vote.findOne({
      poll: pollId,
      questionId: questionId,
      user: userId,
    });
    if (hasVoted) {
      return {
        hasVoted: true,
      };
    }

    const newVote = new Vote({
      poll: pollId,
      questionId: questionId,
      user: userId,
      selectedOption,
    });
    await newVote.save();
    return { hasVoted: false, newVote };
  }
  static async getVotesByQuestion(pollId: string) {
    if (!pollId) {
      return null;
    }
    const votes = await Vote.aggregate([
      { $match: { poll: new mongoose.Types.ObjectId(pollId) } },
      {
        $group: {
          _id: "$questionId",
          totalVotes: { $sum: 1 },
          options: {
            $push: "$selectedOption",
          },
        },
      },
      {
        $project: {
          _id: 0,
          questionId: "$_id",
          totalVotes: 1,
          optionCounts: {
            $arrayToObject: {
              $map: {
                input: { $setUnion: ["$options", []] },
                as: "option",
                in: {
                  k: "$$option",
                  v: {
                    $size: {
                      $filter: {
                        input: "$options",
                        as: "o",
                        cond: { $eq: ["$$o", "$$option"] },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    ]);

    return votes;
  }
}
