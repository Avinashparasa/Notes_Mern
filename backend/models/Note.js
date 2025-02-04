const mongoose = require("mongoose");

delete mongoose.connection.models["Note"];

const noteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    default: "General",
  },
  audio: {
    type: String,
    default: null,
  },
  image: {
    type: String,
    default: null,
  },
  image1: {
    type: String,
    default: null,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  favourite: {
    type: Boolean,
    default: false,
  },
});
const Note = mongoose.model("Note", noteSchema);
module.exports = Note;
