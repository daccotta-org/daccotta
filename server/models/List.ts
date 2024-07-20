import mongoose, { Schema, model, Document } from 'mongoose';

interface Lists {
  _id: Schema.Types.ObjectId;
  name: string;
  list_type:string ;
  movies:  Schema.Types.ObjectId[];
}

const listSchema = new Schema<Lists>({
  _id:{
    type: String,
    required: true,
    default: () => new mongoose.Types.ObjectId().toString()},
  name: { type: String, required: true },
  list_type: {
    enum:[
        "user",
        "group"
    ]
  },
  movies: [{ type: Schema.Types.ObjectId, ref: 'Movie' }],
});

const List = model<Lists>('List', listSchema);

export default List;