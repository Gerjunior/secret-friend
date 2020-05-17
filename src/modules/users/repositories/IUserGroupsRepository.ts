import { IGroup } from '@modules/groups/infra/mongoose/schemas/Groups';
import { IUser } from '@modules/users/infra/mongoose/schemas/Users';

export default interface IUserGroups {
  addGroupToUser(group: IGroup, nickname: string): Promise<IUser | undefined>;
}
