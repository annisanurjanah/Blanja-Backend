const express = require('express');
const router  = express.Router();
const customerController = require('../controller/customer');
const {protect} = require('../middleware/authMiddleware');
// const {validate} = require('../middleware/common')

router.get("/", customerController.getAllCustomer);
router.get("/:id", customerController.getDetailCustomer);
router.put("/:id", customerController.updateCustomer);
router.delete("/:id", customerController.deleteCustomer);

router.post('/auth/register', customerController.registerCustomer);
router.post('/auth/login', customerController.loginCustomer);
router.post('/auth/refresh-token', customerController.refreshTokenCustomer);
router.get('/auth/profile-customer', protect, customerController.profileCustomer);

module.exports = router;