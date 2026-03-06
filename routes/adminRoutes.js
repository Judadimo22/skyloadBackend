const { createAdmin, loginAdmin } = require("../controllers/adminController")
const { getUsers } = require("../controllers/userController")

const router = require("express").Router()

router.post("/admin", (req, res) => {
  createAdmin(req, res)
})

router.post("/loginAdmin", (req, res) => {
  loginAdmin(req, res)
})

router.get("/users", (req, res) => {
  getUsers(req, res)
})



module.exports = router
