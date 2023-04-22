'use strict';
const express = require('express');
require("./db/connection");
var cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
    origin: true,
    credentials: true,
}))

var api = require('./routes/api');
app.use('/', api);


app.listen(port, function () {
    console.log('localhost:' + port);
});