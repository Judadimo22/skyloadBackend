const adminSchema = require("../models/admin");
const AdminServices = require("../services/adminServices");

const createAdmin = async (req, res) => {
  const { email, password, name, lastName, } = req.body

  const formatoCorreo = /^([a-zA-Z0-9_.+-]+)@([\w-]+\.)+[\w-]{2,4}$/
  if (!formatoCorreo.test(email)) {
    return res.status(400).json({ error: "Formato de correo electrónico no válido" })
  }

  let admin = await adminSchema.findOne({email:email});
  console.log("Resultado admin:", admin);
console.log("Tipo:", typeof admin);
  if (admin) {
    return res.status(400).json({ error: "El correo ya se encuentra registrado" })
  } else {
    admin = await AdminServices.registerAdminService(email, password, name, lastName)
  }

  const tokenData = { _id: admin._id, email: admin.email, }
  const token = await AdminServices.generateAccessToken(tokenData)

  res.status(200).json({ admin: admin, token:token })
}

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body)

    if (!email || !password) {
      return res.status(400).json({
        status: false,
        error: "Campos no diligenciados",
      });
    }

    let admin = await adminSchema.findOne({ email });
    if (!admin) {
      return res.status(400).json({
        status: false,
        error: "El admin no existe",
      });;
    }

    const isPasswordCorrect = await AdminServices.comparePassword(password, admin.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        status: false,
        error: "Correo o contraseña no coinciden",
      });
    }



    const tokenData = { _id: admin._id, correo: admin.correo};

    const token = await AdminServices.generateAccessToken(tokenData);

    res.status(200).json({ status: true, success: "sendData", token: token });
  } catch (error) {
    console.log(error, 'err---->');
    res.status(400).json({ error: 'Ha ocurrido un error' });
  }
};

module.exports = {
    createAdmin,
    loginAdmin
}