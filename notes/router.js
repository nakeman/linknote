////notes REST API | Router
////////////////////////////////
import express from 'express';
//import ensuerLogins from 'connect-ensure-login';
import noteCtrl from './controller.js'
let router = express.Router();

// /* GET note listing. */
// // router.get('/', ensuerLogins.ensureLoggedIn('/notes/signin'), function(req, res) {
//   router.get('/', function(req, res) {  
//   res.render('notes',{title : req.session.title});
// });

router.route('/')
  /** GET /api/notes - Get list of notes */
  .get(noteCtrl.list)

  /** POST /api/notes - Create new note */
  //.post(validate(paramValidation.createUser), noteCtrl.create);
  .post(noteCtrl.create);

router.route('/:id')
  /** GET /api/notes/:id - Get note */
  .get(noteCtrl.get)

  /** PUT /api/notes/:id - Update note */
  //.put(validate(paramValidation.updateUser), noteCtrl.update)
  .put(noteCtrl.update)

  /** DELETE /api/notes/:id - Delete note */
  .delete(noteCtrl.remove);

/** Load note when API with id route parameter is hit */
router.param('id', noteCtrl.load);

router.get('/s/:key',noteCtrl.search_regex);


export default router;