import mongoose, { Schema, Document } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

export interface IUser extends Document {
  name: string;
  last_name: string;
  email: string;
  birth_date: Date;
  nickname: string;
  password: string;
  description: string;
  friends: [
    {
      _id: string;
      name: string;
      nickname: string;
      description: string;
      birth_date: string;
      email: string;
    },
  ];
  groups: [
    {
      id: string;
      name: string;
      status: string;
    },
  ];
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  last_name: String,
  email: { type: String, required: true, index: true, unique: true },
  birth_date: Date,
  nickname: { type: String, required: true, index: true, unique: true },
  password: { type: String, required: true },
  description: String,
  friends: [
    {
      _id: String,
      name: String,
      nickname: String,
      description: String,
      birth_date: String,
      email: String,
    },
  ],
  groups: [
    {
      _id: String,
      name: String,
      status: String,
    },
  ],
});

UserSchema.plugin(mongoosePaginate);

export default mongoose.model<IUser>('User', UserSchema);
