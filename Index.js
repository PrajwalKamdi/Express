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
import { connectDB } from './config/db.js';
import { Person } from './Models/Person.js';

//using storage object to store the file in uploads folder with unique name
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB
})

//For file uploads
server.post('/upload', upload.single('image'), fileUpload)

//Working database
await connectDB();

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

//Server Listen
server.listen(PORT, () => {
  console.log(`Server is running on http/localhost/:${PORT}`)
});

