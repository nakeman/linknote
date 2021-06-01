import express from 'express';
import ensuerLogins from 'connect-ensure-login';
import Note from '../notes/model.js';
import e from 'express';
let router = express.Router();

/* GET note listing. */
// router.get('/', ensuerLogins.ensureLoggedIn('/users/signin'), function(req, res) {
  router.get('/', ensuerLogins.ensureLoggedIn('/users/signin'),function(req, res) { 
    let notes;
    // Note.list()
    // .then(notes => {
    //   res.render('notes',{title : req.session.title,notes: notes});
    // })
    // .catch(e => res.send(e));
    //res.json({ user: 'tobi' });
    //res.json(notes);


    res.render('notes',{title : req.session.title});
});

export default router;