const { nanoid } = require('nanoid');
const Url = require("../../models/Url")

const leerUrls= async (req, res) => {

    try {
        const urls= await Url.find().lean() //el lean hace que ek objeto que me traiga sea de JS sino me trae un objeto tipo mongoose

        res.render("home", {urls})
    } catch (error) {
        console.log(error)
        res.send("Falló algo..")
    }
  
} 
const agregarUrls = async (req, res) => {

    const {origin}= req.body;
    try {
      const shortUrl = nanoid(7);
      const urll = new Url({ origin: origin, shortUrl: shortUrl });
      await urll.save();
      res.redirect("/"); 
    } catch (error) {
      console.log(error);
    }
  };

  const eliminarUrls = async (req, res) =>{
    const {id} = req.params;
    try {

        await Url.findByIdAndDelete(id);
        res.redirect("/");
        
        
    } catch (error) {
        console.log(error);
        res.send("algo falló")
        
    }


  }

  const editarUrls = async (req, res)=>{

    const {id}= req.params;
    try {
      const url = await Url.findById(id).lean();
      res.render("home", {url})



    } catch (error) {
      console.log(error);
        res.send("algo falló")
    }
  }

  const editarUrlForm= async(req,res)=>{
    const {id}= req.params;
    const {origin} =req.body;
try {
  await Url.findByIdAndUpdate(id, {origin:origin} )
  res.redirect("/")
  
} catch (error) {
  console.log(error);
        res.send("algo falló")
}


  }
  

  const redirect = async (req, res) => {
    const { shortUrl } = req.params;
    try {
        const url = await Url.findOne({ shortUrl });
        // console.log(url);
        if (!url?.origin) {
            console.log("no exite");
            return res.send("error no existe el redireccionamiento");
        }

        res.redirect(url.origin);
    } catch (error) {
        console.log(error);
    }
  };
  

module.exports={
    leerUrls,
    agregarUrls,
    eliminarUrls,
    editarUrls,
    editarUrlForm,
    redirect
}