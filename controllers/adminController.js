const adminSchema = require("../models/admin");
const AdminServices = require("../services/adminServices");
const { sendError } = require("../utils/funciones");
const loadSchema = require("../models/load");

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

const getAdmins = async (req,res) => {
  try {
    const admins = await adminSchema.find();
    if(!admins) {
      return sendError(res, 400, "No hay administradores registrados");
    }
     return res.status(200).json(admins);
  } catch (error) {
    console.log(error, 'err---->');
    res.status(400).json({ error: 'Ha ocurrido un error' });
  }
}

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
      email: admin.email,
      rol: admin.rol ?? ''
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

const cancelLoad = async (req, res) => {
  try {
    const { loadId } = req.params;

    if (!loadId) {
      return sendError(res, 400, "Load ID was not provided");
    }

    const load = await loadSchema.findById(loadId);

    if (!load) {
      return sendError(res, 404, "Load not found");
    }

    // ❌ Do not allow cancel if already completed
    if (load.state === "completed") {
      return res.status(400).json({
        message: "Cannot cancel a completed load",
      });
    }

    // ❌ Prevent duplicate cancel
    if (load.state === "cancelled") {
      return res.status(400).json({
        message: "The load is already cancelled",
      });
    }

    // ✅ Update state
    load.state = "cancelled";

    await load.save();

    return res.status(200).json({
      message: "Load cancelled successfully",
      load,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: "Error cancelling the load",
    });
  }
};

const deleteLoad = async (req, res) => {
  try {
    const { loadId } = req.params;

    if (!loadId) {
      return sendError(res, 400, "Load ID was not provided");
    }

    const load = await loadSchema.findById(loadId);

    if (!load) {
      return sendError(res, 404, "Load not found");
    }

    await loadSchema.findByIdAndDelete(loadId);

    return res.status(200).json({
      message: "Load deleted successfully",
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: "Error deleting the load",
    });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;

    if (!adminId) {
      return sendError(res, 400, "Admin ID was not provided");
    }

    const admin = await adminSchema.findById(adminId);

    if (!admin) {
      return sendError(res, 404, "Admin not found");
    }

    await adminSchema.findByIdAndDelete(adminId);

    return res.status(200).json({
      message: "Admin deleted successfully",
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: "Error deleting the admin",
    });
  }
};



module.exports = {
  createAdmin,
  loginAdmin,
  cancelLoad,
  deleteLoad,
  getAdmins,
  deleteAdmin
}