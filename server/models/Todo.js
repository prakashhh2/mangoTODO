import mongoose from 'mongoose'

const todoSchema = new mongoose.Schema({
  todo: { type: String, required: true },
  completed: { type: Boolean, default: false }
}, { timestamps: true })

export default mongoose.model('Todo', todoSchema)
