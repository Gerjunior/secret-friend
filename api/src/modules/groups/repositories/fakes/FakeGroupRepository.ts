import { uuid } from 'uuidv4';

import IGroupRepository from '@modules/groups/repositories/IGroupRepository';

import ICreateGroupDTO from '@modules/groups/dtos/ICreateGroupDTO';

import Group from '@modules/groups/infra/typeorm/entities/Group';
import IUpdateGroupDTO from '@modules/groups/dtos/IUpdateGroupDTO';

class FakeGroupRepository implements IGroupRepository {
  private groups: Group[] = [];

  async findById(group_id: string): Promise<Group | undefined> {
    return this.groups.find(group => group.id === group_id);
  }

  async create(data: ICreateGroupDTO): Promise<Group | undefined> {
    const group = new Group();

    Object.assign(group, {
      ...data,
      id: uuid(),
      created_at: new Date(),
      updated_at: new Date(),
    });

    this.groups.push(group);

    return group;
  }

  async update(data: IUpdateGroupDTO): Promise<Group | undefined> {
    const groupIndex = this.groups.findIndex(
      findGroup => findGroup.id === data.id,
    );

    const storagedGroup = this.groups[groupIndex];

    const updatedGroup = new Group();
    Object.assign(updatedGroup, {
      ...storagedGroup,
      ...data,
    });

    this.groups[groupIndex] = updatedGroup;

    return this.groups[groupIndex];
  }

  async delete(group_id: string): Promise<boolean> {
    const groupIndex = this.groups.findIndex(group => group.id === group_id);

    if (groupIndex === -1) {
      return false;
    }

    this.groups.splice(groupIndex, 1);

    return true;
  }
}

export default FakeGroupRepository;
