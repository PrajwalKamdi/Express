// const express = require('express');  old way
import express from 'express' //Modern way 
import { keywordSearchController, usernameController } from './Controller.js'; //change depedency to type=module
import router from './route.js';


const server = express(); //creation of server
const PORT = 3000;

//Define Simple Route with traditional way
server.get('/', (req, res) => {
  res.send('Hello Express Hope You are doing well have good day');
});

server.get('/about', (req, res)=>{
  res.send('This a about Route')
})

//With Controller Method Referrence
// server.get('/user/:username', usernameController)

server.get('/search', keywordSearchController)

//With seperate Routes
server.use('/user',router);

//Server Listen
server.listen(PORT, () => {
  console.log(`Server is running on http/localhost/:${PORT}`)
})