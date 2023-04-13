const express = require('express');
const router = express.Router();
const productController = require('../controller/products');
// const {validate} = require('../middleware/common');
// const { protect } = require('../middleware/authMiddleware');

const upload = require('../middleware/multerMiddleware');

router.get('/', productController.getAllProduct);
router.get('/:id', productController.getDetailProduct);
router.post('/', upload, productController.createProduct);
router.put('/:id', upload, productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
