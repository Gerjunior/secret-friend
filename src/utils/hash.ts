import { hash as bcrypt_hash } from 'bcrypt';

async function hash(unhashed: string): Promise<string> {
  const hashed = await bcrypt_hash(unhashed, 8);

  return hashed;
}

export default hash;
