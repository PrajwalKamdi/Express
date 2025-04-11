// const express = require('express');  old way

import express from 'express'; //Modern way 
import { deleteRequest, fileUpload, jsonPostRequest, keywordSearchController, putRequestJson, rawPostRequest, testRoute, textPostRequest, urlEncoded, userWithJson, withMultipleParam } from './Controller.js'; //change depedency to type=module
import router from './route.js';


const server = express(); //creation of server
const PORT = 3000;

//Define Simple Route 
server.get('/', testRoute);

//HTTP methods
server.get('/about', testRoute)

server.get('/search', keywordSearchController)

//With seperate Routes
server.use('/user', router);

//Post Request Example
server.post('/users', express.json(), userWithJson)

//Put Request Example
server.put('/users/:id', express.json(), putRequestJson)

//Delete Request Example
server.delete('/user/:id', deleteRequest);

//Multiple parameters example
server.get('/user/:id/:name', withMultipleParam);

//Error Handling using middleware 
server.get('/error', () => {
  throw new Error('This is test error');
})
server.use((err, req, res, next) => {
  console.error(err.message);
  res.send('internal server error')
})


//Serving static files
server.use('/Data', express.static('Data')) //Uses we can open the files, images, etc globally

//Form Data in express
//For JSON data
server.post('/json', express.json(), jsonPostRequest) //using controller method reference

//For Text data   
server.post('/text', express.text(), textPostRequest)

//For Raw data  
server.post('/raw', express.raw(), rawPostRequest)

//For urlendoded data
server.post('/urlencoded', express.urlencoded({ extended: true }), urlEncoded)

//multer form data

import multer from 'multer';
import { storage } from './config/Storage.js';
import { Person } from './Models/Person.js';

//using storage object to store the file in uploads folder with unique name
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB
})

//For file uploads
server.post('/upload', upload.single('image'), fileUpload)

//Working database
// await connectDB();

//Saving Data to MongoDB
server.post('/add', express.json(), async (req, res) => {
  const { name, age, email } = req.body;
  const newPerson = new Person({
    name,
    age,
    email
  });
  await newPerson.save()
    .then(() => {
      console.log('Person added to database')
    })
    .catch((err) => {
      console.error(err.message)
    })
  console.log(newPerson)
  res.send('Person added');
})
//retrieving data from MongoDB
server.get('/getPerson', async (req, res) => {
  const persoData = await Person.find();
  res.send(persoData)
  console.log(persoData)
})
//put request example
server.put('/update/:id', express.json(), async (req, res) => {
  const { id } = req.params;
  const personData = await Person.findById(id)
  console.log(personData)
  res.send(personData)
  const data = req.body;
  const newData = new Person({
    name: data.name,
    age: data.age,
    email: data.email
  })
  newData.save()
    .then(() => {
      console.log('Person updated successfully')
    })
  console.log(newData)
})

//delete request example

server.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;
  console.log(id)
  await Person.findOneAndDelete(id)
    .then(() => {
      console.log('Person deleted successfully')
    });
  res.send('Person deleted successfully')
})

//Cookie Management 
import cookieParser from 'cookie-parser';
import session from 'express-session';
server.use(cookieParser());
server.get('/c', (req, res) => {
  res.cookie('name', 'Prajwal Cookie', { maxAge: 360000 });
  res.send("Api Called...")
})

server.get('/clear', (req, res) => {
  res.clearCookie('name');
  res.send("Cookie Cleared!")
})

//session management 
server.use(session({
  secret: "sample-secrete",
  resave: false,
  saveUninitialized: false
}))

server.get('/visit', (req, res) => {
  if (req.session.page_views) {
    req.session.page_views++;
    res.send(`you have visited this page ${req.session.page_views} times`)
  }
  else {
    req.session.page_views = 1;
    res.send('You have visited this page first time!')
  }
})

server.get('/remove-session', (req, res) => {
  req.session.destroy();
  res.send("Session has been Removed!")
})

//Authentication Session Based

server.use(express.json())
const userDb = []
server.post('/register', (req, res) => {
  const { username, password } = req.body;
  userDb.push({
    username,
    password
  })
  res.send("Registered Successfully!")
})

server.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = userDb.find((u) => u.username === username && u.password === password);
  if (!user) {
    return res.send('wrong credentials!')
  }
  else if (user) {
    req.session.user = user;
    return res.send('Login Successfully!')
  }
  else {
    return res.send('Login Failed!')
  }
})
//JWT Based Authentication
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const userDatabase = [] //for storing user data
server.post('/jwt', (req, res) => {
  const { username, password } = req.body;
  userDatabase.push({
    username,
    password: bcrypt.hashSync(password, 10) //hashing password using bcrypt
  });
  res.send("User Registered Successfully!");
})

server.post('/jwt-login', (req, res) => {
  const { username, password } = req.body;
  const user = userDatabase.find((u) => u.username === username && bcrypt.compare(password, u.password)); //comparing password with hashed password
  if (!user) {
    return res.send("Invalid Credentials!")
  }
  else {
    const token = jwt.sign({ username }, 'secret-key', { expiresIn: '1h' }); //creating token using jwt
    res.json({ token });
  }
})

server.get('/dashboard', (req, res) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.send("Token not provided!")
  }
  jwt.verify(token, 'secret-key', (err, decoded) => {
    if (err) {
      return res.send("Invalid Token!")
    }
    else {
      res.send(`Welcome to Dashboard ${decoded.username} !`)
    }
  })
})

const db = [];
server.post('/okay', (req, res) => {
  const { username, password } = req.body;
  db.push({
    username,
    password: bcrypt.hashSync(password, 10)
  })
  res.send('User Register successfully');
})

server.post('/okay-okay', (req, res) => {
  const { username, password } = req.body
  const user = db.find((u) => username === u.username && bcrypt.compare(password, u.password))
  if (!user) {
    return res.send('Wrong credentials');
  }
  else {
    const token = jwt.sign({ username }, 'secret-key', { expiresIn: '1h' })
    res.send({ token })
  }
})

server.get('/dash', (req, res) => {
  const token = req.headers['authorization']
  if (!token) {
    return res.send("Token not provided!\n Please Provide Valid Token")
  }
  jwt.verify(token, 'secret-key', (err, decoded) => {
    if (err) {
      return res.send(err);
    }
    else {
      return res.send(`welcome ${decoded.username}`)
    }
  })
})
//RestFull API

//Error Handling

server.get('/sych-err', (req, res, next) => {
  try {
    throw new Error('Something is wrong Sych err!')
  } catch (error) {
    next(error)
  }
})

server.get('/asych-err', async (req, res, next) => {
  try {
    await Promise.reject(new Error("Async Error Occured"))
  } catch (error) {
    next(error)
  }
})

server.use((err, req, res, next) => {
  console.log("middleWare : " + err.message)
  console.log(err.stack)
  res.status(500).json({ message: err.message })
})
//Server Listen
server.listen(PORT, () => {
  console.log(`Server is running on http/localhost/:${PORT}`)
});

