const express = require('express');
const authRoutes = require('./routes/authRoutes');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
connectDB();

app.use(express.json());
app.use('/auth', authRoutes);

module.exports = app;
