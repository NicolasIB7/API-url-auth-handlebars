const mongoose = require("mongoose");
const { Schema } = mongoose;

const urlSchema = new Schema({
  origin: {
    type: String,
    unique: true,
    required: true,
  },
  shortUrl: {
    type: String,
    unique: true,
    required: true,
  },
  user: {
    // con esta propiedad, cada vez que se cree una url se va a estar asociando a un usuario.
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Url = mongoose.model("Url", urlSchema);
module.exports = Url;
