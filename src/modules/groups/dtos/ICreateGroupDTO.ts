export default interface ICreateGroupDTO {
  name: string;
  max_value?: number;
  min_value?: number;
  reveal_date?: Date;
  draw_date?: Date;
  admin_nickname: string;
}
