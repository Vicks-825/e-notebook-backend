const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

//create a user using: POST "/api/auth/createuser"
router.post('/createuser', [
    body('name').isLength({ min: 2 }),
    body('username').isLength({ min: 2 }),
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
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
    let user = await User.create({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      })
        res.json(user)
    }
    catch(err){
        res.json({message: err.message});
        res.status(500).send("Some error occured");
    }
})

module.exports = router;