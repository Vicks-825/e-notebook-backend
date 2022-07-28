const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

//create a user using: POST "/api/auth/"
router.post('/', [
    body('name').isLength({ min: 2 }),
    body('username').isLength({ min: 2 }),
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    User.create({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      }).then(user => res.json(user));
})

module.exports = router;