const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');

//Route: 1  get all notes: GET "/api/auth/fetchallnotes"  Login required
router.get('/fetchallnotes',fetchuser, async(req, res) => {
    try {
        const notes = await Notes.find({user: req.user.id});
        res.json(notes);
    } catch (error) {
        res.json({message: error.message});
        res.status(500).send("Internal server error occured");
    }
})

//Route: 2  add a new note: POST "/api/auth/addnote"  Login required
router.post('/addnote',fetchuser, [
    body('title', 'Title should be of minimum 2 characters').isLength({ min: 2 }),
    body('description', 'Length of description should be atleast 5').isLength({ min: 5 }),
], async(req, res) => {
    //if there are error, return bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {title, description, tag} = req.body;
    try {
        const note = new Notes({
            title, description, tag, user: req.user.id
        })
        const savedNotes = await note.save();
        res.json(savedNotes);
    } catch (error) {
        res.json({message: error.message});
        res.status(500).send("Internal server error occured");
    }  
})

module.exports = router;