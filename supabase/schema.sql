-- ClipForge Supabase Schema

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ENUMS --
CREATE TYPE project_status AS ENUM ('pending', 'processing', 'completed', 'failed');
CREATE TYPE video_source_status AS ENUM ('pending', 'downloaded', 'failed');
CREATE TYPE clip_status AS ENUM ('candidate', 'selected', 'rendering', 'completed', 'failed');
CREATE TYPE job_type AS ENUM ('source', 'transcription', 'ai_analysis', 'render');
CREATE TYPE job_status AS ENUM ('queued', 'processing', 'completed', 'failed', 'cancelled');

-- TABLES --

-- Profiles
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    source_url TEXT NOT NULL,
    thumbnail_url TEXT,
    duration NUMERIC,
    status project_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Videos
CREATE TABLE IF NOT EXISTS videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    source_url TEXT NOT NULL,
    title TEXT,
    description TEXT,
    channel_name TEXT,
    thumbnail_url TEXT,
    duration NUMERIC,
    width INTEGER,
    height INTEGER,
    source_status video_source_status DEFAULT 'pending',
    local_path TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transcript Segments
CREATE TABLE IF NOT EXISTS transcript_segments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    start_time NUMERIC NOT NULL,
    end_time NUMERIC NOT NULL,
    text TEXT NOT NULL,
    segment_index INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transcript_segments_project_time 
ON transcript_segments (project_id, start_time);

-- Transcript Words
CREATE TABLE IF NOT EXISTS transcript_words (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    segment_id UUID NOT NULL REFERENCES transcript_segments(id) ON DELETE CASCADE,
    word TEXT NOT NULL,
    start_time NUMERIC NOT NULL,
    end_time NUMERIC NOT NULL,
    word_index INTEGER NOT NULL
);

-- Clips
CREATE TABLE IF NOT EXISTS clips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    start_time NUMERIC NOT NULL,
    end_time NUMERIC NOT NULL,
    duration NUMERIC,
    score INTEGER CHECK (score >= 0 AND score <= 100),
    reason TEXT,
    hook TEXT,
    status clip_status DEFAULT 'candidate',
    output_path TEXT,
    output_url TEXT,
    thumbnail_path TEXT,
    thumbnail_url TEXT,
    aspect_ratio TEXT DEFAULT '9:16',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Processing Jobs
CREATE TABLE IF NOT EXISTS processing_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    type job_type NOT NULL,
    status job_status DEFAULT 'queued',
    progress INTEGER CHECK (progress >= 0 AND progress <= 100) DEFAULT 0,
    stage TEXT,
    message TEXT,
    error_message TEXT,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TRIGGERS FOR UPDATED_AT --

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_videos_updated_at BEFORE UPDATE ON videos FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_clips_updated_at BEFORE UPDATE ON clips FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_processing_jobs_updated_at BEFORE UPDATE ON processing_jobs FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ROW LEVEL SECURITY (RLS) --

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE transcript_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE transcript_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE clips ENABLE ROW LEVEL SECURITY;
ALTER TABLE processing_jobs ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Projects Policies
CREATE POLICY "Users can view their own projects" ON projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own projects" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own projects" ON projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own projects" ON projects FOR DELETE USING (auth.uid() = user_id);

-- Videos Policies
CREATE POLICY "Users can view their project videos" ON videos FOR SELECT USING (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
);

-- Transcript Segments Policies
CREATE POLICY "Users can view their project transcripts" ON transcript_segments FOR SELECT USING (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
);

-- Transcript Words Policies
CREATE POLICY "Users can view their project transcript words" ON transcript_words FOR SELECT USING (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
);

-- Clips Policies
CREATE POLICY "Users can view their project clips" ON clips FOR SELECT USING (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
);
CREATE POLICY "Users can update their project clips" ON clips FOR UPDATE USING (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
);
CREATE POLICY "Users can delete their project clips" ON clips FOR DELETE USING (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
);

-- Processing Jobs Policies
CREATE POLICY "Users can view their project jobs" ON processing_jobs FOR SELECT USING (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
);


-- STORAGE BUCKETS --

-- Create buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('clips', 'clips', false) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('thumbnails', 'thumbnails', false) ON CONFLICT (id) DO NOTHING;

-- Set up storage RLS (Already enabled by Supabase by default)


-- Storage policies for 'clips' bucket (Users can only access files in their projects, path: /project_id/clip.mp4)
CREATE POLICY "Users can read their own clips" ON storage.objects FOR SELECT USING (
    bucket_id = 'clips' AND 
    (SELECT user_id FROM projects WHERE id::text = (string_to_array(name, '/'))[1]) = auth.uid()
);

-- Storage policies for 'thumbnails' bucket
CREATE POLICY "Users can read their own thumbnails" ON storage.objects FOR SELECT USING (
    bucket_id = 'thumbnails' AND 
    (SELECT user_id FROM projects WHERE id::text = (string_to_array(name, '/'))[1]) = auth.uid()
);

-- Note: In this MVP, all inserts and updates to storage are done via the backend Service Role,
-- which bypasses RLS. So we only need SELECT policies for the authenticated users to download/view files.
