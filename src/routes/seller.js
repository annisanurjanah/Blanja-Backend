const express = require('express');
const router  = express.Router();
const sellerController = require('../controller/seller');
const {protect} = require('../middleware/authMiddleware');
// const {validate} = require('../middleware/common')

router.get("/", sellerController.getAllSeller);
router.get("/:id", sellerController.getDetailSeller);
router.put("/:id", sellerController.updateSeller);
router.delete("/:id", sellerController.deleteSeller);

router.post('/auth/register', sellerController.registerSeller);
router.post('/auth/login', sellerController.loginSeller);
router.post('/auth/refresh-token', sellerController.refreshTokenSeller);
router.get('/auth/profile-seller', protect, sellerController.profileSeller);

module.exports = router;