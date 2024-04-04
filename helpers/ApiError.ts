export class ApiError {
  private static _message: string;
  private static _statusCode: number;

  static generate(
    error: any,
    alt?: string
  ): { message: string; status: number } {
    if (typeof error?.response?.data?.message === "string") {
      this._message = error?.response?.data?.message;
    } else if (Array.isArray(error?.response?.data?.message)) {
      this._message = error?.response?.data?.message[0];
    } else if (error?.response?.data?.message) {
      this._message = error?.response?.data?.message;
    } else if (error?.message) {
      this._message = error?.message;
    } else if (alt) this._message = alt;
    else this._message = "An error occurred";

    this._statusCode = error?.response?.status || 500;

    return {
      message: this._message,
      status: this._statusCode,
    };
  }
}
