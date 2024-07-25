import mongoose, { Schema, model, Document } from 'mongoose';

interface Lists {
  name: string;
  list_type:string ;
  movies:  Schema.Types.ObjectId[];
}

const listSchema = new Schema<Lists>({

  name: { type: String, required: true },
  list_type: {
    type: String,
    enum:[
        "user",
        "group"
    ]
  },
  movies: [{ type: Schema.Types.ObjectId, ref: 'Movie' }],
});

const List = model<Lists>('List', listSchema);

export default List;