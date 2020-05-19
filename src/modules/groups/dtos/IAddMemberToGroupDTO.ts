export default interface IAddMemberToGroupDTO {
  group_id: string;
  user_id: string;
  name: string;
  last_name?: string;
  nickname: string;
  email: string;
  birth_date?: Date;
  description?: string;
}
