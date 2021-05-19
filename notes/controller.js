import Note from './model.js';
import xssFilters from 'xss-filters'

const NoteCtrl = {};
/**
 * Load note and append to req.
 */
NoteCtrl.load =function(req, res, next, id){
  Note.get(id)
    .then((note) => {
      note.content = xssFilters.inHTMLData(note.content);
      req.note = note; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));

};

/**
 * Get note
 * @returns {Note}
 */
NoteCtrl.get = function (req, res) {
  return res.json(req.note);
};

/**
 * Get note list.
 * @property {number} req.query.skip - Number of notes to be skipped.
 * @property {number} req.query.limit - Limit number of notes to be returned.
 * @returns {Note[]}
 */
NoteCtrl.list = function list(req, res, next) {
    const { limit = 50, skip = 0 } = req.query;
    Note.list({ limit, skip })
      .then(notes => res.json(notes))
      .catch(e => next(e));
  }

/**
 * Create new note
 * @property {string} req.body.notename - The notename of note.
 * @property {string} req.body.mobileNumber - The mobileNumber of note.
 * @returns {Note}
 */
NoteCtrl.create = function create(req, res, next) {
  //if (!req.user) res.send('not login!!');
  const note = new Note({
    user: 23232,//req.user.id,
    title: req.body.title,
    content: req.body.content
  });

  note.save()
    .then(
      savedNote => res.json(savedNote)
      )
    .catch(e => next(e));
}

/**
 * Update existing note
 * @property {string} req.body.notename - The notename of note.
 * @property {string} req.body.mobileNumber - The mobileNumber of note.
 * @returns {Note}
 */
NoteCtrl.update = function update(req, res, next) {
  const note = req.note;
  note.title = req.body.title;
  note.content = req.body.content;

  note.save()
    .then(savedNote => res.json(savedNote))
    .catch(e => next(e));

}



/**
 * Delete note.
 * @returns {Note}
 */
NoteCtrl.remove = function remove(req, res, next) {
  const note = req.note;
  note.remove()
    .then(deletedNote => res.json(deletedNote))
    .catch(e => next(e));
}

export default NoteCtrl;