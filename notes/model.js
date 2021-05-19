// const Promise = require('bluebird');
// const mongoose = require('mongoose');
// const httpStatus = require('http-status');
// const APIError = require('../helpers/APIError');
import mongoose from 'mongoose';

/**
 * note Schema
 */
const NodeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    required: true, 
    ref:'User'
  },
  title: {
    type: String,
    required: true, 
    maxlength:100   // note title no more 100 words
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
    type:[{id:mongoose.Schema.ObjectId, name:String}]
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

NodeSchema.index({
  title: 'text',
  content: 'text',
}, {
  weights: {
    title: 5,
    content: 1,
  },
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
NodeSchema.method({
});

/**
 * Statics
 */
NodeSchema.statics = {
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
   * @returns {Promise<User[]>}
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
export default mongoose.model('Note', NodeSchema);
