const {
    selectAllCustomer,
    selectCustomer,
    // insertCustomer,
    updateCustomer,
    deleteCustomer,
    countData,
    findId,
    findEmail,
    registerCustomer
  } = require("../model/customer");
const commonHelper = require("../helper/common");
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const authHelper = require('../helper/authHelper');
const jwt = require('jsonwebtoken')
  
  const customerController = {

    getAllCustomer: async (req, res) => {
      try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
        const offset = (page - 1) * limit;
        const result = await selectAllCustomer(limit, offset);
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

        commonHelper.response(res , result.rows, 200, "get data success",pagination);
      } catch (error) {
        console.log(error);
      }
    },

    getDetailCustomer: async (req, res) => {
      const id = req.params.id;
      const {rowCount} = await selectCustomer(id);

      if (!rowCount) return res.json({message:'Data Customer'});

      selectCustomer(id)
        .then((result) => {
          commonHelper.response(res, result.rows, 200, "get data success");
        })
        .catch((err) => res.send(err));
    },

    // createCustomer: async (req, res) => {
    //   const {fullname, email, password, phone, gender, tgl_lahir, role} = req.body;
    //   const {
    //     rows: [count],
    //   } = await countData();
    //   const id = Number(count.count) + 1;
    //   const data = {
    //     id,
    //     fullname,
    //     email,
    //     password,
    //     phone,
    //     gender,
    //     tgl_lahir,
    //     role
    //   };
    //   insertCustomer(data)
    //     .then((result) =>
    //       commonHelper.response(res, result.rows, 201, "Customer Telah dibuat")
    //     )
    //     .catch((err) => res.send(err));
    // },

    updateCustomer: async (req, res) => {
      try {
        const id = req.params.id;
        const {fullname, email, password, phone, gender, tgl_lahir} = req.body;

        const { rowCount } = await findId(id);
        if (!rowCount) {
          res.json({message: "ID Tidak ditemukan"})
        };

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
        role: 'customer'
        };

        updateCustomer(data)
          .then((result) =>
            commonHelper.response(res, result.rows, 200, "Customer Telah diupdate")
          )
          .catch((err) => res.send(err));
      } catch (error) {
        console.log(error);
      }
    },

    deleteCustomer: async (req, res) => {
      try {
        const id = req.params.id;
        const { rowCount } = await findId(id);
        if (!rowCount) {
          res.json({message: "ID is Not Found"})
        }
        deleteCustomer(id)
          .then((result) =>
            commonHelper.response(res, result.rows, 200, "Customer Telah dihapus")
          )
          .catch((err) => res.send(err));
      } catch (error) {
        console.log(error);
      }
    },

    registerCustomer: async (req, res) => {
      try {
        const {
          fullname,
          email,
          password,
          phone,
          gender,
          tgl_lahir
        } = req.body
  
        const { rowCount } = await findEmail(email);
        if (rowCount) return res.json({ message: "Email already use!" })
  
        const salt = bcrypt.genSaltSync(10);
        const passHash = bcrypt.hashSync(password, salt);
        const id = uuidv4();
  
        const data = {
          id,
          fullname,
          email,
          password: passHash,
          phone,
          gender,
          tgl_lahir,
          role: 'customer'
        }
  
        registerCustomer(data).then(result => {
          commonHelper.response(res, result.rows, 201, "Register Customer Success!");
        }).catch(error => {
          res.send(error)
        })
  
      } catch (error) {
        console.log(error);
      }
    },
  
    loginCustomer: async (req, res) => {
      try {
        const { email, password } = req.body;
        const { rows: [categories] } = await findEmail(email);
  
        if (!categories) return res.json({ message: "Email Not Register!" });
  
  
        const validatePassword = bcrypt.compareSync(password, categories.password);
        if (!validatePassword) return res.json({ message: "Password Incorect" });
  
  
        delete categories.password;
        delete categories.phone;
        delete categories.gender;
        delete categories.tgl_lahir;
        delete categories.id_customer;
  
        let payload = {
          email: categories.email,
          role: categories.role
        }
  
        categories.token = authHelper.generateToken(payload);
        categories.refreshToken = authHelper.generateRefreshToken(payload)
  
        commonHelper.response(res, categories, 201, "Login Successfull")
  
      } catch (error) {
        console.log(error);
      }
    },
  
    refreshTokenCustomer: (req, res) => {
      try {
        const { refreshToken } = req.body;
        let decode = jwt.verify(refreshToken, process.env.SECRETE_KEY_JWT);
  
        const payload = {
          email: decode.email,
          role: decode.role
        }
  
        const result = {
          token: authHelper.generateToken(payload),
          refreshToken: authHelper.generateRefreshToken(payload)
        }
  
        commonHelper.response(res, result, 200)
      } catch (error) {
        console.log(error);
      }
    },
  
    profileCustomer: async (req, res) => {
      try {
        const email = req.payload.email
        const { rows: [categories] } = await cfindEmail(email);
  
        delete categories.password
  
        commonHelper.response(res, categories, 200);
      } catch (error) {
        console.log(error);
      }
    }
  };
  
  module.exports = customerController;