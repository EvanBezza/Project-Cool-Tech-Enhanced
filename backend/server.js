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

app.post('/removeUserFromOU', verifyToken, userController.removeUserFromOU);

app.get('/getOUs', verifyToken, userController.getOUs);

// Division Endpoint
app.post('/addDivision', verifyToken, userController.addDivision);

app.post('/assignUserToOU', verifyToken, userController.assignUserToOU);

app.post('/assignUserToDivision', verifyToken, userController.assignUserToDivision);

app.post('/removeUserFromDivision', verifyToken, userController.removeUserFromDivision);

app.get('/getDivisions', verifyToken, userController.getDivisions);

app.post('/assignDivisionToOU', verifyToken, userController.assignDivisionToOU);

app.get('/getOU/:ouId', verifyToken, userController.getOU);

app.get('/getCredentials/:divisionId', verifyToken, userController.getCredentialsForDivision);

app.post('/addCredential/:divisionId', verifyToken, userController.addCredentialToDivision);

app.patch('/updateCredential/:credentialId', verifyToken, userController.updateCredential);

app.get('/getDivisions', verifyToken, userController.getDivisions);

app.get('/getCredentials', verifyToken, userController.getCredentials);

app.patch('/changeUserRole/:userId', verifyToken, userController.changeUserRole);

app.get('/getUsers', verifyToken, userController.getUsers);

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

app.listen(8080, () => console.log('Server started on port 8080'));
