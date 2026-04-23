class apiError extends Error {
  constructor(
    public message: string = "something went wrong",
    public statusCode: number = 500,
    public isOperational:boolean = true,
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export default apiError;