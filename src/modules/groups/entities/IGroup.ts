import IGroupMembers from './IGroupMembers';

export default interface IGroup {
  _id: any;
  name: string;
  min_value?: number;
  max_value?: number;
  draw_date?: Date;
  reveal_date?: Date;
  status: string;
  created_at: Date;
  updated_at: Date;
  admin_nickname: string;
  members: [IGroupMembers];
}

export enum Status {
  Awaiting = 'A',
  Drawn = 'D',
  Finished = 'F',
  Cancelled = 'C',
}
