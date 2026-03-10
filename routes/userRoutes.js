
const { createUser, loginUser, getLoadsById, updateLoadState, updateUserLocation } = require("../controllers/userController")

const router = require("express").Router()

router.post("/user", (req, res) => {
  createUser(req, res)
})

router.post("/loginUser", (req, res) => {
  loginUser(req, res)
})

router.get("/loads/:id", (req, res) => {
  getLoadsById(req, res)
})

router.put("/updateLoad/:loadId", (req, res) => {
  updateLoadState(req, res)
})

router.put("/updateLocation/:id", (req, res) => {
  updateUserLocation(req, res)
})




module.exports = router
