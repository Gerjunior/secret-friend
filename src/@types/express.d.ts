declare namespace Express {
  export interface Request {
    user: {
      id: string;
    };

    user_id: string;
    user_nickname: string;
    group_id: string;
  }
}
