import mongoose, { Schema, model, Document } from 'mongoose';

interface Users  {
  _id: Schema.Types.ObjectId;
  userName: string;
  age: number;
  email:string;
  groups: Schema.Types.ObjectId[];
  badges: Schema.Types.ObjectId[];
  lists: Schema.Types.ObjectId[];
  actor: Schema.Types.ObjectId[];
  directors: Schema.Types.ObjectId[];
  profile_image: string;
}

const userSchema = new Schema<Users>({
    _id: {
        type: String,
        required: true,
        default: () => new mongoose.Types.ObjectId().toString()},
  userName: { type: String, required: true, unique: true},
  email:{type:String,required: true},
  age: { type: Number, required: true },
  groups: [{ type: Schema.Types.ObjectId, ref: 'Group' }],
  badges: [{ type: Schema.Types.ObjectId, ref: 'Badge' }],
  lists: [{ type: Schema.Types.ObjectId, ref: 'List' }],
  actor: [{ type: Schema.Types.ObjectId, ref: 'People' }],
  directors: [{ type: Schema.Types.ObjectId, ref: 'People' }],
  profile_image: { type: String }
});

const User = model<Users>('User', userSchema);

export default User;