const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');

//Route 1:  get all notes: GET "/api/notes/fetchallnotes"  Login required
router.get('/fetchallnotes',fetchuser, async(req, res) => {
    try {
        const notes = await Notes.find({user: req.user.id});
        res.json(notes);
    } catch (error) {
        res.json({message: error.message});
        res.status(500).send("Internal server error occured");
    }
})

//Route 2:  add a new note: POST "/api/notes/addnote"  Login required
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

//Route 3:  update an existing note: PUT "/api/notes/updatenote"  Login required
router.put('/updatenote/:id', fetchuser, async(req, res) => {
    const {title, description, tag} = req.body;

    try {
        //create a newNote object
        const newNote = {};
        if(title){
            newNote.title = title;
        }
        if(description){
            newNote.description = description;
        }
        if(tag){
            newNote.tag = tag;
        }

        //find the note to be updated and update it
        let note = await Notes.findById(req.params.id);
        //check if note with given id exist
        if(!note){
            return res.status(404).send("This note is not found");
        }
        //check whether this user owns is note
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Access denied");
        }

        note = await Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true});
        res.json({note});
    } catch (error) {
        res.json({message: error.message});
        res.status(500).send("Internal server error occured");
    }
    
})

//Route 4:  delete an existing note: DELETE "/api/notes/deletenote"  Login required
router.delete('/deletenote/:id', fetchuser, async(req, res) => {
    try {
        
        //find the note to be deleted and delete it
        let note = await Notes.findById(req.params.id);
        //check if note with given id exist
        if(!note){
            return res.status(404).send("This note is not found");
        }
        //check whether this user owns this note
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Access denied");
        }

        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({success: "Note is deleted succussfully", note: note});
    } catch (error) {
        res.json({message: error.message});
        res.status(500).send("Internal server error occured");
    }
    
})

module.exports = router;