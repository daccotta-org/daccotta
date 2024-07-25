import mongoose, { Schema, model, Document } from 'mongoose';

interface Groups {
  name: string;
  members: Schema.Types.ObjectId[];
  lists: Schema.Types.ObjectId[];
  group_icon: string;
  stats: Schema.Types.ObjectId[];
}

const groupSchema = new Schema<Groups>({

  name: { type: String, required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  lists: [{ type: Schema.Types.ObjectId, ref: 'List' }],
  group_icon: { type: String },
  stats: [{ type: Schema.Types.ObjectId, ref: 'Stat' }]
});

const Group = model<Groups>('Group', groupSchema);

export default Group;