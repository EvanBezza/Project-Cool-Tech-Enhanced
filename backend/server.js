// Student Name: Evan Bezuidenhout
// Student Number: EB22010002711
// Level: 4
// Task: 35
// Compulsory Task: 1
// File Name: server.js

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
const mongoDBUrl = `${process.env.MONGODB_URI}`;
mongoose.connect(mongoDBUrl, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('Database connected successfully'))
    .catch(err => console.log(err));

// Middleware
app.use(cors());
app.use(bodyParser.json());

// OU Related Endpoints:
app.post('/addOU', verifyToken, userController.addOU);
app.post('/removeUserFromOU', verifyToken, userController.removeUserFromOU);
app.post('/assignUserToOU', verifyToken, userController.assignUserToOU);
app.get('/getOUs', verifyToken, userController.getOUs);

// Division Related Endpoints:
app.post('/addDivision', verifyToken, userController.addDivision);
app.post('/assignUserToDivision', verifyToken, userController.assignUserToDivision);
app.post('/removeUserFromDivision', verifyToken, userController.removeUserFromDivision);
app.get('/getDivisions', verifyToken, userController.getDivisions);

// Credential Rleated Endpoints:
app.get('/getCredentials/:divisionId', verifyToken, userController.getCredentialsForDivision);
app.post('/addCredential/:divisionId', verifyToken, userController.addCredentialToDivision);
app.patch('/updateCredential/:credentialId', verifyToken, userController.updateCredential);
app.get('/getCredentials', verifyToken, userController.getCredentials);

// User Related Endpoints:
app.post('/login', userController.login); // update this line
app.post('/register', userController.register); // update this line
app.patch('/changeUserRole/:userId', verifyToken, userController.changeUserRole);
app.get('/getUsers', verifyToken, userController.getUsers);

// Middleware to verify JWT token
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

app.listen(8080, () => console.log('Server started on port 8080'));
