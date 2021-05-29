import createError from 'http-errors';
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import session from 'express-session';
import logger from 'morgan';
import flash from "connect-flash";

import './database.js'; // 何时何处创建：异步链接，似乎程序初始化时链接，和使用前链接无区别
import {init_passport,init_session} from "./UserAuthentication.js"

import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import notesRouter from './routes/notes.js';
import notesAPIRouter from './notes/router.js';
import tagsAPIRouter from './tags/router.js';

import { dirname, filename } from 'dirname-filename-esm';

const __dirname = dirname(import.meta);
const __filename = filename(import.meta);

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }))

app.use(session({
  secret: 'secret',
  resave: true,
  saveUnintialzed: true,
}))

app.use(init_passport);
app.use(init_session);

app.use(flash());

// Global Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  res.success_msg
  next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/notes', notesRouter);
app.use('/api/notes',notesAPIRouter);
app.use('/api/tags',tagsAPIRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
