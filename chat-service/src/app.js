const express = require('express');
const bodyParser = require('body-parser');
const chatRoutes = require('./routes/chatRoutes');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
connectDB();

app.use(bodyParser.json());
app.use('/chat', chatRoutes);

module.exports = app;
