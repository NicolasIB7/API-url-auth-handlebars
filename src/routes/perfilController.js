const formidable = require("formidable"); // esta dependencia servirá para subir nuevas fotos de perfil.
const Jimp = require("jimp"); // esta dependencia servirá para redimensionar imagenes.
const path = require("path");
const fs = require("fs");
const User = require("../../models/User");

module.exports.formPerfil = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    return res.render("profile", { user: req.user, image: user.image });
  } catch (error) {
    req.flash("mensajes", [{ msg: "Error al leer la imagen" }]);
    return res.redirect("/perfil");
  }
};

module.exports.editPerfil = async (req, res) => {
  const form = new formidable.IncomingForm();
  form.maxFileSize = 50 * 1024 * 1024;

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        throw new Error("Error al subir la imagen");
      }

      const file = files.myFile;

      if (file.originalFilename === "") {
        throw new Error("Por favor debe agregar alguna imagen");
      }

      if (!(file.mimetype === "image/jpeg" || file.mimetype === "image/png")) {
        throw new Error("Por favor debe agregar una imagen .jpg o .png");
      }

      if (file.size > 50 * 1024 * 1024) {
        throw new Error("La imagen debe ser menor a 5MB");
      }

      const extension = file.mimetype.split("/")[1];
      const dirFile = path.join(
        __dirname,
        `../../public/img/perfiles/${req.user.id}.${extension}`
      );

      fs.renameSync(file.filepath, dirFile);

      const image = await Jimp.read(dirFile);
      image.resize(200, 200).quality(80).writeAsync(dirFile); // Jimp posee diferentes metodos incluidos, en este caso usamos resize

      const user = await User.findById(req.user.id);
      user.image = `${req.user.id}.${extension}`;
      await user.save(); // la imagen no se guardará en la BDD, sino que solo la dirección necesaria para que luego con formidable pueda cambiarla o editarla.

      return res.redirect("/perfil");
    } catch (error) {
      req.flash("mensajes", [{ msg: error.message }]);
      return res.redirect("/perfil");
    }
  });
};
