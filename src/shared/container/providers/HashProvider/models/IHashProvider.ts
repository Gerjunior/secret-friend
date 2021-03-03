export default interface IHashProvider {
  hash(payload: string): Promise<string>;
  compare(payload: string, encrypted: string): Promise<boolean>;
}
