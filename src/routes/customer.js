const express = require('express');
const router  = express.Router();
const customerController = require('../controller/customer');
// const {validate} = require('../middleware/common')

router.get("/", customerController.getAllCustomer);
router.get("/:id", customerController.getDetailCustomer);
router.post("/", customerController.createCustomer);
router.put("/:id", customerController.updateCustomer);
router.delete("/:id", customerController.deleteCustomer);

module.exports = router;