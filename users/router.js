//Router: focus on http req routing: session arrang design and management

import express from 'express';
import {signin,signin2, signup, logout} from './controller.js'
let router = express.Router();

/////page routes
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/signup', function(req, res, next) {
    res.render('signup');
  });

router.get('/signin', function(req, res, next) {
  res.render('signin');
});

/////api routes
router.post('/signin',signin2);

router.post('/signup',signup);

router.get("/logout", logout);

export default router;
