import mongoose, { Document, Schema } from 'mongoose';

export interface ITodoList extends Document {
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

const TodoListSchema: Schema = new Schema({
  title: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<ITodoList>('TodoList', TodoListSchema);
