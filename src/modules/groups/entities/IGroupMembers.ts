export default interface IGroupMembers {
  _id: string;
  name: string;
  nickname: string;
  description?: string;
  birth_date?: Date;
  email: string;
  wishes?: [string] | undefined;
  secret_friend?: string | undefined;
}
