const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport"); // se utiliza para la creación de las sesiones.Cada vez que hagamos el login, passport crea la sesión.
const csrf = require("csurf"); // middleware para validar que los datos que adquiera del body sean traidos del formulario de mi página.
const app = express();
const { create } = require("express-handlebars");
const routes = require("../src/routes/index.js");
const clientDB = require("../database/db.js");
const MongoStore = require("connect-mongo");
const mongoSanitize = require("express-mongo-sanitize");  //Agregar seguridad a las sesiones, evitamos mongoDB injection.
const cors = require("cors");

const corsOptions = {
  credentials: true,
  origin: process.env.PATHHEROKU || "*",
  methods: ["GET", "POST"]
};

app.use(cors(corsOptions));

app.use(
  session({
    secret: process.env.SECRETSESSION,
    resave: false,
    saveUninitialized: false,
    name: "secreto-nombre-session",
    store: MongoStore.create({
      clientPromise: clientDB,
      dbName:process.env.DBNAME
    }),
    cookie: { secure: true, maxAge: 30 * 24 * 60 * 60 * 1000 },
    
  })
);

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, { id: user._id, userName: user.userName });
});

passport.deserializeUser(async (user, done) => {
  return done(null, user);
});

const hbs = create({
  extname: ".hbs",
  partialsDir: ["views/components"],
});

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", "./views");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(csrf());
app.use(mongoSanitize());

app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken(); //variable global para las vistas.
  res.locals.mensajes = req.flash("mensajes");
  next();
});

app.use(express.static("public"));
app.use("/", routes);

module.exports = app;
