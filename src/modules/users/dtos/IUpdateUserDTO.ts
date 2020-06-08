export default interface IUpdateUserDTO {
  id: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  password?: string;
  birth_date?: Date;
  description?: string;
}
