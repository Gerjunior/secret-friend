import { hash as bcrypt_hash, compare } from 'bcrypt';
import IHashProvider from '../models/IHashProvider';

export default class BCryptHashProvider implements IHashProvider {
  public async hash(payload: string): Promise<string> {
    const encrypted = await bcrypt_hash(payload, 8);

    return encrypted;
  }

  public async compare(payload: string, encrypted: string): Promise<boolean> {
    return compare(payload, encrypted);
  }
}
