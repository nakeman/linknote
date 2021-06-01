import Tag from './model.js';
import xssFilters from 'xss-filters'
import dayjs from 'dayjs';

const TagCtrl = {};
/**
 * Load tag and append to req.
 */
TagCtrl.load =function(req, res, next, id){
  Tag.get(id)
    .then((tag) => {
      req.tag = tag; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));

};

TagCtrl.loadByUser =function(req, res, next, name){

  Tag.getByUser(req.user.id,name)
    .then((tag) => {
      req.tag = tag; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => {
      console.log("laod tag error on " + e.message);
      next(e);

    });

};


/**
 * Get tag
 * @returns {Tag}
 */
TagCtrl.get = function (req, res) {
  return res.json(req.tag);
};

/**
 * Get tag list.
 */
TagCtrl.list = function list(req, res, next) {
    const { limit = 50, skip = 0,user = req.user.id } = req.query;
    //optins.user = req.user.id;

    Tag.list({limit, skip, user})
      .then(tags => res.json(tags))
      .catch(e => next(e));
  }


/**
 * Get tag list.
 */

// TODO: where user == req.user.id
TagCtrl.search_regex = function search(req, res){
  let key = req.params.key;

  Tag.find({
    $or:[
      {"name":{ $regex: key, $options: 'i' }}
      ]
    }
)
    .then(tags => res.json(tags))
    .catch(e => console.error(e));
}

/**
 * Create new tag
 */
TagCtrl.create = async function create(req, res, next) {
  if (!req.user) {return res.send('not login!!');}
  // 2) 被打的tag可能已经存在在user的 tag 库中，添加要判断是添新，还是数量加一 
  const user_have_tag = await Tag.findOne(
    {
      user:req.user.id, // 
      name:req.body.name
    }
    );

  let tag;
  if (user_have_tag){
    tag = user_have_tag;
    tag.notecount += 1;

  }
  else{
    tag = new Tag({
      user: req.user.id,
      name: req.body.name
    });

  }
  await tag.save()
    .then(
      savedTag => res.json(savedTag)
      )
    .catch(e => {

      //next(e);                      //1 如果此C组件逻辑只是处理请求中的中间一环，则需要将 e往下传，让下一个中间件进行异常处理；
      res.send("tag saving on error: "+ e.message);//2 否则，自己处理异常
    
    }); 
}

/**
 * Update existing tag
 */
TagCtrl.update = function update(req, res) {
  const tag = req.tag;
  //设计原则上不建议改tag name，不要了，删掉，新建一个
  //tag.name = req.body.name;
  tag.notecount -= 1;
  tag.createdAt = Date.now();

  tag.save()
    .then(result => res.json(result))
    .catch(err => console.log(err.message));

}


/**
 * Delete tag.
 * @returns {Tag}
 */
TagCtrl.remove = function remove(req, res, next) {
  const tag = req.tag;
  tag.remove()
    .then(deletedTag => res.json(deletedTag))
    .catch(e => next(e));
}

export default TagCtrl;