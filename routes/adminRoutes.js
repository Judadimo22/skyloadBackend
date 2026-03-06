const { createAdmin, loginAdmin } = require("../controllers/adminController")

const router = require("express").Router()

router.post("/admin", (req, res) => {
  createAdmin(req, res)
})

router.post("/loginAdmin", (req, res) => {
  loginAdmin(req, res)
})



module.exports = router
