const loadSchema = require("../models/load");

const createLoad = async (req, res) => {

    const { datePickUp, companyNamePickUp, addressPickup, cityPickUp, notePickUp, dateDelivery, companyDelivery, addressDelivery, cityDelivery, noteDelivery,user} = req.body;
    if (!datePickUp || !companyNamePickUp || !addressPickup || !cityPickUp || !dateDelivery || !companyDelivery || !addressDelivery || !cityDelivery ||!user) {
        return sendError(res, 400, "Faltan campos para crear la carga");
    }

    try {
        const load = await loadSchema.create({datePickUp, companyNamePickUp, addressPickup, cityPickUp, notePickUp, dateDelivery, companyDelivery, addressDelivery, cityDelivery, noteDelivery,user, state: "active"});
        return res.status(201).json({status: true,message: "Carga creada correctamente",data: load});

    } catch (error) {
        console.error(error);
        return res.status(500).json({
        status: false,
        message: "Error al crear la carga"
        });
    }
};

const getLoads = async (req,res) => {
  try {
    const loads = await loadSchema.find();
    if(!loads) {
      return sendError(res, 400, "No hay cargas disponibles");
    }
     return res.status(200).json(loads);
  } catch (error) {
    console.log(error, 'err---->');
    res.status(400).json({ error: 'Ha ocurrido un error' });
  }
}

module.exports = {
    createLoad,
    getLoads
}