const express = require('express');

const morgan = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const jwt = require('./jwt');

const app = express();
const api = require('./api/api');

//security middlewares
app.use(morgan('tiny'));
app.use(compression());
app.use(helmet()); 
app.use(express.json());
app.use(cors());


//add a referral header? or sth
app.use(jwt.authenticateJWT);
app.use('/api', api);


app.use(jwt.errorHandler);
app.use(jwt.notFound);

module.exports = app;