import mongoose, { Schema, Document } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import IGroupBase, { Status } from '@modules/groups/entities/IGroup';

interface IGroup extends Document, IGroupBase {}

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
