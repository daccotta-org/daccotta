import { Schema, model, Document } from 'mongoose';

interface Stats extends Document {
  id: string;
  role: { user: Schema.Types.ObjectId, group: Schema.Types.ObjectId };
}

const statSchema = new Schema<Stats>({
  id: { type: String, required: true, unique: true },
  role: {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    group: { type: Schema.Types.ObjectId, ref: 'Group' }
  }
});

const Stat = model<Stats>('Stat', statSchema);

export default Stat;