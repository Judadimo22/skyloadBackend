const userSchema = require("../models/user");
const UserServices = require("../services/userServices")
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

module.exports = {
    createUser,
    loginUser
}
    