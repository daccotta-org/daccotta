import mongoose, { Schema, model, Document } from 'mongoose';
import Person from './Person';

interface MovieInList {
  movie_id: string;
}

interface List {
  list_id: string;
  name: string;
  list_type: 'user' | 'group';
  movies: MovieInList[];
  members: {
    user_id: string;
    is_author: boolean;
  }[];
  date_created: Date;
}

interface Users extends Document {
  _id: string;
  userName: string;
  age: number;
  email: string;
  groups: Schema.Types.ObjectId[];
  badges: Schema.Types.ObjectId[];
  lists: List[];
  actor: Schema.Types.ObjectId[];
  directors: Person[];
  profile_image: string;
  onboarded: boolean;
  friends: string[];
}

const movieInListSchema = new Schema<MovieInList>({
  movie_id: { type: String, required: true }
});

const listSchema = new Schema<List>({
  list_id: { type: String, required: true ,unique: true, default: () => new mongoose.Types.ObjectId().toString() },
  name: { type: String, required: true },
  list_type: {
    type: String,
    enum: ['user', 'group'],
    required: true,
  },
  movies: [movieInListSchema],
  members: [{
    user_id: { type: String, required: true },
    is_author: { type: Boolean, required: true },
  }],
  date_created: { type: Date, default: Date.now },
});

const userSchema = new Schema<Users>({
  _id: {
    type: String,
    required: true,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  userName: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  age: { type: Number, required: true },
  groups: [{ type: Schema.Types.ObjectId, ref: 'Group' }],
  badges: [{ type: Schema.Types.ObjectId, ref: 'Badge' }],
  lists: [listSchema],
  actor: [{ type: Schema.Types.ObjectId, ref: 'Person' }],
  directors: [Person.schema],
  profile_image: { type: String },
  onboarded: { type: Boolean, default: false },
  friends: [String]
});

const User = model<Users>('User', userSchema);

export default User;