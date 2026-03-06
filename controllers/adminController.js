const adminSchema = require("../models/admin");
const AdminServices = require("../services/adminServices");
const { sendError } = require("../utils/funciones");

const createAdmin = async (req, res) => {
  try {

    const { email, password, name, lastName } = req.body;

    const formatoCorreo = /^([a-zA-Z0-9_.+-]+)@([\w-]+\.)+[\w-]{2,4}$/;

    if (!formatoCorreo.test(email)) {
      return res.status(400).json({
        status: false,
        error: "Formato de correo electrónico no válido"
      });
    }

    let admin = await adminSchema.findOne({ email });

    if (admin) {
      return sendError(res, 400, "El correo ya se encuentra registrado");
    }

    admin = await AdminServices.registerAdminService(
      email,
      password,
      name,
      lastName
    );

    const tokenData = {
      _id: admin._id,
      email: admin.email
    };

    const token = await AdminServices.generateAccessToken(tokenData);

    res.status(200).json({
      status: true,
      admin,
      token
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      status: false,
      error: "Error al crear el administrador"
    });
  }
};

const loginAdmin = async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, "Campos no diligenciados");
    }

    let admin = await adminSchema.findOne({ email });

    if (!admin) {
      return sendError(res, 400, "El admin no existe");
    }

    const isPasswordCorrect = await AdminServices.comparePassword(
      password,
      admin.password
    );

    if (!isPasswordCorrect) {
      return sendError(res, 400, "Correo o contraseña no coinciden");
    }

    const tokenData = {
      _id: admin._id,
      email: admin.email
    };

    const token = await AdminServices.generateAccessToken(tokenData);

    res.status(200).json({
      status: true,
      token
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      status: false,
      error: "Ha ocurrido un error"
    });
  }
};

module.exports = {
    createAdmin,
    loginAdmin
}