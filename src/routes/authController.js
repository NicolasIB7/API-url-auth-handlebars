const User = require("../../models/User");
const {nanoid} = require("nanoid")

const registerForm=(req,res) => {
    res.render('register')

}

const registerUser = async (req,res) => {
    const {userName, email, password} = req.body;
try {

    let user= await User.findOne({email:email})
    if(user) throw new Error ("ya esxiste el usuario")

    user= new User({userName, email, password, tokenConfirm:nanoid()})
    await user.save();
    res.redirect("/login")


    
} catch (error) {
    res.json({error: error.message})
}
}

const confirmAc= async (req,res)=>{

    const {token} =req.params;

    try {
        const user= await User.findOne({tokenConfirm:token});
        if(!user) throw new Error("No existe el usuario")

        user.confirm = true;
        user.tokenConfirm=null;  // lo dejo de vuelta en null para cuando quiera reestablecer la contraseña.

        await user.save();

        res.redirect("/login");
        
    } catch (error) {
        res.json({error: error.message})
    }
}

const loginForm=(req,res) => {





    res.render("login")

}

const loginUser = async (req, res) => {

    const {email, password} = req.body;

try {

    const user = await User.findOne({ email: email});
    if(!user) throw new Error("No existe este email")

    if(!user.confirm) throw new Error("Falta confirmar cuenta")

    if(!await user.comparePassword(password)) throw new Error("Contraseña incorrecta");

    res.redirect("/")

    
} catch (error) {
    res.send(error.message)
    
}

}

module.exports={
    loginForm,
    registerForm,
    registerUser,
    confirmAc,
    loginUser
}