const User = require("../../models/User");
const { nanoid } = require("nanoid");
const nodemailer = require("nodemailer");
require("dotenv").config();
const { validationResult } = require("express-validator");

const registerForm = (req, res) => {
  res.render("register");
};

const registerUser = async (req, res) => {
  const errors = validationResult(req); // si en la ruta de registro se reporta un error, con validationResult voy a capturarlo.
  if (!errors.isEmpty()) {
    req.flash("mensajes", errors.array());
    return res.redirect("/auth/register");
  }

  //Estos mensajes de errores, se mostraran en pantalla utilizando flash.
  const { userName, email, password } = req.body;
  try {
    let user = await User.findOne({ email: email });
    if (user) throw new Error("ya esxiste el usuario");

    user = new User({ userName, email, password, tokenConfirm: nanoid() });
    await user.save();

    const transport = nodemailer.createTransport({
      //mailtrap simulará el envio de mails a una cuenta para así probar la verificación y no utilizar cuentas reales.
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.userMail,
        pass: process.env.passMail,
      },
    });

    await transport.sendMail({
      from: '"Fred Foo 👻" <foo@example.com>',
      to: user.email,
      subject: "verifique cuenta de correo",
      html: `<a href="${process.env.PATHHEROKU||"http://localhost:3001"}/auth/confirm/${user.tokenConfirm}">verificar cuenta aquí</a>`,
    });

    req.flash("mensajes", [
      { msg: " Revisa tu correo electrónico y valida tu cuenta" },
    ]);
    return res.redirect("/auth/login");
  } catch (error) {
    req.flash("mensajes", [{ msg: error.message }]);
    res.redirect("/auth/register");
  }
};

const confirmAc = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ tokenConfirm: token });
    if (!user) throw new Error("No existe el usuario");

    user.confirm = true;
    user.tokenConfirm = null; // lo dejo de vuelta en null para cuando quiera reestablecer la contraseña.

    await user.save();

    res.redirect("/auth/login");
  } catch (error) {
    req.flash("mensajes", [{ msg: error.message }]);
    return res.redirect("/auth/login");
  }
};

const loginForm = (req, res) => {
  res.render("login");
};

const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("mensajes", errors.array());
    return res.redirect("/auth/login");
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (!user) throw new Error("No existe este email");

    if (!user.confirm) throw new Error("Falta confirmar cuenta");

    if (!(await user.comparePassword(password)))
      throw new Error("Contraseña incorrecta");

    req.login(user, function (err) {
      if (err) throw new Error("Error al crear la sesión.");

      return res.redirect("/");
    });
  } catch (error) {
    req.flash("mensajes", [{ msg: error.message }]);
    return res.redirect("/auth/login");
  }
};

const logOut = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }

    return res.redirect("/auth/login");
  });
};

module.exports = {
  loginForm,
  registerForm,
  registerUser,
  confirmAc,
  loginUser,
  logOut,
};
