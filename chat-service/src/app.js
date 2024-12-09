// src/app.js
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const chatRoutes = require('./routes/chatRoutes');

const app = express();
connectDB();

app.use(express.json());
app.use('/chat', chatRoutes);

module.exports = app;
