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
    this.createPoll = this.createPoll.bind(this);
    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
    this.delete = this.delete.bind(this);
    this.updatePoll = this.updatePoll.bind(this);
    this.deletePoll = this.deletePoll.bind(this);
  }

  public async createPoll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { title, questions, expiresAt } = req.body;
      const userId = req.userId;

      if (!userId) {
        new ResponseMessage("Kullanıcı bulunamadı!").error401(res);
        return;
      }

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
  public override getAll = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const polls = await this.model
        .find({ isActive: true })
        .sort({ createdAt: -1 });
      this.io.emit("polls: updated", polls);
      new ResponseMessage(polls, "Anketler başarıyla alındı").success(res);
    } catch (error) {
      throw new APIError("Anketler alınırken bir hata oluştu!");
    }
  };
  public async updatePoll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.userId ?? "";
      const updateData = req.body;

      const updatedPoll = await PollService.updatePoll(id, userId, updateData);

      if (!updatedPoll) {
        new ResponseMessage(
          "Anket bulunamadı veya düzenleme yetkiniz yok!"
        ).error404(res);
        return;
      }

      this.io.emit("poll:updated", updatedPoll);

      new ResponseMessage(updatedPoll, "Anket başarıyla güncellendi").success(
        res
      );
    } catch (error) {
      next(new APIError("Anket güncellenirken bir hata oluştu!"));
    }
  }
  public async deletePoll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { questionId } = req.body;
      const userId = req.userId ?? "";

      const deletedPoll = await PollService.deletePoll(id, userId, questionId);

      if (!deletedPoll) {
        new ResponseMessage("Anket veya soru bulunamadı!").error404(res);
        return;
      }

      if (questionId) {
        this.io.emit("question:deleted", { pollId: id, questionId });
        new ResponseMessage(deletedPoll, "Soru başarıyla silindi").success(res);
      } else {
        this.io.emit("poll:deleted", deletedPoll);
        new ResponseMessage(deletedPoll, "Anket başarıyla silindi").success(
          res
        );
      }
    } catch (error) {
      next(new APIError("Anket veya soru silinirken bir hata oluştu!"));
    }
  }
}

export default PollController;
