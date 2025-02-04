import React, { useContext, useRef, useState } from 'react';
import { FaTrash, FaUserMinus, FaKey } from 'react-icons/fa'; // Import icons
import NoteContext from '../context/notes/noteContext';

const Settings = () => {
  document.title = "MyNottebok - Settings";
  const noteContext = useContext(NoteContext);
  const { deleteAllNotes} = noteContext;

  const [password, setPassword] = useState({ opassword: '', npassword: '', cpassword: '' });
  const modalCloseRef = useRef(null);

  const handleDeleteAllNotes = () => {
    if (window.confirm('Are you sure you want to delete all notes?')) {
      deleteAllNotes();
    }
  };

 

  const onChange = (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };

  return (
    <div className='container'>
      <h1 className='text-center mb-4'>Settings</h1>
      <p className='text-muted text-center'>Only accessible if logged in.</p>
      <div className='danger-zone p-3 mb-4'>
        <h2 className='text-danger mb-3'>Want to delete all notes.</h2>
        <div className='table-responsive'>
          <table className='table'>
            <tbody>
          
              <tr>
                <td>Delete my all notes:</td>
                <td>
                  <button className='btn btn-danger' onClick={handleDeleteAllNotes}>
                    <FaTrash className='me-1' /> Delete All Notes
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Change Password Modal */}
    </div>
  );
};

export default Settings;