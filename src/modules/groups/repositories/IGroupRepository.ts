import Group from '@modules/groups/infra/typeorm/entities/Group';
import ICreateGroupDTO from '@modules/groups/dtos/ICreateGroupDTO';
import IUpdateGroupDTO from '@modules/groups/dtos/IUpdateGroupDTO';

export default interface IGroupRepository {
  findById(group_id: string): Promise<Group | undefined>;
  create(data: ICreateGroupDTO): Promise<Group | undefined>;
  update(data: IUpdateGroupDTO): Promise<Group | undefined>;
  delete(group_id: string): Promise<boolean>;
}
