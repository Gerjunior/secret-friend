export default interface ICreateUserDTO {
  first_name: string;
  last_name?: string;
  email: string;
  birth_date?: Date;
  nickname: string;
  password: string;
  description?: string;
}
