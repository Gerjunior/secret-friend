import mongoose, { Schema, Document } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

export interface IGroup extends Document {
  id: string;
  name: string;
  min_value: number;
  max_value: number;
  draw_date: Date;
  reveal_date: Date;
  created_at: Date;
  updated_at: Date;
  admin: {
    _id: string;
    name: string;
    nickname: string;
    description: string;
    birth_date: string;
    email: string;
  };
  members: [
    {
      _id: string;
      name: string;
      nickcname: string;
      description: string;
      birth_date: string;
      email: string;
      wishes: [string];
      secret_friend: {
        _id: string;
        name: string;
        nickname: string;
        description: string;
        birth_date: string;
        email: string;
        wishes: [string];
      };
    },
  ];
}

const GroupSchema: Schema = new Schema({
  name: { type: String, required: true },
  min_value: Number,
  max_value: Number,
  draw_date: Date,
  reveal_date: Date,
  created_at: Date,
  updated_at: Date,
  admin: {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    nickname: { type: String, required: true },
    description: String,
    birth_date: String,
    email: { type: String, required: true },
  },
  integrantes: [
    {
      _id: String,
      name: String,
      nickcname: String,
      description: String,
      birth_date: String,
      email: String,
      wishes: [String],
      secret_friend: {
        _id: String,
        name: String,
        nickname: String,
        description: String,
        birth_date: String,
        email: String,
        wishes: [String],
      },
    },
  ],
});

GroupSchema.plugin(mongoosePaginate);

export default mongoose.model<IGroup>('Group', GroupSchema);
