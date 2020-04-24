declare namespace Express {
  export interface Request {
    user: {
      nickname: string;
    };
    group: {
      id: string;
    };
  }
}
