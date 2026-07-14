
const { createUser, loginUser, getLoadsById, updateLoadState, updateUserLocation, revertLoadState, deleteUser, getUser, toggleTracking } = require("../controllers/userController")

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

router.put("/revertLoad/:loadId", (req, res) => {
  revertLoadState(req, res)
})

router.put("/updateLocation/:id", (req, res) => {
  updateUserLocation(req, res)
})

router.get("/user/:id", (req, res) => {
  getUser(req, res)
})

router.patch("/user/:id/tracking", (req, res) => {
  toggleTracking(req, res)
})

router.delete("/user/:id", (req, res) => {
  deleteUser(req, res)
})




module.exports = router
