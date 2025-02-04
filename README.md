# 📝 Note-Taking Web App

A feature-rich note-taking web application built using **React.js** with authentication, search, sorting, and CRUD functionalities. It also supports text, URL, and audio input (transcribed via the Browser Web Speech API).

## Features

- **User Authentication** (Sign up, Sign in, Logout)
- **Create, Read, Update, Delete (CRUD)** notes
- **Search & Sort** notes for quick access
- **Voice Input** using the Browser Web Speech API
- **MongoDB Integration** for persistent storage

## Tech Stack

- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Token)
- **Speech-to-Text:** Browser Web Speech API


For Backend

1.Create .env file in backend folder:  
 PORT = 5001  
 JWT_SECRET_KEY =99aacfa9714eff2ccb40db2b7943701753b6ee18d3bffc6ec2ad264b9a18acfc  
2.Start the backend:

```bash
  npm install
  node index.js
```

For Frontend

1.Create .env file in main folder(root) workspace:  
 REACT_APP_AUTH_HOST = "BASE_URL/api/auth"  
 REACT_APP_NOTES_HOST = "BASE_URL/api/notes"  
 REACT_APP_BASE_URL="BASE_URL" //backendurl(BASE_URL)  
2.Start the frontend:

```bash
  npm install
  npm start
```
