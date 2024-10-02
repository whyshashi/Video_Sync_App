const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const connectDB = async () => {
  try {
    // Connect to the MongoDB database using the URI from the environment variables
    await mongoose.connect(process.env.MONGO_URI); 
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Initialize the database connection
connectDB();

const app = require('express')();
const PORT = process.env.PORT || 5000;

// const express = require('express');
const cors = require('cors');

// const app = express();

// Enable CORS for all routes
app.use(cors());

// Your other middleware and routes here


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
