const express =require("express");
const session = require("express-session");
const flash = require("connect-flash");
const app = express();
const { create} =require("express-handlebars")
const routes=require("../src/routes/index.js")

app.use(session({
  secret: "rocco rocco",
  resave:false,
  saveUnitialized:false,
  name: "secret-name-rocco"
}))

app.use(flash())



const hbs = create({
  extname: ".hbs",
  partialsDir: ["views/components"]
});

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", "./views");


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


 
app.use(express.static('public'));
  app.use("/", routes)
  
  


  


module.exports = app;