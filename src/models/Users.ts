import mongoose, { Schema, Document } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

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

export interface IUserFriends {
  _id: string;
  name: string;
  nickname: string;
  description: string;
  birth_date: string;
  email: string;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    last_name: String,
    email: { type: String, required: true, index: true, unique: true },
    birth_date: Date,
    nickname: { type: String, required: true, index: true, unique: true },
    password: { type: String, required: true },
    description: String,
    created_at: Date,
    updated_at: Date,
    friends: [
      {
        _id: String,
        name: String,
        nickname: String,
        description: String,
        birth_date: Date,
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
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

UserSchema.plugin(mongoosePaginate);

export default mongoose.model<IUser>('User', UserSchema);
