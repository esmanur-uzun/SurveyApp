import { Response } from "express";

class ResponseMessage {
  data: any;
  message: string | null;

  constructor(data: any = null, message: string | null = null) {
    this.data = data;
    this.message = message;
  }

  success(res: Response) {
    return res.status(200).json({
      success: true,
      data: this.data,
      message: this.message ?? "İşlem Başarılı",
    });
  }

  created(res: Response) {
    return res.status(201).json({
      success: true,
      data: this.data,
      message: this.message ?? "İşlem Başarılı",
    });
  }

  error500(res: Response) {
    return res.status(500).json({
      success: false,
      data: this.data,
      message: this.message ?? "İşlem Başarısız!",
    });
  }

  error400(res: Response) {
    return res.status(400).json({
      success: false,
      data: this.data,
      message: this.message ?? "İşlem Başarısız!",
    });
  }

  error401(res: Response) {
    return res.status(401).json({
      success: false,
      data: this.data,
      message: this.message ?? "Lütfen Oturum Açın !",
    });
  }

  error404(res: Response) {
    return res.status(404).json({
      success: false,
      data: this.data,
      message: this.message ?? "İşlem Başarısız!",
    });
  }

  error429(res: Response) {
    return res.status(429).json({
      success: false,
      data: this.data,
      message: this.message ?? "Çok Fazla İstekte Bulunuldu !",
    });
  }
}

export default ResponseMessage;
