const dotenv = require('dotenv');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors')

// import dotenv from 'dotenv';
// import express from 'express';
// import connectDb from './DBconn/conn.js'

// connectDb();
dotenv.config();


const PORT = process.env.PORT || 4000;

app.use(cors({
    origin: 'http://localhost:3000', //your react url ok!!
    credentials: true
}))

app.use(cookieParser());
app.use(express.json());

// connection establishment
require('./DBconn/conn')


const GymRoutes = require('./Routes/gym');
const MembershipRoute = require('./Routes/membership');
const MemberRoutes = require('./Routes/member');

app.use('/auth', GymRoutes)
app.use('/plans', MembershipRoute)
app.use('/members', MemberRoutes)

app.get('/', (req, res) => {
    res.send({ "message": "Your connection is successful in Port " + PORT });
});

app.listen(PORT, () => {
    console.log("Connection established on Port:", PORT);
});
