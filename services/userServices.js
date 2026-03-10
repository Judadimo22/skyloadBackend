require("dotenv").config();
const UserModel = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const TOKEN_LLAVE_USUARIOS = process.env.TOKEN_LLAVE_USUARIOS || ''


class UserServices {
    static async registerUserService( email, password, name, lastName, vehicle) {
        try {
        console.log("Nuevo usuario registrado", email);
        const createUser = new UserModel({ email, password, name, lastName, vehicle});
        return await createUser.save();
        } catch (err) {
        throw err;
        }
    }

    static async comparePassword(password, hashedPassword) {
        try {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
        } catch (error) {
        throw new Error('Error comparing passwords');
        }
    }

    static async generateAccessToken(tokenData) {
        return jwt.sign(tokenData, TOKEN_LLAVE_USUARIOS, { expiresIn: '8h' });
    }

}

module.exports = UserServices;