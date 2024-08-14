import mongoose, { Schema, model, Document } from 'mongoose';

interface List extends Document {
  list_id: string;
  name: string;
  list_type: 'user' | 'group';
  movies: string[];
  members: {
    user_id: string;
    is_author: boolean;
  }[];
  date_created: Date;
}

const listSchema = new Schema<List>({
  list_id: { type: String, required: true, unique: true, default: () => new mongoose.Types.ObjectId().toString() },
  name: { type: String, required: true },
  list_type: {
    type: String,
    enum: ['user', 'group'],
    required: true,
  },
  movies: [{ type: String, required: true }],
  members: [{
    user_id: { type: String, required: true },
    is_author: { type: Boolean, required: true },
  }],
  date_created: { type: Date, default: Date.now },
});

const List = model<List>('List', listSchema);

export default List;