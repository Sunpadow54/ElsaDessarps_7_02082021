// Posts Roads
// ------------------------- IMPORTS -------------------------

const express = require('express');

// ----- Create router
const router = express.Router();

// ---- Import middelwares
const { authUser, authRole } = require('../middleware/auth'); // to protect road (token)
const multer = require('../middleware/multer-config'); // to upload img

// ----- Import Controlls
const postCtrl = require('../controllers/post');


// ============================================================
// ------------------------- ROADS ----------------------------


router.post('/', authUser, multer, postCtrl.createPost);
router.put('/:id', authUser, postCtrl.editPost);
router.delete('/:id', authUser, postCtrl.deletePost);
router.get('/', authUser, postCtrl.getAllPosts);
router.get('/:id', authUser, postCtrl.getOnePost);
router.post('/:id/vote', authUser, postCtrl.vote);

router.put('/:id/moderate', /* authUser, */ /* authRole('admin'),  *//* auth,  */postCtrl.moderatePost);


// ============================================================
// ------------------------- EXPORT ---------------------------

module.exports = router;