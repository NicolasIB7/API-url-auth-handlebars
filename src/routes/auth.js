const express =require("express");
const { Router } = require("express");
const { loginForm, registerForm, registerUser, confirmAc, loginUser } = require("./authController");

const router = Router();

router.get("/register", registerForm);
router.post("/register", registerUser);
router.get("/confirm/:token", confirmAc)
router.get("/login", loginForm)
router.post("/login", loginUser)

module.exports= router;