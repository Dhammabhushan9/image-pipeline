# MERN Stack Image Inpainting Project

A full-stack application for creating and managing image inpainting masks using the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- Upload images
- Draw masks using an interactive canvas
- Adjustable brush size
- Gallery view of previous image/mask pairs
- MongoDB for data persistence
- Real-time updates using React Query

## Tech Stack

### Frontend
- React with TypeScript
- Vite
- Tailwind CSS
- Fabric.js for canvas manipulation
- React Query for data fetching
- Axios for API calls
- Lucide React for icons

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Multer for file uploads

## Setup

1. Install MongoDB locally or use MongoDB Atlas

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd server
   npm install
   ```

4. Create an `uploads` directory in the server folder:
   ```bash
   cd server
   mkdir uploads
   ```

5. Start the backend server:
   ```bash
   cd server
   npm run dev
   ```

6. Start the frontend development server:
   ```bash
   npm run dev
   ```

7. Open http://localhost:5173 in your browser

## Project Structure

```
├── src/                  # Frontend code
│   ├── api/             # API client functions
│   ├── components/      # React components
│   └── App.tsx         # Main application component
├── server/              # Backend code
│   ├── config/         # Database configuration
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── uploads/        # Uploaded images
│   └── server.js       # Express server
└── README.md
```

## Development

- Frontend runs on  https://image-pipeline-pu4w.vercel.app/
- Backend runs on  https://image-pipeline-plum.vercel.app/
- Images are stored in `server/uploads/`
- MongoDB runs on default port 27017

## API Endpoints

- `POST /api/images` - Upload a new image pair
- `GET /api/images` - Get all image pairs
