// const Promise = require('bluebird');
// const mongoose = require('mongoose');
// const httpStatus = require('http-status');
// const APIError = require('../helpers/APIError');
import mongoose from 'mongoose';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
dayjs.extend(duration)

mongoose.set('toJSON', { virtuals: true });

/**
 * note Schema
 */
const NoteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    required: true, 
    ref:'User',
    index:{name:'usernote'} // 用户自己的笔记必须名字唯一
  },
  title: {
    type: String,
    required: true, 
    maxlength:100,   // note title no more 100 words
    index:{name:'usernote'}
  },
  important:{
    type: Number,
    default: 0
  },
  running:{ 
    type: Boolean,
    default: false
  },
  categroy:{ type:String, maxlength:50},
  tags:{ 
    type:[
      {
        id:{
          type:mongoose.Schema.ObjectId,
          ref:'tags'
        },
      
      name:String}
    ]
  },
  linkTo:{ 
    type:[{id:mongoose.Schema.ObjectId,title:String}]
  },
  content:{ 
    type:String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

NoteSchema.index({
  title: 'text',
  content: 'text'
}, {
  weights: {
    title: 5,
    content: 1
  }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

NoteSchema.virtual('desc').get(function() {
  return this.content.substring(0,30);
});

NoteSchema.virtual('time').get(function() {
  return dayjs(this.createdAt).format('YYYY-MM-DD HH:mm')
});

NoteSchema.virtual('day').get(function() {
  let x = dayjs(Date.now());
  let y = dayjs(this.createdAt);

  let  duration = dayjs.duration(x.diff(y))
  return duration;
});

/**
 * Methods
 */
NoteSchema.method({
});

/**
 * Statics
 */
NoteSchema.statics = {
  /**
   * Get note
   * @param {ObjectId} id - The objectId of note.
   * @returns {Promise<note, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((note) => {
        if (note) {
          return note;
        }
        //const err = new APIError('No such note exists!', httpStatus.NOT_FOUND);
        const err = new Error('No such note exists');
        return Promise.reject(err);
      });
  },

  /**
   * List notes in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of notes to be skipped.
   * @param {number} limit - Limit number of notes to be returned.
   * @returns {Promise<Note[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};

/**
 * @typedef Note
 */
export default mongoose.model('Note', NoteSchema);
