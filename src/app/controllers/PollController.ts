import { Request, Response, NextFunction } from "express";
import PollService from "../services/pollService/pollService";
import Poll, { IPoll } from "../models/Poll";
import APIError from "../../@utils/error";
import ResponseMessage from "../../@utils/response";
import BaseController from "../../@base/baseController";
import { Server } from "socket.io";

class PollController extends BaseController<IPoll> {
  constructor(io: Server) {
    super(Poll, io);
    this.CreatePoll = this.CreatePoll.bind(this);
  }

  public async CreatePoll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { title, questions, expiresAt } = req.body;
      const userId: string = req.userId ?? "";

      const newPoll = await PollService.createPoll(
        userId,
        title,
        questions,
        expiresAt
      );

      if (!newPoll) {
        new ResponseMessage("Anket eklenemedi!").error400(res);
        return;
      }

      this.io.emit("pollCreated", newPoll);
      new ResponseMessage("Anket başarıyla eklendi").created(res);
    } catch (error) {
      next(new APIError("Anket kaydedilirken bir hata oluştu!"));
    }
  }
}

export default PollController;
