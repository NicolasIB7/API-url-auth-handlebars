const express =require("express");
const app = express();
const { create} =require("express-handlebars")
const routes=require("../src/routes/index.js")
const path = require('path');



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