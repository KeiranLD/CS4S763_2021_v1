const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser')
const reviewsRoutes = require('./api/routes/reviews');
const gameRoutes = require('./api/routes/games');
const userRoutes = require('./api/routes/users')
const mongoose = require('mongoose');

require("dotenv").config();
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// Cors
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

// Routes
app.use('/reviews', reviewsRoutes);
app.use('/games', gameRoutes);
app.use('/user', userRoutes);

mongoose.connect('mongodb+srv://15062317:' + process.env.MONGO_ATLAS_PW + '@cluster0.ngs87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');


app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;