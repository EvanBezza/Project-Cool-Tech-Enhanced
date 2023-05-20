const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cors = require('cors');
const userController = require('./controllers/UserController'); // add this line
dotenv.config();

const app = express();

// Database connection
const mongoDBUrl = `mongodb+srv://evanfbez:${process.env.DB_KEY}@cluster01.e4tkqkp.mongodb.net/Cool-Tech`;
mongoose.connect(mongoDBUrl, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('Database connected successfully'))
    .catch(err => console.log(err));

// Middleware
app.use(cors());
app.use(bodyParser.json());

// User model import - new line
const User = require('./models/User'); // update this line

// Login Endpoint
app.post('/login', userController.login); // update this line

// Registration Endpoint
app.post('/register', userController.register); // update this line

// OU Endpoint
app.post('/addOU', verifyToken, userController.addOU);

// Division Endpoint
app.post('/addDivision', verifyToken, userController.addDivision);

app.post('/assignUserToOU', verifyToken, userController.assignUserToOU);

app.post('/assignUserToDivision', verifyToken, userController.assignUserToDivision);

app.post('/assignDivisionToOU', verifyToken, userController.assignDivisionToOU);

app.get('/getOU/:ouId', verifyToken, userController.getOU);


// Middleware to verify token
function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ error: 'No token provided' });
    }
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to authenticate token' });
        }
        req.user = decoded;
        next();
    });
}

// Current User Endpoint
app.get('/me', verifyToken, userController.getCurrentUser); // update this line

app.listen(3000, () => console.log('Server started on port 3000'));
