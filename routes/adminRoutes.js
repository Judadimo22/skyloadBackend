const { createAdmin, loginAdmin, cancelLoad, deleteLoad, getAdmins, deleteAdmin, updateUser } = require("../controllers/adminController")
const { createLoad, getLoads, updateLoad } = require("../controllers/loadController")
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

router.get("/admins", (req, res) => {
  getAdmins(req, res)
})

router.post("/asignLoad", (req, res) => {
  createLoad(req, res)
})

router.put("/load/:id", (req, res) => {
  updateLoad(req, res)
})

router.post("/deleteAdmin/:adminId", (req, res) => {
  deleteAdmin(req, res)
})

router.get("/loads", (req, res) => {
  getLoads(req, res)
})

router.put("/cancelLoad/:loadId", (req, res) => {
  cancelLoad(req, res)
})

router.put("/deleteLoad/:loadId", (req, res) => {
  deleteLoad(req, res)
})

router.put("/user/:id", (req, res) => {
  updateUser(req, res)
})


module.exports = router
