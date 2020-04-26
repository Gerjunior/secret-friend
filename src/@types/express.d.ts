declare namespace Express {
  export interface Request {
    user_id: string;
    user_nickname: string;

    group_id: string;
  }
}
