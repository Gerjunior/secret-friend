import mongoose, { Schema, Document } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export interface IGroup extends Document {
  id: string;
  name: string;
  min_value: number;
  max_value: number;
  draw_date: Date;
  reveal_date: Date;
  status: string;
  created_at: Date;
  updated_at: Date;
  admin_nickname: string;
  members: [
    {
      _id: string;
      name: string;
      nickname: string;
      description: string;
      birth_date: Date;
      email: string;
      wishes: [string] | undefined;
      secret_friend: string | undefined;
    },
  ];
}

export enum Status {
  Awaiting = 'A',
  Drawn = 'D',
  Finished = 'F',
  Cancelled = 'C',
}

const GroupSchema: Schema = new Schema(
  {
    name: { type: String, required: true, maxlength: 50, minlength: 2 },
    min_value: Number,
    max_value: Number,
    draw_date: Date,
    reveal_date: Date,
    status: {
      type: String,
      enum: ['A', 'D', 'F', 'C'],
      default: Status.Awaiting,
      required: true,
    },
    created_at: Date,
    updated_at: Date,
    admin_nickname: { type: String, required: true },
    members: [
      {
        _id: String,
        name: String,
        nickname: String,
        description: String,
        birth_date: Date,
        email: String,
        wishes: [String],
        secret_friend: String,
      },
    ],
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

GroupSchema.plugin(mongoosePaginate);

export default mongoose.model<IGroup>('Group', GroupSchema);
