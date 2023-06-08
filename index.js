const app= require("./src/app.js");
require("dotenv").config();
require("./database/db.js")


const PORT  = process.env.PORT || 3001;


app.listen(PORT, ()=>{
    console.log("listening on port " + PORT);
})