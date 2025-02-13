class APIError extends Error {
  public statusCode: number;
  constructor(message: string, statusCode: number = 400) {
    super(message), (this.statusCode = statusCode);
    if (process.env.NODE_ENV !== "development") {
      this.stack = "";
    }
  }
}

export default APIError;
