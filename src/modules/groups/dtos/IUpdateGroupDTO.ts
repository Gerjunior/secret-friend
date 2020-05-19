import { Status } from '@modules/groups/entities/IGroup';
import IGroupMembers from '../entities/IGroupMembers';

export default interface IUpdateGroupDTO {
  group_id: string;
  name?: string;
  max_value?: number;
  min_value?: number;
  reveal_date?: Date;
  draw_date?: Date;
  status?: Status;
  members?: [IGroupMembers];
}
