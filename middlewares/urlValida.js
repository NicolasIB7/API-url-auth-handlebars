const {URL} = require('url');

const urlValidar= (req, res, next) => {
try {
    const {origin} = req.body;
    const urlFront= new URL(origin);
    if(urlFront.origin!=="null"){
        if(urlFront.protocol==="http:"||urlFront.protocol=="https:"){
        return next();
        }
    }
    else{
         throw new Error(" No válida")
    }
    
} catch (error) {
    return res.send( "url no válida")
}


}

module.exports = urlValidar;