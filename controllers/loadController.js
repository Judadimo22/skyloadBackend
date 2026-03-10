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
      const title = "🚛 New Load Available";
      const body = `Pickup: ${cityPickUp} (${companyNamePickUp}) Delivery: ${cityDelivery} (${companyDelivery}) Rate: $${rate}`;
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

const getLoads = async (req, res) => {
  try {
    const loads = await loadSchema.find().populate("user", "name lastName lat lon");

    return res.status(200).json(loads);

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching loads" });
  }
};

module.exports = {
    createLoad,
    getLoads
}