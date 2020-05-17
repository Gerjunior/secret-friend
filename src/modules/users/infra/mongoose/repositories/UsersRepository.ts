import userSchema, { IUser } from '@modules/users/infra/mongoose/schemas/Users';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

class UsersRepository implements IUsersRepository {
  public async findByNickname(nickname: string): Promise<IUser | null> {
    const user = userSchema.findOne({ nickname });
    return user || null;
  }

  public async findByEmail(email: string): Promise<IUser | null> {
    const user = userSchema.findOne({ email });
    return user || null;
  }
}

export default UsersRepository;
