# ClipForge - AI Automatic Video Clip Generator

Turn long videos into scroll-stopping clips with AI.

## Requirements

* Node.js (v18+)
* Python 3.10+ (for `faster-whisper` transcription)
* FFmpeg (must be in system PATH)
* `yt-dlp` (must be in system PATH)
* Supabase account
* Gemini API key

## Installation

### 1. Database Setup (Supabase)
1. Create a new project in [Supabase](https://supabase.com/).
2. Go to the SQL Editor.
3. Open `supabase/schema.sql` from this repository.
4. Copy the entire contents, paste it into the SQL Editor, and click **Run**.
5. Go to Project Settings -> API to get your `URL`, `anon` key, and `service_role` key.

### 2. Backend Setup
```bash
cd server
npm install

# Install faster-whisper (requires Python)
# Create a virtual environment if needed
pip install faster-whisper
```
Configure your environment variables:
Copy `.env.example` to `.env` in the root folder, and fill in the details.

### 3. Frontend Setup
```bash
cd client
npm install
```

## Running the Application

Start the backend:
```bash
cd server
npm run dev
```

Start the frontend:
```bash
cd client
npm run dev
```

Visit `http://localhost:5173` in your browser.
# clipforge
