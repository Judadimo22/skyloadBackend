
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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

userSchema.pre("save", async function () {
    var user = this;
    if (!user.isModified("password")) {
        return
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt);
        user.password = hash;
    } catch (err) {
        throw err;
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (error) {
        throw error;
    }
};

module.exports = mongoose.model("user", userSchema);
