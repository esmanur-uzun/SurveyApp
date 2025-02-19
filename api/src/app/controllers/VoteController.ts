import { Request, Response, NextFunction } from "express";
import VoteService from "../services/voteService/voteService";
import Vote, { IVote } from "../models/Vote";
import APIError from "../../@utils/error";
import ResponseMessage from "../../@utils/response";
import BaseController from "../../@base/baseController";
import { Server } from "socket.io";

class VoteController extends BaseController<IVote> {
  constructor(io: Server) {
    super(Vote, io);
    this.saveVote = this.saveVote.bind(this);
    this.getById = this.getById.bind(this);
  }
  public async saveVote(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { pollId, questionId, selectedOption } = req.body;
      const userId = req.userId;

      if (!userId) {
        new ResponseMessage("Kullanıcı bulunamadı!").error401(res);
        return;
      }

      const vote = await VoteService.castVote(
        pollId,
        questionId,
        userId,
        selectedOption
      );

      if (!vote) {
        new ResponseMessage("Oy kullanılamadı!").error400(res);
        return;
      }
      if (vote.hasVoted) {
        new ResponseMessage("Bu soru için zaten oy kullanmışsınız!").error400(
          res
        );
        return;
      }
      this.io.emit("vote:created", { pollId, questionId, selectedOption });
      new ResponseMessage("Oy başarıyla kullanıldı").success(res);
    } catch (error) {
      console.log(error);

      throw new APIError("Oy kullanırken bir hata oluştu!");
    }
  }
  public override getById = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id: pollId } = req.params;

      if (!pollId) {
        new ResponseMessage("Anket ID gerekli!").error400(res);
        return;
      }
      const votes = await VoteService.getVotesByQuestion(pollId);

      if (!votes || votes.length === 0) {
        new ResponseMessage("Bu ankete ait oy bulunamadı!").error404(res);
        return;
      }

      new ResponseMessage(votes, "Oylar başarıyla alındı").success(res);
    } catch (error) {
      console.error(error);
      new APIError("Oylar getirilirken bir hata oluştu!");
    }
  };
}

export default VoteController;
