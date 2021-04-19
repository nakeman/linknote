import express from 'express';
let router = express.Router();

/* GET note listing. */
router.get('/', function(req, res) {
  res.render('notes',{title : req.session.title});
});

export default router;