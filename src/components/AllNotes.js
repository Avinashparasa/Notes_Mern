import React, { useContext, useEffect, useRef, useState } from "react";
import NoteContext from "../context/notes/noteContext";
import NoteItem from "./NoteItem";
import { useNavigate } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const AllNotes = () => {
  let navigate = useNavigate();
  const context = useContext(NoteContext);
  const { notes, getNotes, editNote, toggleFavourite } = context;
  
  const [searchQuery, setSearchQuery] = useState(""); 
  const [sortOrder, setSortOrder] = useState("newest"); 

  useEffect(() => {
    if (localStorage.getItem("auth-token")) {
      
      getNotes();
      // loadFavourites();
    } else {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []);

  const ref = useRef(null);
  const refClose = useRef(null);
  const modalRef = useRef(null); // Ref for the modal element
  const modalDialogRef = useRef(null); // Ref for the modal dialog element

  const [note, setNote] = useState({
    eid: "",
    etitle: "",
    edescription: "",
    efavourite: "",
    etag: "",
    eimage: null,
    eimage1: null,
    eaudio: null,
    previewImage: null,
    previewImage1: null,
    previewAudio: null,
  });

  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);
  const audioRef = useRef(null);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join("");
        setTranscript(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
      };
    } else {
      console.warn("Speech Recognition not supported in this browser.");
    }
  }, []);

  // Handle audio play event
  const handleAudioPlay = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  // Handle audio pause/end event
  const handleAudioPause = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const [fav, setFav] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (modalDialogRef.current) {
        modalDialogRef.current.classList.remove("modal-lg");
        modalDialogRef.current.classList.add("modal-fullscreen");
      }
      setIsFullscreen(true);
    } else {
      if (modalDialogRef.current) {
        modalDialogRef.current.classList.remove("modal-fullscreen");
        modalDialogRef.current.classList.add("modal-lg");
      }
      setIsFullscreen(false);
    }
  };

  // const loadFavourites = () => {
  //   const storedFavourites =
  //     JSON.parse(localStorage.getItem("favouriteNotes")) || [];
  //   setFavourites(storedFavourites);
  // };

  const updateNote = (currentNote) => {
    ref.current.click();
    setNote({
      eid: currentNote._id,
      etitle: currentNote.title,
      edescription: currentNote.description,
      efavourite: currentNote.favourite,
      etag: currentNote.tag,
      eimage: currentNote.image ? `${BASE_URL}${currentNote.image}` : null,
      eimage1: currentNote.image1 ? `${BASE_URL}${currentNote.image1}` : null,
      eaudio: currentNote.audio ? `${BASE_URL}${currentNote.audio}` : null,
      previewImage: currentNote.image ? `${BASE_URL}${currentNote.image}` : null,
      previewImage1: currentNote.image1 ? `${BASE_URL}${currentNote.image1}` : null,
      previewAudio: currentNote.audio ? `${BASE_URL}${currentNote.audio}` : null,
    });

    setFav(currentNote.favourite);
  };

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  const favchange = () => {
    setFav((prevFav) => !prevFav);
    toggleFavourite(note.eid);
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (!file) return;

    const previewURL = URL.createObjectURL(file);

    if (name === "eimage") {
      setNote({ ...note, eimage: file, previewImage: previewURL });
    } else if (name === "eimage1") {
      
      setNote({ ...note, eimage1: file, previewImage1: previewURL });
      console.log(note)
    } else if (name === "eaudio") {
      setNote({ ...note, eaudio: file, previewAudio: previewURL });
    }
  };

  const handleUpdateNote = (e) => {
    e.preventDefault();
    if (note.etag === "") {
      note.etag = "General";
    }
    editNote(
      note.eid,
      note.etitle,
      note.edescription,
      note.etag,
      note.eaudio,
      note.eimage,
      note.eimage1,
      transcript
    );
    refClose.current.click();
  };

  // Filter notes based on search query
  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort notes based on sortOrder
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className="row my-3">
      <button
        ref={ref}
        type="button"
        className="btn btn-primary d-none"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Launch demo modal
      </button>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        ref={modalRef}
      >
        <div className="modal-dialog modal-lg" ref={modalDialogRef}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Note</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group my-3">
                  <label htmlFor="etitle">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="etitle"
                    name="etitle"
                    placeholder="Enter title"
                    onChange={onChange}
                    value={note.etitle}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edescription">
                    Description/Transcription
                  </label>
                  <textarea
                    className="form-control"
                    id="edescription"
                    name="edescription"
                    placeholder="Enter description"
                    onChange={onChange}
                    value={note.edescription}
                    rows={5}
                    style={{ resize: "none" }}
                  />
                </div>
                <div className="form-group my-3">
                  <label htmlFor="etag">Tag</label>
                  <input
                    type="text"
                    className="form-control"
                    id="etag"
                    name="etag"
                    placeholder="Enter your custom tag"
                    onChange={onChange}
                    value={note.etag}
                  />
                </div>

                {/* Display & Replace Image */}
                <div className="form-group my-3">
                  <label>Current Image</label>
                  {note.previewImage ? (
                    <div className="relative w-full h-40 overflow-hidden rounded-md border border-gray-300">
                      <img
                        src={note.previewImage}
                        alt="Current Note"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <p>No image uploaded</p>
                  )}
                  <input
                    type="file"
                    name="eimage"
                    className="form-control mt-2"
                    onChange={handleFileChange}
                  />
                </div>
                <div className="form-group my-3">
                  <label>Current Image 1</label>
                  {note.previewImage1 ? (
                    <div className="relative w-full h-40 overflow-hidden rounded-md border border-gray-300">
                      <img
                        src={note.previewImage1}
                        alt="Current Note"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <p>No image uploaded</p>
                  )}
                  <input
                    type="file"
                    name="eimage1"
                    className="form-control mt-2"
                    onChange={handleFileChange}
                  />
                </div>

                {/* Display & Replace Audio */}
                <div className="form-group my-3">
                  <label>Current Audio</label>
                  {note.previewAudio ? (
                    <>
                      <audio
                        ref={audioRef}
                        controls
                        style={{ width: "100%" }}
                        key={note.eid}
                        onPlay={handleAudioPlay}
                        onPause={handleAudioPause}
                        onEnded={handleAudioPause}
                      >
                        <source
                          src={note.previewAudio.replace(/\\/g, "/")}
                          type="audio/mpeg"
                        />
                        Your browser does not support the audio element.
                      </audio>
                    </>
                  ) : (
                    <p>No audio uploaded</p>
                  )}
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary me-2"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? "Exit Fullscreen" : "Go Fullscreen"}
              </button>

              <button
                ref={refClose}
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>

              <button className="btn btn-warning mx-2" onClick={favchange}>
                {fav ? "Make Unfavourite" : "Make Favourite"}
              </button>
              <button
                disabled={
                  note.etitle.length < 3 || note.edescription.length < 4
                }
                type="button"
                className="btn btn-primary"
                onClick={handleUpdateNote}
              >
                Update Note
              </button>
            </div>
          </div>
        </div>
      </div>

      <h2>Your Notes</h2>
      {/* Search Input Field and Sorting Options */}
      <div className="container mx-3 my-3 d-flex align-items-center gap-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1 }}
        />
        <select
          className="form-select"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          style={{ width: "auto" }}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>
      <div className="container mx-3 my-3">
        <h3 className="text-center">
          {sortedNotes.length === 0 && "No notes to display!!"}
        </h3>
      </div>
      <div className="d-flex flex-wrap gap-6">
        {sortedNotes.map((note) => (
          <NoteItem
            key={note._id}
            note={note}
            updateNote={updateNote}
            toggleFavourite={toggleFavourite}
            what={true}
          />
        ))}
      </div>
    </div>
  );
};

export default AllNotes;