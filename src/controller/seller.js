const {
  selectAllSeller,
  selectSeller,
  // insertSeller,
  updateSeller,
  deleteSeller,
  countData,
  findId,
  registerSeller,
  findEmail,
} = require('../model/seller');
const commonHelper = require('../helper/common');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const authHelper = require('../helper/authHelper');
const jwt = require('jsonwebtoken');

const sellerController = {
  getAllSeller: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 5;
      const offset = (page - 1) * limit;
      const result = await selectAllSeller(limit, offset);
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

  getDetailSeller: async (req, res) => {
    const id = req.params.id;
    selectSeller(id)
      .then((result) => {
        commonHelper.response(res, result.rows, 200, 'get data success');
      })
      .catch((err) => res.send(err));
  },

  // createSeller: async (req, res) => {
  //   const { name, phone, password, email, gender, tgl_lahir } = req.body;
  //   const {
  //     rows: [count],
  //   } = await countData();
  //   const id = Number(count.count) + 1;
  //   const data = {
  //     id,
  //     name,
  //     phone,
  //     password,
  //     email,
  //     gender,
  //     tgl_lahir,
  //   };
  //   insertSeller(data)
  //     .then((result) =>
  //       commonHelper.response(res, result.rows, 201, "Seller Telah dibuat")
  //     )
  //     .catch((err) => res.send(err));
  // },

  updateSeller: async (req, res) => {
    try {
      const id = req.params.id;
      const { fullname, email, password, phone, gender, tgl_lahir } = req.body;

      const { rowCount } = await findId(id);
      if (!rowCount) {
        res.json({ message: 'ID Tidak ditemukan' });
      }

      const salt = bcrypt.genSaltSync(10);
      const passHash = bcrypt.hashSync(password, salt);

      const data = {
        id,
        fullname,
        email,
        password: passHash,
        phone,
        gender,
        tgl_lahir,
        role: 'seller',
      };
      updateSeller(data)
        .then((result) => commonHelper.response(res, result.rows, 200, 'Seller Telah diupdate'))
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },

  deleteSeller: async (req, res) => {
    try {
      const id = req.params.id;
      const { rowCount } = await findId(id);
      if (!rowCount) {
        res.json({ message: 'ID is Not Found' });
      }
      deleteSeller(id)
        .then((result) => commonHelper.response(res, result.rows, 200, 'Seller Telah dihapus'))
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },

  registerSeller: async (req, res) => {
    try {
      const { fullname, email, password, phone, store } = req.body;

      const { rowCount } = await findEmail(email);
      if (rowCount) return res.json({ message: 'Email already use!' });

      const salt = bcrypt.genSaltSync(10);
      const passHash = bcrypt.hashSync(password, salt);
      const id = uuidv4();

      const data = {
        id,
        fullname,
        email,
        password: passHash,
        phone,
        store,
        role: 'seller',
      };

      registerSeller(data)
        .then((result) => {
          commonHelper.response(res, result.rows, 201, 'Register Seller Success!');
        })
        .catch((error) => {
          res.send(error);
        });
    } catch (error) {
      console.log(error);
    }
  },

  loginSeller: async (req, res) => {
    try {
      const { email, password } = req.body;
      const {
        rows: [categories],
      } = await findEmail(email);

      if (!categories) return res.json({ message: 'Email Not Register!' });

      const validatePassword = bcrypt.compareSync(password, categories.password);
      if (!validatePassword) return res.json({ message: 'Password Incorect' });

      delete categories.password;
      delete categories.phone;
      delete categories.gender;
      delete categories.tgl_lahir;
      delete categories.id_Seller;

      let payload = {
        email: categories.email,
        role: categories.role,
      };

      categories.token = authHelper.generateToken(payload);
      categories.refreshToken = authHelper.generateRefreshToken(payload);

      commonHelper.response(res, categories, 201, 'Login Successfull');
    } catch (error) {
      console.log(error);
    }
  },

  refreshTokenSeller: (req, res) => {
    try {
      const { refreshToken } = req.body;
      let decode = jwt.verify(refreshToken, process.env.SECRETE_KEY_JWT);

      const payload = {
        email: decode.email,
        role: decode.role,
      };

      const result = {
        token: authHelper.generateToken(payload),
        refreshToken: authHelper.generateRefreshToken(payload),
      };

      commonHelper.response(res, result, 200);
    } catch (error) {
      console.log(error);
    }
  },

  profileSeller: async (req, res) => {
    try {
      const email = req.payload.email;
      const {
        rows: [categories],
      } = await findEmail(email);

      delete categories.password;

      commonHelper.response(res, categories, 200);
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = sellerController;
