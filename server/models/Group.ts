import mongoose, { Schema, model, Document } from 'mongoose';

interface Groups {
  group_id: Schema.Types.ObjectId;
  name: string;
  members: Schema.Types.ObjectId[];
  lists: Schema.Types.ObjectId[];
  group_image: string;
  stats: Schema.Types.ObjectId[];
}

const groupSchema = new Schema<Groups>({
  group_id: {  type: String,
    required: true,
    default: () => new mongoose.Types.ObjectId().toString() },
  name: { type: String, required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  lists: [{ type: Schema.Types.ObjectId, ref: 'List' }],
  group_image: { type: String },
  stats: [{ type: Schema.Types.ObjectId, ref: 'Stat' }]
});

const Group = model<Groups>('Group', groupSchema);

export default Group;