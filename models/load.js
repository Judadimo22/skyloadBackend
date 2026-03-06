
const mongoose = require('mongoose');

const loadSchema = new mongoose.Schema({
    datePickUp: { 
        type: String,
    },
    companyNamePickUp: {
        type: String,
    },
    addressPickup: { 
        type: String
    },
    cityPickUp: {
        type: String
    },
    notePickUp: {
        type: String,
    },
    dateDelivery: {
        type: String,
    },
    companyDelivery: {
        type: String,
    },
    addressDelivery: {
        type: String,
    },
    cityDelivery: {
        type: String,
    },
    noteDelivery: {
        type: String,
    },
    user: {
        type: String
    },
    state: {
        type: String
    }

}, { timestamps: true });

module.exports = mongoose.model("load", loadSchema);
