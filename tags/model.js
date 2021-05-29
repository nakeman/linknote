import mongoose from 'mongoose';
//import dayjs from 'dayjs';
// import duration from 'dayjs/plugin/duration.js';
// dayjs.extend(duration)

mongoose.set('toJSON', { virtuals: true });

/**
 * tag Schema
 */
const TagSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    required: true, 
    ref:'User',
    index:{name:'usertag'} // 用户自己的笔记标签必须名字唯一
  },
  name: {
    type: String,
    required: true, 
    maxlength:30,   // tag title no more 100 words
    index:{name:'usertag'}
  },
  notecount:{
    type: Number,
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

// TagSchema.virtual('desc').get(function() {
//   return this.content.substring(0,30);
// });

/**
 * Methods
 */
TagSchema.method({
});

/**
 * Statics
 */
TagSchema.statics = {
  /**
   * Get tag
   * @param {ObjectId} id - The objectId of tag.
   * @returns {Promise<tag, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((tag) => {
        if (tag) {
          return tag;
        }
        //const err = new APIError('No such tag exists!', httpStatus.NOT_FOUND);
        const err = new Error('No such tag exists');
        return Promise.reject(err);
      });
  },

  getByUser(userid,name) {
    //console.log("user"+ userid + "  name" + name);
    return this.findOne({user:userid, name:name})
      .exec()
      .then((tag) => {  
        if (tag) {
          return tag;
        }
        //const err = new APIError('No such tag exists!', httpStatus.NOT_FOUND);
        const err = new Error('No such tag exists');
        return Promise.reject(err);
      });
  },

  /**
   * List tags in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of tags to be skipped.
   * @param {number} limit - Limit number of tags to be returned.
   * @returns {Promise<Tag[]>}
   */
  list({ skip = 0, limit = 50, user = null } = {}) {
    return this.find({user:user})
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }

};

/**
 * @typedef Tag
 */
export default mongoose.model('Tag', TagSchema);
