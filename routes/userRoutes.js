
const { createUser, loginUser } = require("../controllers/userController")

const router = require("express").Router()

router.post("/user", (req, res) => {
  createUser(req, res)
})

router.post("/loginUser", (req, res) => {
  loginUser(req, res)
})



module.exports = router
