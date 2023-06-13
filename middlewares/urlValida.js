const { URL } = require("url");

const urlValidar = (req, res, next) => {
  try {
    const { origin } = req.body;
    const urlFront = new URL(origin);
    if (urlFront.origin !== "null") {
      if (urlFront.protocol === "http:" || urlFront.protocol == "https:") {
        return next();
      }
      throw new Error("Tiene que ser https://");
    } else {
      throw new Error(" No válida");
    }
  } catch (error) {
    if (error.message === "Invalid URL") {
      req.flash("mensajes", [{ msg: "URL no válida" }]);
    } else {
      req.flash("mensajes", [{ msg: error.message }]);
    }
    return res.redirect("/");
  }
};

module.exports = urlValidar;
