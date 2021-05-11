import express from 'express';
import ensuerLogins from 'connect-ensure-login';
let router = express.Router();

/* GET note listing. */
// router.get('/', ensuerLogins.ensureLoggedIn('/users/signin'), function(req, res) {
  router.get('/', function(req, res) {  
  res.render('notes',{title : req.session.title});
});

export default router;