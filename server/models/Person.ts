import mongoose, { Schema, model, Document } from 'mongoose';

interface Person  {
    id: number;
    name: string;
    profile_path: string | null;
    known_for_department: 'Acting' | 'Directing';
}
export const personSchema = new Schema<Person>({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    profile_path: { type: String, default: null },
    known_for_department: { type: String, enum: ['Acting', 'Directing'], required: true },
   
  }, { timestamps: true });

  const Person = model<Person>('Person', personSchema);                     

  export default Person;