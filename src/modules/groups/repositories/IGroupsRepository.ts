import IGroup from '@modules/groups/entities/IGroup';
import IUser from '@modules/users/entities/IUser';
import ICreateGroupDTO from '@modules/groups/dtos/ICreateGroupDTO';
import IUpdateGroupDTO from '@modules/groups/dtos/IUpdateGroupDTO';

export default interface IGroupsRepository {
  findById(group_id: string): Promise<IGroup | undefined>;
  create(data: ICreateGroupDTO, admin: IUser): Promise<IGroup | undefined>;
  update(data: IUpdateGroupDTO): Promise<IGroup | undefined>;
}
