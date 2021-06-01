////tags REST API | Router
////////////////////////////////
import express from 'express';
//import ensuerLogins from 'connect-ensure-login';
import tagCtrl from './controller.js'
let router = express.Router();


router.route('/')
  /** GET /api/tags - Get list of tags */
  .get(tagCtrl.list)

  /** POST /api/tags - Create new tag */
  //.post(validate(paramValidation.createUser), tagCtrl.create);
  .post(tagCtrl.create);

router.route('/:id')
  /** GET /api/tags/:id - Get tag */
  .get(tagCtrl.get)

  /** PUT /api/tags/:id - Update tag */
  //.put(validate(paramValidation.updateUser), tagCtrl.update)
  .put(tagCtrl.update)

  /** DELETE /api/tags/:id - Delete tag */
  .delete(tagCtrl.remove);

  // 通过userid tag name唯一，更新tag的count值
router.route('/n/:name')
  .put(tagCtrl.update);

/** Load tag when API with id route parameter is hit */
router.param('id', tagCtrl.load);
router.param('name', tagCtrl.loadByUser);


router.get('/t/:tag',tagCtrl.search_regex);


export default router;