import IAddMemberToGroupDTO from '@modules/groups/dtos/IAddMemberToGroupDTO';
import IGroup from '../entities/IGroup';

export default interface IGroupMembers {
  addMember(data: IAddMemberToGroupDTO): Promise<IGroup | undefined>;
  removeMember(group_id: string, user_id: string): Promise<IGroup | undefined>;
}
