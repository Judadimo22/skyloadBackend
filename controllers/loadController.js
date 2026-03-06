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

module.exports = {
    createLoad
}