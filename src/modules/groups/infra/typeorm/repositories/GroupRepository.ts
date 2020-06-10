import { Repository, getRepository } from 'typeorm';

import IGroupRepository from '@modules/groups/repositories/IGroupRepository';

import ICreateGroupDTO from '@modules/groups/dtos/ICreateGroupDTO';
import IUpdateGroupDTO from '@modules/groups/dtos/IUpdateGroupDTO';

import Group from '../entities/Group';

class GroupRepository implements IGroupRepository {
  private ormRepository: Repository<Group>;

  constructor() {
    this.ormRepository = getRepository(Group);
  }

  findById(group_id: string): Promise<Group | undefined> {
    return this.ormRepository.findOne(group_id, {
      relations: ['admin', 'members', 'members.user'],
    });
  }

  async create(data: ICreateGroupDTO): Promise<Group | undefined> {
    const group = this.ormRepository.create(data);

    await this.ormRepository.save(group);

    return group;
  }

  async update(data: IUpdateGroupDTO): Promise<Group | undefined> {
    await this.ormRepository.save(data);

    const group_id = data.id;

    return this.findById(group_id);
  }

  async delete(group_id: string): Promise<boolean> {
    const deleteResult = await this.ormRepository.delete({ id: group_id });

    return !!deleteResult.affected;
  }
}

export default GroupRepository;
