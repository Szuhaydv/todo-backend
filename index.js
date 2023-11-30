require('dotenv').config()
import express from 'express'
// import { corsAllowed} from './.env'
import mongoose from 'mongoose'
import { Todo } from './models/todo.js'
import cors from 'cors'

const app = express()

app.use(express.json())

app.use(cors())
// app.use(cors(corsAllowed))
// export const corsAllowed = {
//     origin: {
//       'http://localhost:5173',
//       'http://netlify.com' 
//     },
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowHeaders: ['Content-Type']
//   }

app.get('/', (req, res) => {
  return res.status(234).send('Welcome, welcome!')
})

app.post('/todos', async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).send({
        message: 'Give a name to the todo'
      })
    }
    const newTodo = {
      name: req.body.name,
      status: req.body.status
    }
    const todo = await Todo.create(newTodo)
    return res.status(201).send(todo)
  } catch (err) {
    console.log(err.message)
    res.status(500).send({ message: err.message })
  }
})

app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find({})
    return res.status(200).json({
      count: todos.length,
      data: todos
    })
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message})
  }
})

app.get('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params
    const todo = await Todo.findById(id)
    return res.status(200).json(todo)
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message })
  }
})

app.put('/todos/:id', async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).send({
        message: 'Give a name to the todo'
      })
    }
    const { id } = req.params
    const result = await Todo.findByIdAndUpdate(id, req.body)
    if (!result) {
      return res.status(404).send({message: 'Todo not found'})
    }
    return res.status(200).send({message: 'Todo updated successfully!'})
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message })
  }
})

app.delete('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params
    const result = await Todo.findByIdAndDelete(id)
    if (!result) {
      return res.status(404).send({ message: 'Todo not found'})
    }
    return res.status(200).send({ message: 'Todo deleted succesfully!' })
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message })
  }
})

mongoose
  .connect(process.env.mongoDBURL)
  .then(() => {
    console.log('App connected to database');
    app.listen(PORT, () => {
      console.log(`App is listening on port: ${process.env.PORT}`)
    })
  })
  .catch((err) => {
    console.log(err);
  })