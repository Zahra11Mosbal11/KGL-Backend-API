const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

// Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

// Routes
const procurementRoutes = require('./routes/procurementRoutes');
const salesRoutes = require('./routes/salesRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'kgl-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }
}));

// MongoDB Connection
mongoose.connect(process.env.DATABASE_URI)
.then(() => console.log(' Connected to MongoDB'))
.catch(err => console.log(' MongoDB connection error:', err));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Routes
app.use('/procurement', procurementRoutes);
app.use('/sales', salesRoutes);
app.use('/users', userRoutes);

// Home route
app.get('/', (req, res) => {
  res.json({
    message: 'Karibu Groceries LTD API',
    version: '1.0.0',
    documentation: '/api-docs',
    endpoints: {
      procurement: '/procurement',
      sales: '/sales',
      users: '/users'
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT ;
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
});