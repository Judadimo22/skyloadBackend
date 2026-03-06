
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        lowercase: true,
        required: [true, "Falta la dirección de correo electrónico"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Falta la contraseña"],
    },
    name: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    }
}, { timestamps: true });

adminSchema.pre("save", async function () {
    var admin = this;
    if (!admin.isModified("password")) {
        return
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(admin.password, salt);
        admin.password = hash;
    } catch (err) {
        throw err;
    }
});

adminSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (error) {
        throw error;
    }
};

module.exports = mongoose.model("admin", adminSchema);
