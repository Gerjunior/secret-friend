export default interface IUpdateUserDTO {
  id: string;
  first_name?: string;
  last_name?: string;
  nickname?: string;
  password?: string;
  birth_date?: Date;
  description?: string;
}
