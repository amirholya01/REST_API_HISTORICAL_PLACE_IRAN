const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//const {registerValidation, loginValidation} = require("../validation");
    //register
router.post("/register", async (req, res) => {
   
    //validation the user input(name, email, password)
    const{ error } = registerValidation(req.body);
    if(error)
    {
        res.status(400).send({error : error.details[0].message})
    }
    //check email---is exist
    const emailExist = await User.findOne({ email : req.body.email});
    
    if(emailExist)
    {
        return res.status(400).json({ error : "Email already exists"})
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    //create a user and save in DB
    const userObj = new User(
        {
            name : req.body.name,
            email : req.body.email,
            password 
        }
    );
    try
    {
        const saveUser = await userObj.save();
        res.json({ error : null, data : saveUser._id});
    }catch(error)
    {
        res.status(400).json({ error })
    }

});


//login 
router.post("/login", async (req, res) => {
    //validate user login Info
    const { error } = loginValidation(req.body); 
    // if login is ok, find user
    if (error) {
        return res.status(400).json({ error: error.details[0].message});
    }

    //user does not exist in DB send error
    const userObj = await User.findOne({ email: req.body.email });
    if (!userObj) {
        return res.status(400).json({ error: "Email is wrong"});
    }

     //user exists - check password
     const validPassword = await bcrypt.compare(req.body.password, userObj.password);
    
     //if password is wrong send error
     if (!validPassword) {
         return res.status(400).json({ error: "Password is wrong"});
     }

     //create authentication token with username and id
     const token = jwt.sign(
        {
            name : userObj.name,
            id : userObj._id 
        },
        //token secret, expire
        process.env.TOKEN_SECRET,
        { expiresIn : process.env.JWT_EXPIRE_IN},
     );
      //attach auth token to header
    res.header("auth-token", token).json({
        error: null,
        data: { token}
    });
});

module.exports = router;