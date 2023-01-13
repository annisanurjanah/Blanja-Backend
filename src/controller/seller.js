const {
    selectAllSeller,
    selectSeller,
    insertSeller,
    updateSeller,
    deleteSeller,
    countData,
    findId,
  } = require("../model/seller");
  const commonHelper = require("../helper/common");
  
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
        commonHelper.response(res , result.rows, 200, "get data success",pagination);
      } catch (error) {
        console.log(error);
      }
    },


    getDetailSeller: async (req, res) => {
      const id = Number(req.params.id);
      selectSeller(id)
        .then((result) => {
          commonHelper.response(res, result.rows, 200, "get data success");
        })
        .catch((err) => res.send(err));
    },


    createSeller: async (req, res) => {
      const { name, phone, password, email, gender, tgl_lahir } = req.body;
      const {
        rows: [count],
      } = await countData();
      const id = Number(count.count) + 1;
      const data = {
        id,
        name,
        phone,
        password,
        email,
        gender,
        tgl_lahir,
      };
      insertSeller(data)
        .then((result) =>
          commonHelper.response(res, result.rows, 201, "Product Telah dibuat")
        )
        .catch((err) => res.send(err));
    },


    updateSeller: async (req, res) => {
      try {
        const id = Number(req.params.id);
        const {name, phone, password, email, gender, tgl_lahir} = req.body;
        const { rowCount } = await findId(id);
        if (!rowCount) {
          res.json({message: "ID Tidak ditemukan"})
        }
        const data = {
          id,
          name,
          phone,
          password,
          email,
          gender,
          tgl_lahir,
        };
        updateSeller(data)
          .then((result) =>
            commonHelper.response(res, result.rows, 200, "Product Telah diupdate")
          )
          .catch((err) => res.send(err));
      } catch (error) {
        console.log(error);
      }
    },


    deleteSeller: async (req, res) => {
      try {
        const id = Number(req.params.id);
        const { rowCount } = await findId(id);
        if (!rowCount) {
          res.json({message: "ID is Not Found"})
        }
        deleteSeller(id)
          .then((result) =>
            commonHelper.response(res, result.rows, 200, "Product Telah dihapus")
          )
          .catch((err) => res.send(err));
      } catch (error) {
        console.log(error);
      }
    },
  };
  
  module.exports = sellerController;