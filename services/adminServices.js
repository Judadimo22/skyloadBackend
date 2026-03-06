require("dotenv").config();
const AdminModel = require("../models/admin");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const TOKEN_LLAVE_ADMINISTRADORES = process.env.TOKEN_LLAVE_ADMINISTRADORES || ''


class AdminServices {
    static async registerAdminService( email, password, name, lastName) {
        try {
        console.log("Nuevo admin registrado", email);
        const createAdmin = new AdminModel({ email, password, name, lastName});
        return await createAdmin.save();
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
        return jwt.sign(tokenData, TOKEN_LLAVE_ADMINISTRADORES, { expiresIn: '8h' });
    }

}

module.exports = AdminServices;