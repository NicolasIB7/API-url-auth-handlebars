const express =require("express");
const { Router } = require("express");
const { loginForm, registerForm, registerUser, confirmAc, loginUser } = require("./authController");
const {body} =require("express-validator")
const router = Router();

router.get("/register", registerForm);
router.post("/register",[
    body("userName", "Ingrese un nombre válido").trim().notEmpty().escape(),
    body("email", "Ingrese un email válido").trim().isEmail().normalizeEmail(),
    body("password", "Contraseña con mínimo 6 caracreres").trim().isLength({min:6}).escape().custom((value, {req})=>{
        if(value !== req.body.repassword) {
            throw new Error("No coinciden las contraseñas");
        }else{
        return value}
    })
], registerUser);
router.get("/confirm/:token", confirmAc)
router.get("/login", loginForm)
router.post("/login",[body("email", "Ingrese un email válido").trim().isEmail().normalizeEmail(),
body("password", "Contraseña con mínimo 6 caracreres").trim().isLength({min:6}).escape()

], loginUser)

module.exports= router;