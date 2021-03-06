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
 */
NoteCtrl.list = function list(req, res, next) {
    const { limit = 50, skip = 0,user = req.user.id } = req.query;
    Note.list({ limit, skip, user})
      .then(notes => res.json(notes))
      .catch(e => next(e));
  }

NoteCtrl.search_fulltext = function search_fulltext(req, res){
  let key = req.params.key;
  //res.send(key);

  Note.find({
    $text: { $search: key },
    user: req.user.id
  })
    .then(notes => console.log(notes.length))
    .catch(e => console.error(e));
}

// TODO: where user == req.user.id
NoteCtrl.search_regex = function search_regex(req, res){
  let key = req.params.key;
  //res.send(key);

  Note.find({
    $or:[
      {"content":{ $regex: key, $options: 'i' }},
      {"title":{ $regex: key, $options: 'i' }}
      ],
    user: req.user.id
    }
)
    .then(notes => res.json(notes))
    .catch(e => console.error(e));
}

NoteCtrl.getBytag = function (req, res){
  let tag = req.params.tag;
  //console.log(tag);

  Note.find({"tags.id": tag ,user: req.user.id})
    .then(notes => res.json(notes))
    .catch(e => console.error(e));
}

/**
 * Create new note
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
 */
NoteCtrl.update = function update(req, res, next) {
  const note = req.note;
  note.title = req.body.title;
  note.content = req.body.content;
  note.createdAt = req.body.createdAt;
  note.tags = req.body.tags;

  note.save()
    .then(result => res.json(result))
    .catch(err => res.json({result:err.message}));

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