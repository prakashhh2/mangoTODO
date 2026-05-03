import { Router } from 'express'
import Todo from '../models/Todo.js'

const router = Router()

router.get('/', async (req, res) => {
  const todos = await Todo.find().sort({ createdAt: -1 })
  res.json(todos)
})

router.post('/', async (req, res) => {
  const todo = await Todo.create({ todo: req.body.todo, description: req.body.description })
  res.status(201).json(todo)
})

router.put('/:id', async (req, res) => {
  const todo = await Todo.findByIdAndUpdate(
    req.params.id,
    { todo: req.body.todo, description: req.body.description, completed: req.body.completed },
    { new: true }
  )
  res.json(todo)
})

router.delete('/:id', async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id)
  res.json({ message: 'Deleted' })
})

export default router
