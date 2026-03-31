const loadSchema = require("../models/load");
const userSchema = require("../models/user");
const sendNotification = require("../utils/sendNotifications");


const createLoad = async (req, res) => {
  const {datePickUp, companyNamePickUp,addressPickup,cityPickUp,notePickUp,dateDelivery,companyDelivery,addressDelivery,cityDelivery,noteDelivery,user,rate} = req.body;
  if (!datePickUp || !companyNamePickUp || !addressPickup || !cityPickUp || !dateDelivery || !companyDelivery || !addressDelivery || !cityDelivery || !user || !rate) {
    return sendError(res, 400, "Faltan campos para crear la carga");
  }

  try {
    const load = await loadSchema.create({datePickUp,companyNamePickUp,addressPickup,cityPickUp,notePickUp,dateDelivery,companyDelivery,addressDelivery,cityDelivery, noteDelivery,user,state: "active",rate});
    const userData = await userSchema.findById(user);
    if (userData && userData.fcmToken) {
      const title = "🚛 YOU GOT A NEW LOAD";
      const body = `(${cityPickUp} -${cityDelivery}) Rate: $${rate}`;
      await sendNotification(userData.fcmToken,title,body,{
        loadId: load._id.toString(),
        pickupCity: cityPickUp,
        deliveryCity: cityDelivery,
        pickupDate: datePickUp,
        deliveryDate: dateDelivery,
        rate: rate.toString(),
        type: "new_load"
      });
    }

    return res.status(201).json({status: true,message: "Carga creada correctamente",data: load});

  } catch (error) {
    console.error(error);
    return res.status(500).json({status: false,message: "Error al crear la carga"});
  }
};

const updateLoad = async (req, res) => {
  const { id } = req.params;
  const {
    datePickUp,
    companyNamePickUp,
    addressPickup,
    cityPickUp,
    notePickUp,
    dateDelivery,
    companyDelivery,
    addressDelivery,
    cityDelivery,
    noteDelivery,
    rate,
    state,
  } = req.body;

  try {

    const load = await loadSchema.findById(id);

    if (!load) {
      return res.status(404).json({
        status: false,
        message: "Carga no encontrada",
      });
    }

  
    load.datePickUp = datePickUp ?? load.datePickUp;
    load.companyNamePickUp = companyNamePickUp ?? load.companyNamePickUp;
    load.addressPickup = addressPickup ?? load.addressPickup;
    load.cityPickUp = cityPickUp ?? load.cityPickUp;
    load.notePickUp = notePickUp ?? load.notePickUp;

    load.dateDelivery = dateDelivery ?? load.dateDelivery;
    load.companyDelivery = companyDelivery ?? load.companyDelivery;
    load.addressDelivery = addressDelivery ?? load.addressDelivery;
    load.cityDelivery = cityDelivery ?? load.cityDelivery;
    load.noteDelivery = noteDelivery ?? load.noteDelivery;

    load.rate = rate ?? load.rate;
    load.state = state ?? load.state;

    await load.save();

    return res.status(200).json({
      status: true,
      message: "Carga actualizada correctamente",
      data: load,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Error al actualizar la carga",
    });
  }
};

const getLoads = async (req, res) => {
  try {
    const loads = await loadSchema.find().populate("user", "name lastName lat lon unitNumber");

    return res.status(200).json(loads);

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching loads" });
  }
};

module.exports = {
  createLoad,
  getLoads,
  updateLoad
}