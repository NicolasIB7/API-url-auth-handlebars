const { Router } = require("express");
const { leerUrls, agregarUrls, eliminarUrls, editarUrls, editarUrlForm, redirect } = require("./homeControllers");
const urlValidar = require("../../middlewares/urlValida");
const router = Router();





router.get("/", leerUrls)
router.post("/", urlValidar, agregarUrls)
router.get("/eliminar/:id", eliminarUrls)
router.get("/editar/:id", editarUrls);
router.post("/editar/:id",editarUrlForm);
router.get("/:shortUrl",redirect);






router.get("/login", (req,res)=>{
        res.render("login")
} )




router.get("/auth", (req,res)=>{
        res.render("auth")
} )




module.exports = router;