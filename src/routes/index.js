const { Router } = require("express");

const {
  leerUrls,
  agregarUrls,
  eliminarUrls,
  editarUrls,
  editarUrlForm,
  redirect,
} = require("./homeControllers");
const authRoutes = require("./auth");
const urlValidar = require("../../middlewares/urlValida");
const verificarUsers = require("../../middlewares/verificarUsers");
const { formPerfil, editPerfil } = require("./perfilController");
const router = Router();

router.get("/", verificarUsers, leerUrls); //Con ese middleware la ruta estará protegida.
router.post("/", verificarUsers, urlValidar, agregarUrls);
router.get("/eliminar/:id", verificarUsers, eliminarUrls);
router.get("/editar/:id", verificarUsers, editarUrls);
router.post("/editar/:id", verificarUsers, urlValidar, editarUrlForm);
router.get("/perfil",verificarUsers,formPerfil)
router.post("/perfil",verificarUsers,editPerfil)

router.get("/:shortUrl", redirect);


router.use("/auth", authRoutes);

module.exports = router;
