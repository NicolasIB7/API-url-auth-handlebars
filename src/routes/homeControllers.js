const { nanoid } = require("nanoid");
const Url = require("../../models/Url");

const leerUrls = async (req, res) => {
  try {
    const urls = await Url.find({ user: req.user.id }).lean(); //el lean hace que ek objeto que me traiga sea de JS sino me trae un objeto tipo mongoose
    // Al metodo find le mando la propiedad user del modelo para que solo me traiga las correspondientes a ese usuario.
    res.render("home", { urls });
  } catch (error) {
    req.flash("mensajes", [{ msg: error.message }]);
    return res.redirect("/");
  }
};
const agregarUrls = async (req, res) => {
  const { origin } = req.body;
  try {
    const shortUrl = nanoid(7);
    const urll = new Url({
      origin: origin,
      shortUrl: shortUrl,
      user: req.user.id,
    });
    await urll.save();
    req.flash("mensajes", [{ msg: "Url agregada" }]);
    res.redirect("/");
  } catch (error) {
    req.flash("mensajes", [{ msg: error.message }]);
    return res.redirect("/");
  }
};

const eliminarUrls = async (req, res) => {
  const { id } = req.params;
  try {
    const url = await Url.findById(id);
    if (!url.user.equals(req.user.id)) {
      throw new Error("no se puede eliminar url");
    }
    await url.deleteOne();

    req.flash("mensajes", [{ msg: "se eliminó url correctamente" }]);
    return res.redirect("/");
  } catch (error) {
    req.flash("mensajes", [{ msg: error.message }]);
    return res.redirect("/");
  }
};

const editarUrls = async (req, res) => {
  const { id } = req.params;
  try {
    const url = await Url.findById(id).lean();

    if (!url.user.equals(req.user.id)) {
      throw new Error("no se puede editar url");
    }

    return res.render("home", { url });
  } catch (error) {
    req.flash("mensajes", [{ msg: error.message }]);
    return res.redirect("/");
  }
};

const editarUrlForm = async (req, res) => {
  const { id } = req.params;
  const { origin } = req.body;
  try {
    const url = await Url.findById(id);
    if (!url.user.equals(req.user.id)) {
      throw new Error("no se puede editar url");
    }
    await url.updateOne({ origin });
    //await Url.findByIdAndUpdate(id, {origin:origin} )
    req.flash("mensajes", [{ msg: "Url editada" }]);
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    res.send("algo falló");
  }
};

const redirect = async (req, res) => {
  const { shortUrl } = req.params;
  try {
    const url = await Url.findOne({ shortUrl });
    console.log(url);
    if (!url) throw new Error("404 no se encuentra la url");

    return res.redirect(url.origin);
  } catch (error) {
    req.flash("mensajes", [{ msg: error.message }]);
    return res.redirect("/");
  }
};

module.exports = {
  leerUrls,
  agregarUrls,
  eliminarUrls,
  editarUrls,
  editarUrlForm,
  redirect,
};
