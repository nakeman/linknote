import express from 'express';
let router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  req.session.title = 'this is linknote';
  res.render('index', { title: 'Express' });
});

export default router;
