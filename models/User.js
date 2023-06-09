const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // Sirve para hashear las contraseñas.
const { Schema } = mongoose;

const userSchema = new Schema({
    userName: {
        type: String,
        lowercase: true,
        required: true,
        match: [/^[a-zA-Z0-9]+$/, "Solo letras y números"],
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        index: { unique: true },
    },
    image: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    tokenConfirm: {
        type: String,
        default: null,
    },
    confirm: {
        type: Boolean,
        default: false,
    },
});


userSchema.pre('save', async function(next) {
    const user = this;
  
    if (!user.isModified("password")) return next();
  
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(user.password, salt);
  
      user.password = hash;
      next();
    } catch (error) {
      console.error(error);
      next(error);
    }
  });
  
userSchema.methods.comparePassword = async function(candidatePassword){ //utilizo la palabra methods para añadir una funcion
    return await bcrypt.compare(candidatePassword, this.password) //compare es palabra reservada de bcrypt.
}

module.exports = mongoose.model("User", userSchema);