export default interface IUpdateGroupDTO {
  group_id: string;
  name?: string;
  max_value?: number;
  min_value?: number;
  reveal_date?: Date;
  draw_date?: Date;
  status_flag?: string;
}
