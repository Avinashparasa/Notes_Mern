const express = require("express");
const fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");
const multer = require("multer");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Store files in the 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });


router.get("/fetchnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.status(200).send(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
});


router.post(
  "/addnote",
  fetchuser,
  
  upload.fields([{ name: "audio" }, { name: "image" },{name:"image1"}]),
  async (req, res) => {
    try {
      console.log("Received Data:", req.body);
      console.log("Files Uploaded:", req.files);

      const { title, description, tag } = req.body;

      if (!title || !description) {
        return res.status(400).json({ error: "Title and Description are required" });
      }

      const audioPath = req.files?.audio?.[0]?.path || null;
      const imagePath = req.files?.image?.[0]?.path || null;
      const imagePath1 = req.files?.image1?.[0]?.path || null;

      const note = new Note({
        user: req.user.id,
        title,
        description,
        tag,
        audio: audioPath,
        image: imagePath,
        image1:imagePath1
      });

      const savedNote = await note.save();
      res.status(201).send(savedNote);
    } catch (error) {
      console.error("Error adding note:", error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  }
);

// notes.js

// Update the PUT route to handle image1
router.put(
  "/updatenote/:id",
  fetchuser,
  upload.fields([{ name: "audio" }, { name: "image" }, { name: "image1" }]), // Add image1 to the upload fields

  async (req, res) => {
    const { title, description, tag } = req.body;
    
    try {
      let note = await Note.findById(req.params.id);
      if (!note) {
        return res.status(404).send({ error: "Note Not Found" });
      }
      if (note.user.toString() !== req.user.id) {
        return res.status(401).send({ error: "Not Authorized" });
      }

      // Prepare updated note data
      const newNote = {};
      if (title) newNote.title = title;
      if (description) newNote.description = description;
      if (tag) newNote.tag = tag;
      if (req.files?.audio) newNote.audio = req.files.audio[0].path;
      if (req.files?.image) newNote.image = req.files.image[0].path;
      if (req.files?.image1) newNote.image1 = req.files.image1[0].path; // Handle image1

      // Update note in DB
      note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
      res.status(200).send(note);
    } catch (error) {
      console.error(error.message);
      res.status(500).send({ error: "Internal Server Error" });
    }
  }
);


router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send({ error: "Note Not Found" });
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send({ error: "Not Authorized" });
    }
    await Note.findByIdAndDelete(req.params.id);
    res.status(200).send({ message: "Note has been deleted", noteId: req.params.id });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

router.delete("/deleteallnotes", fetchuser, async (req, res) => {
  try {
    await Note.deleteMany({ user: req.user.id });
    res.status(200).send({ message: "All notes have been deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
});



router.put("/togglenotefavourite/:id", fetchuser, async (req, res) => {
  
  try {
    
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send({ error: "Note Not Found" });
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send({ error: "Not Authorized" });
    }

    // Toggle the favourite status
    note.favourite = !note.favourite;
    
    const updatedNote = await note.save();
    
    res.status(200).send(updatedNote);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

router.get("/fetchfavourites", fetchuser, async (req, res) => {
  try {
    const favouriteNotes = await Note.find({ user: req.user.id, favourite: true });
    res.status(200).send(favouriteNotes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

module.exports = router;