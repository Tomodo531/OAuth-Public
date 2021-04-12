/* ----------------------------- Server Setup Start ----------------------------- */

const express = require('express');
const app = express();
require('dotenv').config();
const passport = require('passport');
const cookieSession = require('cookie-session');
const path = require('path');
// OAuth Authencation setup
const passportSetup = require('./config/passport.js');

app.use(express.json());

const cors = require('cors');
app.use(
	cors({
		origin: 'http://localhost:3000' || 'https://oauth-project.herokuapp.com',
		credentials: true
	})
);

// set up session cookies
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.cookieKey]
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
const authRouter = require('./routes/auth')
app.use('/auth', authRouter)

// Mongoose setup
const mongoose = require('mongoose');

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUniFiedTopology: true });

const connection = mongoose.connection;

connection.once('open', () => {
	console.log('MongoDB database connetion established successfully');
});

if (process.env.NODE_ENV === 'production') {
	console.log('Running production')
	app.use(express.static('client/oauth/build'));

	app.get('*', (req, res) => {
		res.sendFile(path.join(__dirname, 'client', 'oauth', 'build', 'index.html'));
	});
}

const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`System express server running on port: ${port}`);
});

