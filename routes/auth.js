const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = "Thisissecretstring";

//Route:1  create a user using: POST "/api/auth/createuser" No login required
router.post('/createuser', [
    body('name', 'Enter name').isLength({ min: 2 }),
    body('email', 'Enter valid email').isEmail(),
    body('password', 'Password should be more than 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    //if there are error, return bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //check whether email already exist
    try{
    let user = await User.findOne({email: req.body.email});

    if(user){
        return res.status(400).json({error: "This email is already registered"});
    }
    //create new user
    const salt = await bcrypt.genSaltSync(10);
    const secretPass = await bcrypt.hashSync(req.body.password, salt);
    user = await User.create({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: secretPass,
      })
        const data = {
            user:{
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        
        //res.json(user)
        res.json({authToken});
    }
    catch(err){
        res.json({message: err.message});
        res.status(500).send("Internal server error occured");
    }
})

//Route: 2  authenticate a user using: POST "/api/auth/login" No login required
router.post('/login', [
    body('email', 'Enter valid email').isEmail(),
    body('password', 'Enter valid password').isLength({ min: 5 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {email, password} = req.body;
    try {
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({error: "Login with correct credentials"});
        }

        const isValidPass = await bcrypt.compare(password, user.password);
        if(!isValidPass){
            return res.status(400).json({error: "Login with correct credentials"});
        }

        const data = {
            user:{
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({authToken});

    } catch (error) {
        res.json({message: error.message});
        res.status(500).send("Internal server error occured");
    }
})

//Route: 3  get user deatails: POST "/api/auth/getuser"  Login required
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        let userId = req.user.id;
        const user = await User.findById(userId).select("-password");

        res.send(user);

    } catch (error) {
        res.json({message: error.message});
        res.status(500).send("Internal server error occured");
    }

})


module.exports = router;