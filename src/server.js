require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');

const serviceRoutes = require('./routes/serviceRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// cookie parser for refresh token cookie handling
app.use(cookieParser());

// Simple root route
// Serve static view files
app.use(express.static(path.join(__dirname, 'View')));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'View', 'index.html'));
});

// Mount service routes
// Mount auth routes
app.use('/auth', authRoutes);

// Mount service routes
app.use('/services', serviceRoutes);

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/atelie_laudir';

function startServer() {
	app.listen(PORT, () => {
		console.log(`Server listening on http://localhost:${PORT}`);
	});
}
// Try to connect and start only when run directly. This allows tests to import `app` without
// automatically attempting to connect to a real MongoDB instance.
if (require.main === module) {
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
}

module.exports = app;