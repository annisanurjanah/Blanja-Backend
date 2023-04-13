const { v4: uuidv4 } = require('uuid');
const commonHelper = require('../helper/common');

const { selectAllProduct, selectProduct, insertProduct, updateProduct, deleteProduct, countData, findId } = require('../model/products');

const { selectAllSeller, selectSeller, insertSeller, updateSeller, deleteSeller, findEmail } = require('../model/seller');

const productController = {
  getAllProduct: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 4;
      const offset = (page - 1) * limit;
      let sortBY = req.query.sortBY || 'name';
      let sort = req.query.sort || 'ASC';
      let searchParam = req.query.search || '';
      const result = await selectAllProduct(limit, offset, searchParam, sortBY, sort);
      const {
        rows: [count],
      } = await countData();
      const totalData = parseInt(count.count);
      const totalPage = Math.ceil(totalData / limit);
      const pagination = {
        currentPage: page,
        limit: limit,
        totalData: totalData,
        totalPage: totalPage,
      };
      commonHelper.response(res, result.rows, 200, 'get data success', pagination);
    } catch (error) {
      console.log(error);
    }
  },

  getDetailProduct: async (req, res) => {
    const id = req.params.id;
    const { rowCount } = await findId(id);

    if (!rowCount) return res.json({ message: 'Data product not found!' });

    selectProduct(id)
      .then((result) => {
        commonHelper.response(res, result.rows, 200, 'get data success');
      })
      .catch((err) => res.send(err));
  },

  createProduct: async (req, res) => {
    const photo = req.file.filename;
    const PORT = process.env.PORT || 5000;
    const HOST = process.env.HOST || 'localhost';
    // const role = req.payload.role;

    // if (role !== 'seller') return res.json({ message: 'Sorry, you are not a seller!' });

    // const email = req.payload.email;
    // const {
    //   rows: [seller],
    // } = await findEmail(email);

    const { name, price, deskripsi, stock, rating, color, size, id_category, id_seller } = req.body;

    const id = uuidv4();

    // const {
    //   rows: [count],
    // } = await countData();

    // const id = Number(count.count) + 1;

    const data = {
      id,
      name,
      price,
      deskripsi,
      stock,
      rating,
      color,
      size,
      photo: `http://${HOST}:${PORT}/img/${photo}`,
      id_category,
      id_seller,
    };

    insertProduct(data)
      .then((result) => commonHelper.response(res, result.rows, 201, 'Product Telah dibuat'))
      .catch((err) => res.send(err));
  },

  updateProduct: async (req, res) => {
    try {
      const id = req.params.id;
      const photo = req.file.filename;
      const PORT = process.env.PORT || 5000;
      const HOST = process.env.HOST || 'localhost';

      // const role = req.payload.role;

      // if (role !== 'seller') return res.json({ message: 'Sorry, you are not a seller!' });

      const { rowCount } = await findId(id);

      if (!rowCount) {
        res.json({ message: 'ID is Not Found' });
      }

      // const email = req.payload.email;
      // const {
      //   rows: [seller],
      // } = await findEmail(email);

      const { name, price, deskripsi, stock, rating, color, size, id_category, id_seller } = req.body;

      const data = {
        id,
        name,
        price,
        deskripsi,
        stock,
        rating,
        color,
        size,
        photo: `http://${HOST}:${PORT}/img/${photo}`,
        id_category,
        id_seller,
      };
      updateProduct(data)
        .then((result) => commonHelper.response(res, result.rows, 200, 'Product Telah diupdate'))
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },

  deleteProduct: async (req, res) => {
    const id = req.params.id;
    // const role = req.payload.role;

    // if (role !== 'seller') return res.json({ message: 'Sorry, you are not a seller!' });

    try {
      const { rowCount } = await findId(id);
      if (!rowCount) {
        res.json({ message: 'ID Tidak ditemukan' });
      }
      deleteProduct(id)
        .then((result) => commonHelper.response(res, result.rows, 200, 'Product Telah dihapus'))
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = productController;
