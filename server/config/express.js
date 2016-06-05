'use strict';

// EXPRESS //
const express    = require('express');
const session    = require('express-session');
const bodyParser = require('body-parser');
const cors       = require('cors');

module.exports = () => {
  const app = express();

  app.use(cors());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(session({
    secret: '42tjdghdfghfsd32t343tg34t30934hahaha',
    resave: false,
    saveUninitialized: true
  }));
  app.use(express.static('build'));
  return app;
};