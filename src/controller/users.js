const modelUsers = require('../model/users');

const userController = {
    register : async (req, res) => {
        try {
            const {email, password, fullname} = req.body;
            const {rowCount} = await modelUsers.findEmail(email);
            console.log(rowCount);
        } catch (error) {
            console.log(error);
        }
    },
    login : "",
    refreshToken : "",
    profile : ""
}

module.exports = userController;