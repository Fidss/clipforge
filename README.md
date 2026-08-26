<div align="center">
  <img src="public/favicon.svg" alt="ClipForge Logo" width="100" />
  <h1>ClipForge</h1>
  <p><strong>Turn long videos into scroll-stopping clips with AI</strong></p>
  <p>ClipForge is an automated video processing platform that utilizes Artificial Intelligence to transcribe, analyze, and generate engaging short-form content from long videos.</p>
</div>

<br/>

## Features

- **Automated Clipping**: Uses Gemini AI to find the most engaging parts of a video.
- **Smart Transcription**: Highly accurate speech-to-text powered by `faster-whisper`.
- **Dynamic Subtitles**: Auto-generates and renders styled subtitles onto the clips.
- **Seamless Integrations**: Natively supports YouTube downloads via `yt-dlp`.
- **Real-time Processing**: Track the progress of your video generation in real-time.

## Tech Stack

**Frontend**
- React 18 & Vite
- Vanilla CSS / Modern UI

**Backend**
- Node.js & Express
- Python 3.10 (Transcription engine)
- FFmpeg (Video processing & rendering)

**Database & Auth**
- Supabase (PostgreSQL & Authentication)

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- Node.js (v18 or higher)
- Python (v3.10 or higher)
- [FFmpeg](https://ffmpeg.org/download.html) (must be added to system PATH)
- [yt-dlp](https://github.com/yt-dlp/yt-dlp) (must be added to system PATH)
- Supabase account and project
- Google Gemini API key

## Installation

### 1. Database Setup
1. Create a new project in [Supabase](https://supabase.com/).
2. Navigate to the SQL Editor in your Supabase dashboard.
3. Open `supabase/schema.sql` from this repository.
4. Copy the contents, paste them into the SQL Editor, and click **Run**.
5. Go to **Project Settings -> API** to retrieve your `Project URL`, `anon public` key, and `service_role` secret.

### 2. Environment Variables
Copy the example environment file and fill in your credentials.
```bash
cp .env.example .env
```
Update `.env` with your Supabase keys, Gemini API key, and other required configurations.

### 3. Backend Setup
Navigate to the server directory and install the Node dependencies:
```bash
cd server
npm install
```

Install the required Python packages for transcription:
```bash
pip install faster-whisper
```

### 4. Frontend Setup
Return to the root directory and install the frontend dependencies:
```bash
npm install
```

## Running the Application

You will need two terminal instances to run both the frontend and backend servers simultaneously.

**Start the Backend Server:**
```bash
cd server
npm run dev
```

**Start the Frontend Server (in a new terminal):**
```bash
npm run dev
```

The web application will be available at `http://localhost:5173`.

## Architecture Overview

1. **Upload / Download**: The system accepts direct file uploads or downloads via YouTube URL.
2. **Transcription**: The audio is extracted and passed to the Python `faster-whisper` script to generate word-level timestamps.
3. **AI Analysis**: The transcript is sent to Google Gemini, which identifies the most viral-worthy segments.
4. **Rendering**: FFmpeg slices the video and overlays the generated subtitles perfectly synced with the audio.

<div align="center">
  <br />
  <p>Built for modern content creators.</p>
</div>
