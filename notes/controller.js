import Note from './model.js';
import xssFilters from 'xss-filters'
import dayjs from 'dayjs';

const NoteCtrl = {};
/**
 * Load note and append to req.
 */
NoteCtrl.load =function(req, res, next, id){
  Note.get(id)
    .then((note) => {
      //TODO: simditor 似乎自动作了xss处理 
      //note.content = xssFilters.inHTMLData(note.content);
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

NoteCtrl.search_fulltext = function search(req, res){
  let key = req.params.key;
  //res.send(key);

  Note.find({
    $text: { $search: key },
  })
    .then(notes => console.log(notes.length))
    .catch(e => console.error(e));
}

// TODO: where user == req.user.id
NoteCtrl.search_regex = function search(req, res){
  let key = req.params.key;
  //res.send(key);

  Note.find({
    $or:[
      {"content":{ $regex: key, $options: 'i' }},
      {"title":{ $regex: key, $options: 'i' }}
      ]
    }
)
    .then(notes => res.json(notes))
    .catch(e => console.error(e));
}

/**
 * Create new note
 * @property {string} req.body.notename - The notename of note.
 * @property {string} req.body.mobileNumber - The mobileNumber of note.
 * @returns {Note}
 */
NoteCtrl.create = function create(req, res, next) {
  if (!req.user) {return res.send('not login!!');}
  const note = new Note({
    user: req.user.id,
    title: dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
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
  note.createdAt = req.body.createdAt;

  note.save()
    .then(result => res.json(result))
    .catch(err => res.json({result:err.message}));
    // .then(savedNote => res.json(savedNote))
    // .catch(e => next(e));

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