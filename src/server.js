require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const serviceRoutes = require('./routes/serviceRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple root route
app.get('/', (req, res) => {
	res.send('Ateliê Laudir API - Express & MongoDB');
});

// Mount service routes
app.use('/services', serviceRoutes);

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/atelie_laudir';

function startServer() {
	app.listen(PORT, () => {
		console.log(`Server listening on http://localhost:${PORT}`);
	});
}

// Try to connect to MongoDB first, then start server. If connection fails, start server anyway but warn.
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log('Connected to MongoDB');
		startServer();
	})
	.catch(err => {
		console.warn('MongoDB connection warning:', err.message);
		console.warn('Starting server without DB connection. Fix MONGODB_URI or start MongoDB to enable DB features.');
		startServer();
	});