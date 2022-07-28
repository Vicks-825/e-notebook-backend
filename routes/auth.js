const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = "Thisissecretstring";

//create a user using: POST "/api/auth/createuser"
router.post('/createuser', [
    body('name', 'Enter name').isLength({ min: 2 }),
    body('username', 'Try another username').isLength({ min: 2 }),
    body('email', 'Enter valid email').isEmail(),
    body('password', 'Password should be more than 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //check whether username or email already exist
    try{
    let user1 = await User.findOne({username: req.body.username});
    let user2 = await User.findOne({email: req.body.email});

    if(user1){
        return res.status(400).json({error: "choose another username"});
    }
    else if(user2){
        return res.status(400).json({error: "This email is already registered"});
    }
    //create new user
    const salt = await bcrypt.genSaltSync(10);
    const secretPass = await bcrypt.hashSync(req.body.password, salt);
    let user = await User.create({
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

//authenticate a user using: POST "/api/auth/login"
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

module.exports = router;