const express = require('express');

const morgan = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors')

const app = express();
const api = require('./api/api');

//security middlewares
app.use(morgan('tiny'));
app.use(compression());
app.use(helmet()); 
app.use(express.json());
app.use(cors());

//referral header? or sth
//add JWT auth

app.use('/api', api);

module.exports = app;