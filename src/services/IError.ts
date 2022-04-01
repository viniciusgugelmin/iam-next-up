export interface IError {
  response: {
    data: {
      message: string;
    };
    status: number;
  };
}
