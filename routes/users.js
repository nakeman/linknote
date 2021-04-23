//Router: focus on http req routing: session arrang design and management

import express from 'express';
import {signin} from '../controllers/users.js'
let router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/signin', function(req, res, next) {
  res.render('signin');
});


router.post('/signin',signin );

export default router;
