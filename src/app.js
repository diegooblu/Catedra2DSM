const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const bookRoutes = require('./routes/book.routes');
const loanRoutes = require('./routes/loan.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api', authRoutes);
app.use('/api', bookRoutes);
app.use('/api', loanRoutes);

module.exports = app;
