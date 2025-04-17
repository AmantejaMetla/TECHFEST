-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'participant',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    password_temp VARCHAR(255)
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(title, start_date),
    CONSTRAINT valid_dates CHECK (end_date >= start_date)
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create sponsors table
CREATE TABLE IF NOT EXISTS sponsors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    logo_url VARCHAR(255),
    website_url VARCHAR(255),
    sponsorship_level VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create judges table
CREATE TABLE IF NOT EXISTS judges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(255),
    bio TEXT,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create participants table
CREATE TABLE IF NOT EXISTS participants (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    bio TEXT,
    avatar_url VARCHAR(255),
    event_id INTEGER REFERENCES events(id),
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create event_categories table
CREATE TABLE IF NOT EXISTS event_categories (
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (event_id, category_id)
);

-- Create event_sponsors table
CREATE TABLE IF NOT EXISTS event_sponsors (
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    sponsor_id INTEGER REFERENCES sponsors(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (event_id, sponsor_id)
);

-- Create event_judges table
CREATE TABLE IF NOT EXISTS event_judges (
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    judge_id INTEGER REFERENCES judges(id) ON DELETE CASCADE,
    role VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (event_id, judge_id)
);

-- Create event_participants table
CREATE TABLE IF NOT EXISTS event_participants (
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    participant_id INTEGER REFERENCES participants(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'registered',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (event_id, participant_id)
);

-- Create results table
CREATE TABLE IF NOT EXISTS results (
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    participant_id INTEGER REFERENCES participants(id) ON DELETE CASCADE,
    position INTEGER,
    score DECIMAL(5,2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (event_id, participant_id)
);

-- Create tweets table
CREATE TABLE IF NOT EXISTS tweets (
    id SERIAL PRIMARY KEY,
    tweet_id VARCHAR(255) NOT NULL UNIQUE,
    content TEXT NOT NULL,
    author_name VARCHAR(255) NOT NULL,
    author_handle VARCHAR(255) NOT NULL,
    author_image_url VARCHAR(255),
    created_at TIMESTAMP NOT NULL,
    fetched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample users
INSERT INTO users (username, email, password, role) 
VALUES
('admin', 'admin@techfest.com', '$2b$10$YourHashedPasswordHere', 'admin'),
('organizer1', 'organizer1@techfest.com', '$2b$10$YourHashedPasswordHere', 'organizer'),
('organizer2', 'organizer2@techfest.com', '$2b$10$YourHashedPasswordHere', 'organizer'),
('judge1', 'judge1@techfest.com', '$2b$10$YourHashedPasswordHere', 'user'),
('judge2', 'judge2@techfest.com', '$2b$10$YourHashedPasswordHere', 'user'),
('participant1', 'john@example.com', '$2b$10$YourHashedPasswordHere', 'participant'),
('participant2', 'jane@example.com', '$2b$10$YourHashedPasswordHere', 'participant'),
('participant3', 'mike@example.com', '$2b$10$YourHashedPasswordHere', 'participant')
ON CONFLICT (email) DO NOTHING;

-- Insert sample categories (prevent duplicates on name)
INSERT INTO categories (name, description) 
VALUES
('Hackathon', 'Coding and development competitions'),
('Workshop', 'Educational and training sessions'),
('Showcase', 'Project demonstrations and exhibitions'),
('Networking', 'Professional networking events'),
('Pitch Competition', 'Startup and business idea pitches'),
('Career Fair', 'Job opportunities and career development')
ON CONFLICT (name) DO NOTHING;

-- Insert sample sponsors (prevent duplicates on name)
INSERT INTO sponsors (name, logo_url, website_url, sponsorship_level) 
VALUES
('TechCorp', 'https://example.com/techcorp-logo.png', 'https://techcorp.com', 'Platinum'),
('DevSolutions', 'https://example.com/devsol-logo.png', 'https://devsolutions.com', 'Gold'),
('InnovateLabs', 'https://example.com/innovatelabs-logo.png', 'https://innovatelabs.com', 'Silver'),
('CodeWorks', 'https://example.com/codeworks-logo.png', 'https://codeworks.com', 'Bronze'),
('FutureTech', 'https://example.com/futuretech-logo.png', 'https://futuretech.com', 'Gold')
ON CONFLICT (name) DO NOTHING;

-- Insert sample events (prevent duplicates on title and start_date)
INSERT INTO events (title, start_date, end_date, description, image_url) 
VALUES
('Hackathon 2024', '2024-03-15 09:00:00+00', '2024-03-15 17:00:00+00', 'Annual coding competition', 'assets/images/hackathon.jpg'),
('AI Workshop', '2024-03-16 10:00:00+00', '2024-03-16 12:00:00+00', 'Introduction to AI and ML', 'assets/images/ai-workshop.jpg'),
('Innovation Showcase', '2024-03-17 14:00:00+00', '2024-03-17 18:00:00+00', 'Project demonstrations', 'assets/images/showcase.jpg'),
('Networking Event', '2024-03-18 18:00:00+00', '2024-03-18 20:00:00+00', 'Industry networking opportunity', 'assets/images/networking.jpg'),
('Startup Pitch', '2024-03-19 10:00:00+00', '2024-03-19 14:00:00+00', 'Startup pitch competition', 'assets/images/pitch.jpg')
ON CONFLICT (title, start_date) DO NOTHING;

-- Insert sample judges (prevent duplicates on name)
INSERT INTO judges (name, bio, title, image_url, twitter_handle) 
VALUES
('Dr. Sarah Johnson', 'AI Researcher with 10+ years experience', 'Lead AI Researcher', 'assets/images/professionals.jpg', '@DrSarahJ'),
('Alex Chen', 'Senior Software Engineer at TechCorp', 'Senior Engineer', 'assets/images/hackathon2.jpg', '@AlexCTech'),
('Maria Rodriguez', 'Startup Founder and Tech Investor', 'CEO', 'assets/images/workshop1.jpg', '@MariaRCEO'),
('Dr. James Wilson', 'Expert in IoT and embedded systems', 'Head of Innovation', 'assets/images/winners2.jpg', '@JWilsonTech'),
('Dr. Aisha Patel', 'Specializes in big data analytics and machine learning applications', 'Research Lead', 'assets/images/workshop.jpg', '@AishaDataSci')
ON CONFLICT (name) DO NOTHING;

-- Insert sample participants (prevent duplicates on email)
-- First get user IDs
DO $$
DECLARE 
    admin_id UUID;
    organizer1_id UUID;
    organizer2_id UUID;
    participant1_id UUID;
    participant2_id UUID;
    participant3_id UUID;
BEGIN
    SELECT id INTO admin_id FROM users WHERE username = 'admin';
    SELECT id INTO organizer1_id FROM users WHERE username = 'organizer1';
    SELECT id INTO organizer2_id FROM users WHERE username = 'organizer2';
    SELECT id INTO participant1_id FROM users WHERE username = 'participant1';
    SELECT id INTO participant2_id FROM users WHERE username = 'participant2';
    SELECT id INTO participant3_id FROM users WHERE username = 'participant3';
    
    INSERT INTO participants (user_id, name, email, phone, bio, avatar_url) 
    VALUES
    (admin_id, 'Admin User', 'admin@techfest.com', '+1234567890', 'Admin bio', 'assets/images/admin.jpg'),
    (organizer1_id, 'Organizer One', 'organizer1@techfest.com', '+1987654321', 'Organizer bio', 'assets/images/org1.jpg'),
    (organizer2_id, 'Organizer Two', 'organizer2@techfest.com', '+1122334455', 'Organizer bio', 'assets/images/org2.jpg'),
    (participant1_id, 'John Smith', 'john@example.com', '+1555666777', 'Software developer with focus on AI', 'assets/images/john.jpg'),
    (participant2_id, 'Jane Doe', 'jane@example.com', '+1777888999', 'UX designer and frontend developer', 'assets/images/jane.jpg'),
    (participant3_id, 'Mike Johnson', 'mike@example.com', '+1444333222', 'Full-stack developer and entrepreneur', 'assets/images/mike.jpg')
    ON CONFLICT (email) DO NOTHING;
END $$;

-- Link events with categories
INSERT INTO event_categories (event_id, category_id)
SELECT e.id, c.id
FROM events e, categories c
WHERE e.title = 'Hackathon 2024' AND c.name = 'Hackathon'
ON CONFLICT (event_id, category_id) DO NOTHING;

INSERT INTO event_categories (event_id, category_id)
SELECT e.id, c.id
FROM events e, categories c
WHERE e.title = 'AI Workshop' AND c.name = 'Workshop'
ON CONFLICT (event_id, category_id) DO NOTHING;

INSERT INTO event_categories (event_id, category_id)
SELECT e.id, c.id
FROM events e, categories c
WHERE e.title = 'Innovation Showcase' AND c.name = 'Showcase'
ON CONFLICT (event_id, category_id) DO NOTHING;

INSERT INTO event_categories (event_id, category_id)
SELECT e.id, c.id
FROM events e, categories c
WHERE e.title = 'Networking Event' AND c.name = 'Networking'
ON CONFLICT (event_id, category_id) DO NOTHING;

INSERT INTO event_categories (event_id, category_id)
SELECT e.id, c.id
FROM events e, categories c
WHERE e.title = 'Startup Pitch' AND c.name = 'Pitch Competition'
ON CONFLICT (event_id, category_id) DO NOTHING;

-- Link events with sponsors
INSERT INTO event_sponsors (event_id, sponsor_id)
SELECT e.id, s.id
FROM events e, sponsors s
WHERE e.title = 'Hackathon 2024' AND s.name = 'TechCorp'
ON CONFLICT (event_id, sponsor_id) DO NOTHING;

INSERT INTO event_sponsors (event_id, sponsor_id)
SELECT e.id, s.id
FROM events e, sponsors s
WHERE e.title = 'AI Workshop' AND s.name = 'DevSolutions'
ON CONFLICT (event_id, sponsor_id) DO NOTHING;

INSERT INTO event_sponsors (event_id, sponsor_id)
SELECT e.id, s.id
FROM events e, sponsors s
WHERE e.title = 'Innovation Showcase' AND s.name = 'InnovateLabs'
ON CONFLICT (event_id, sponsor_id) DO NOTHING;

INSERT INTO event_sponsors (event_id, sponsor_id)
SELECT e.id, s.id
FROM events e, sponsors s
WHERE e.title = 'Networking Event' AND s.name = 'CodeWorks'
ON CONFLICT (event_id, sponsor_id) DO NOTHING;

INSERT INTO event_sponsors (event_id, sponsor_id)
SELECT e.id, s.id
FROM events e, sponsors s
WHERE e.title = 'Startup Pitch' AND s.name = 'FutureTech'
ON CONFLICT (event_id, sponsor_id) DO NOTHING;

-- Link events with judges
INSERT INTO event_judges (event_id, judge_id, role)
SELECT e.id, j.id, 'Lead Judge'
FROM events e, judges j
WHERE e.title = 'Hackathon 2024' AND j.name = 'Dr. Sarah Johnson'
ON CONFLICT (event_id, judge_id) DO NOTHING;

INSERT INTO event_judges (event_id, judge_id, role)
SELECT e.id, j.id, 'Technical Judge'
FROM events e, judges j
WHERE e.title = 'AI Workshop' AND j.name = 'Alex Chen'
ON CONFLICT (event_id, judge_id) DO NOTHING;

INSERT INTO event_judges (event_id, judge_id, role)
SELECT e.id, j.id, 'Industry Judge'
FROM events e, judges j
WHERE e.title = 'Innovation Showcase' AND j.name = 'Maria Rodriguez'
ON CONFLICT (event_id, judge_id) DO NOTHING;

INSERT INTO event_judges (event_id, judge_id, role)
SELECT e.id, j.id, 'Technical Judge'
FROM events e, judges j
WHERE e.title = 'Hackathon 2024' AND j.name = 'Dr. James Wilson'
ON CONFLICT (event_id, judge_id) DO NOTHING;

INSERT INTO event_judges (event_id, judge_id, role)
SELECT e.id, j.id, 'Innovation Judge'
FROM events e, judges j
WHERE e.title = 'Startup Pitch' AND j.name = 'Dr. Aisha Patel'
ON CONFLICT (event_id, judge_id) DO NOTHING;

-- Link events with participants
INSERT INTO event_participants (event_id, participant_id, status)
SELECT e.id, p.id, 'registered'
FROM events e, participants p
WHERE e.title = 'Hackathon 2024' AND p.name = 'John Smith'
ON CONFLICT (event_id, participant_id) DO NOTHING;

INSERT INTO event_participants (event_id, participant_id, status)
SELECT e.id, p.id, 'registered'
FROM events e, participants p
WHERE e.title = 'AI Workshop' AND p.name = 'Jane Doe'
ON CONFLICT (event_id, participant_id) DO NOTHING;

INSERT INTO event_participants (event_id, participant_id, status)
SELECT e.id, p.id, 'registered'
FROM events e, participants p
WHERE e.title = 'Innovation Showcase' AND p.name = 'Mike Johnson'
ON CONFLICT (event_id, participant_id) DO NOTHING;

INSERT INTO event_participants (event_id, participant_id, status)
SELECT e.id, p.id, 'registered'
FROM events e, participants p
WHERE e.title = 'Networking Event' AND p.name = 'John Smith'
ON CONFLICT (event_id, participant_id) DO NOTHING;

INSERT INTO event_participants (event_id, participant_id, status)
SELECT e.id, p.id, 'registered'
FROM events e, participants p
WHERE e.title = 'Startup Pitch' AND p.name = 'Mike Johnson'
ON CONFLICT (event_id, participant_id) DO NOTHING;

-- Insert sample results
INSERT INTO results (event_id, participant_id, judge_id, technical_score, presentation_score, innovation_score, position, feedback, status)
SELECT e.id, p.id, j.id, 35.5, 30.0, 30.0, 1, 'Excellent performance', 'evaluated'
FROM events e, participants p, judges j
WHERE e.title = 'Hackathon 2024' AND p.name = 'John Smith' AND j.name = 'Dr. Sarah Johnson'
ON CONFLICT (event_id, participant_id, judge_id) DO NOTHING;

INSERT INTO results (event_id, participant_id, judge_id, technical_score, presentation_score, innovation_score, position, feedback, status)
SELECT e.id, p.id, j.id, 32.0, 28.0, 27.0, 2, 'Good technical skills', 'evaluated'
FROM events e, participants p, judges j
WHERE e.title = 'Hackathon 2024' AND p.name = 'John Smith' AND j.name = 'Dr. James Wilson'
ON CONFLICT (event_id, participant_id, judge_id) DO NOTHING;

INSERT INTO results (event_id, participant_id, judge_id, technical_score, presentation_score, innovation_score, position, feedback, status)
SELECT e.id, p.id, j.id, 28.0, 30.0, 30.0, 2, 'Good technical skills', 'evaluated'
FROM events e, participants p, judges j
WHERE e.title = 'AI Workshop' AND p.name = 'Jane Doe' AND j.name = 'Alex Chen'
ON CONFLICT (event_id, participant_id, judge_id) DO NOTHING;

INSERT INTO results (event_id, participant_id, judge_id, technical_score, presentation_score, innovation_score, position, feedback, status)
SELECT e.id, p.id, j.id, 32.5, 30.0, 30.0, 3, 'Innovative approach', 'evaluated'
FROM events e, participants p, judges j
WHERE e.title = 'Innovation Showcase' AND p.name = 'Mike Johnson' AND j.name = 'Maria Rodriguez'
ON CONFLICT (event_id, participant_id, judge_id) DO NOTHING;

INSERT INTO results (event_id, participant_id, judge_id, status)
SELECT e.id, p.id, j.id, 'pending'
FROM events e, participants p, judges j
WHERE e.title = 'Innovation Showcase' AND p.name = 'Mike Johnson' AND j.name = 'Alex Chen'
ON CONFLICT (event_id, participant_id, judge_id) DO NOTHING;

INSERT INTO results (event_id, participant_id, judge_id, status)
SELECT e.id, p.id, j.id, 'pending'
FROM events e, participants p, judges j
WHERE e.title = 'Startup Pitch' AND p.name = 'Mike Johnson' AND j.name = 'Dr. Aisha Patel'
ON CONFLICT (event_id, participant_id, judge_id) DO NOTHING;

-- Insert sample tweets
INSERT INTO tweets (tweet_id, content, author_name, author_handle, author_image_url, created_at, hashtags)
VALUES
('1234567890', 'Excited to be at #TechFest2024! Amazing projects on display!', 'Jane Smith', '@janesmith', 'https://example.com/jane.jpg', NOW() - INTERVAL '2 hours', ARRAY['TechFest2024', 'Innovation']),
('2345678901', 'Just saw an incredible AI demo at the #TechFest2024 #AIWorkshop', 'John Doe', '@johndoe', 'https://example.com/john.jpg', NOW() - INTERVAL '1 hour', ARRAY['TechFest2024', 'AIWorkshop']),
('3456789012', 'Congratulations to all the winners of #Hackathon2024 at #TechFest!', 'Tech News', '@technews', 'https://example.com/technews.jpg', NOW() - INTERVAL '30 minutes', ARRAY['Hackathon2024', 'TechFest']),
('4567890123', 'Great networking at #TechFest2024 tonight! Made some amazing connections.', 'Mike Brown', '@mikebrown', 'https://example.com/mike.jpg', NOW() - INTERVAL '3 hours', ARRAY['TechFest2024', 'Networking']),
('5678901234', 'Impressive pitch from the startup teams today at #TechFest2024', 'Startup Weekly', '@startupweekly', 'https://example.com/startup.jpg', NOW() - INTERVAL '5 hours', ARRAY['TechFest2024', 'StartupPitch'])
ON CONFLICT (tweet_id) DO NOTHING;

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO techfest_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO techfest_user;

-- Add missing columns and update data types
-- For users table
ALTER TABLE users 
  ADD CONSTRAINT IF NOT EXISTS valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  ADD CONSTRAINT IF NOT EXISTS valid_role CHECK (role IN ('admin', 'organizer', 'participant', 'user'));

-- Move password to temp column
UPDATE users SET password_temp = password;

-- For events table
ALTER TABLE events 
  ADD CONSTRAINT IF NOT EXISTS valid_dates CHECK (end_date >= start_date);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for each table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_updated_at') THEN
    CREATE TRIGGER update_users_updated_at
      BEFORE UPDATE ON users
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_events_updated_at') THEN
    CREATE TRIGGER update_events_updated_at
      BEFORE UPDATE ON events
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_participants_updated_at') THEN
    CREATE TRIGGER update_participants_updated_at
      BEFORE UPDATE ON participants
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_judges_updated_at') THEN
    CREATE TRIGGER update_judges_updated_at
      BEFORE UPDATE ON judges
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Create missing indexes for performance
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_title ON events(title);
CREATE INDEX IF NOT EXISTS idx_tweets_created_at ON tweets(created_at);
CREATE INDEX IF NOT EXISTS idx_participants_email ON participants(email);
CREATE INDEX IF NOT EXISTS idx_participants_name ON participants(name);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_results_event ON results(event_id);
CREATE INDEX IF NOT EXISTS idx_results_participant ON results(participant_id);
CREATE INDEX IF NOT EXISTS idx_judges_name ON judges(name);
CREATE INDEX IF NOT EXISTS idx_sponsors_name ON sponsors(name);
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);

-- Add text search capabilities
CREATE INDEX IF NOT EXISTS idx_events_description_trgm ON events USING gin (description gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_judges_bio_trgm ON judges USING gin (bio gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_tweets_content_trgm ON tweets USING gin (content gin_trgm_ops); 