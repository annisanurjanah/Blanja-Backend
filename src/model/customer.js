const Pool = require('../config/db');

const selectAllCustomer = () =>{
    return Pool.query(`SELECT * FROM customer`);
};

const selectCustomer = (id) =>{
    return Pool.query(`SELECT * FROM customer WHERE id_customer='${id}'`);
};

// const insertCustomer = (data) =>{
//     const { id, fullname, email, password, phone, gender, tgl_lahir, role} = data;
//     return Pool.query(`INSERT INTO customer (id_customer, fullname, email, password, phone, gender, tgl_lahir, role) VALUES('${id}','${fullname}','${email}','${password}','${phone}','${gender}','${tgl_lahir}')`);
// };

const updateCustomer = (data) =>{
    const { id, fullname, email, password, phone, gender, tgl_lahir, role} = data;
    return Pool.query(`UPDATE customer SET fullname='${fullname}', email='${email}', password='${password}', phone='${phone}', gender='${gender}', tgl_lahir='${tgl_lahir}', role='${role}' WHERE id_customer='${id}'`);
};

const deleteCustomer = (id) =>{
    return Pool.query(`DELETE FROM customer WHERE id_customer='${id}'`);
};

const countData = () =>{
    return Pool.query('SELECT COUNT(*) FROM customer')
};
  
const findId =(id)=>{
    return  new Promise ((resolve,reject)=> 
    Pool.query(`SELECT id_customer FROM customer WHERE id_customer='${id}'`,(error,result)=>{
      if(!error){
        resolve(result)
      }else{
        reject(error)
      }
    })
    )
};

const registerCustomer = (data) => {
    const {
        id,
        fullname,
        email,
        password,
        phone,
        gender,
        tgl_lahir,
        role
    } = data

    return Pool.query(`INSERT INTO customer(id_customer, fullname , email, password, phone, gender, tgl_lahir, role)
    VALUES ('${id}','${fullname}', '${email}', '${password}', '${phone}','${gender}', '${tgl_lahir}', '${role}')`);
}

const findEmail = (email) => {
    return new Promise((resolve, reject) => {
        Pool.query(`SELECT * FROM customer WHERE email='${email}'`, (error, result) => {
            if (!error) {
                resolve(result);
            } else {
                reject(error);
            }
        });
    });
};

module.exports = {
    selectAllCustomer,
    selectCustomer,
    // insertCustomer,
    updateCustomer,
    deleteCustomer,
    countData,
    findId,
    registerCustomer,
    findEmail
};