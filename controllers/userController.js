const userSchema = require("../models/user");
const loadSchema = require("../models/load");
const UserServices = require("../services/userServices");
const { sendError } = require("../utils/funciones");


const createUser = async (req, res) => {
  const { email, password, name, lastName, } = req.body

  const formatoCorreo = /^([a-zA-Z0-9_.+-]+)@([\w-]+\.)+[\w-]{2,4}$/
  if (!formatoCorreo.test(email)) {
    return res.status(400).json({ error: "Formato de correo electrónico no válido" })
  }

  let user = await userSchema.findOne({email:email});
  if (user) {
    return res.status(400).json({ error: "El correo ya se encuentra registrado" })
  } else {
    user = await UserServices.registerUserService(email, password, name, lastName)
  }

  const tokenData = { _id: user._id, email: user.email, }
  const token = await UserServices.generateAccessToken(tokenData)

  res.status(200).json({ user: user, token:token })
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body)

    if (!email || !password) {
      return res.status(400).json({
        status: false,
        error: "Campos no diligenciados",
      });
    }

    let user = await userSchema.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: false,
        error: "El usuario no existe",
      });;
    }

    const isPasswordCorrect = await UserServices.comparePassword(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        status: false,
        error: "Correo o contraseña no coinciden",
      });
    }



    const tokenData = { _id: user._id, email: user.email};

    const token = await UserServices.generateAccessToken(tokenData);

    res.status(200).json({ status: true, success: "sendData", token: token });
  } catch (error) {
    console.log(error, 'err---->');
    res.status(400).json({ error: 'Ha ocurrido un error' });
  }
};

const getUsers = async (req,res) => {
  try {
    const users = await userSchema.find();
    if(!users) {
      return sendError(res, 400, "No hay usuarios registrados");
    }
     return res.status(200).json(users);
  } catch (error) {
    console.log(error, 'err---->');
    res.status(400).json({ error: 'Ha ocurrido un error' });
  }
}

const getLoadsById = async (req,res) => {
  try {
    const { id } = req.params;
    console.log(id)
    if(!id) return sendError(res, 400, "No se recibió el id");
    const loads = await loadSchema.find({user:id} );
    if(!loads) {
      return sendError(res, 400, "No hay usuarios registrados");
    }
    return res.status(200).json(loads);
  } catch (error) {
    console.log(error, 'err---->');
    res.status(400).json({ error: 'Ha ocurrido un error' });
  }
}

const updateLoadState = async (req, res) => {
  try {
    const { loadId } = req.params;

    if (!loadId) {
      return sendError(res, 400, "No se recibió el id de la carga");
    }

    const load = await loadSchema.findById(loadId);

    if (!load) {
      return sendError(res, 404, "Carga no encontrada");
    }

    const estados = [
      "active",
      "picked_up",
      "on_the_way",
      "delivered",
      "completed"
    ];

    const estadoActualIndex = estados.indexOf(load.state);

    if (estadoActualIndex === -1) {
      return sendError(res, 400, "Estado inválido");
    }

    if (estadoActualIndex === estados.length - 1) {
      return res.status(200).json({
        message: "La carga ya está completada",
        load
      });
    }

    const siguienteEstado = estados[estadoActualIndex + 1];

    load.state = siguienteEstado;

    await load.save();

    return res.status(200).json(load);

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      error: "Error actualizando estado"
    });

  }
};

module.exports = {
  createUser,
  loginUser,
  getUsers,
  getLoadsById,
  updateLoadState
}
    