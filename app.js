import dotenv from "dotenv"
import express from 'express'
import session from 'express-session'
// import { corsAllowed} from './.env'
import mongoose from 'mongoose'
import passport from 'passport'
import crypto from 'crypto'
import cors from 'cors'
import MongoDBStore from 'connect-mongodb-session'
import * as passwordUtils from './lib/passwordUtils.js'
const genPassword = passwordUtils.genPassword
// const User = mongoose.connection.models.User;
import isAuth from './routes/authMiddleware.js'
import { User, Todo } from './models/user.js'

dotenv.config()
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
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

const MongoStore = MongoDBStore(session)

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
      uri: process.env.DB_STRING,
      collection: 'sessions'
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));

import './config/passport.js'

app.use(passport.initialize());
app.use(passport.session());

app.post('/login', cors(), passport.authenticate('local', {failureMessage: "Login unsuccessful!"}), (req, res) => {
    return res.status(200).send({message: "Successful login!"})
  } 
)

app.post('/register', async (req, res, next) => {
  try {
    const existingUser = await User.find({username: req.body.username})
    if (existingUser.length != 0) {
      return res.status(400).send({message: "User already exists"})
    }
    const saltHash = genPassword(req.body.password);
  
    const salt = saltHash.salt;
    const hash = saltHash.hash;

    const newUser = new User({
        username: req.body.username,
        hash: hash,
        salt: salt
    });

    newUser.save()
        .then((user) => {
            console.log(user);
        });
    return res.status(200).send("Successful registration!");
  } catch (error) {
    res.status(500).send({ message: err.message})
  }
});

app.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) {return next(err)}
    res.status(200).send({message: "Successful logout"})
  })  
})

app.post('/todos', isAuth, async (req, res) => {
  try {
    if (!req.body.name || !req.user) {
      return res.status(400).send({
        message: 'Give a name to the todo'
      })
    }
    const newTodo = {
      name: req.body.name,
      status: req.body.status,
      author: req.user.username
    }
    const todo = await Todo.create(newTodo)
    return res.status(201).send(todo)
  } catch (err) {
    console.log(err.message)
    res.status(500).send({ message: err.message })
  }
})

app.get('/todos', isAuth, async (req, res) => {
  try {
    const todos = await Todo.find({ author: req.user.username})
    return res.status(200).json({
      count: todos.length,
      data: todos
    })
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message})
  }
})

app.get('/todos/:id', isAuth, async (req, res) => {
  try {
    const { id } = req.params
    const todo = await Todo.findById(id)
    return res.status(200).json(todo)
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ message: err.message })
  }
})

app.put('/todos/:id', isAuth, async (req, res) => {
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

app.delete('/todos/:id', isAuth, async (req, res) => {
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

mongoose.connect(process.env.DB_STRING)
    .then(() => {
        console.log('App connected to database');
        app.listen(process.env.PORT, () => {
        console.log(`App is listening on port: ${process.env.PORT}`)
        })
    })
    .catch((err) => {
        console.log(err);
    })