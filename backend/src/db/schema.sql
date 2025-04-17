-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search optimization

-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'participant' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_role CHECK (role IN ('admin', 'organizer', 'participant', 'user'))
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create sponsors table
CREATE TABLE IF NOT EXISTS sponsors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    logo_url VARCHAR(255),
    website_url VARCHAR(255),
    sponsorship_level VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_sponsorship_level CHECK (sponsorship_level IN ('Platinum', 'Gold', 'Silver', 'Bronze'))
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_dates CHECK (end_date >= start_date),
    UNIQUE(title, start_date)
);

-- Create event_categories junction table
CREATE TABLE IF NOT EXISTS event_categories (
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (event_id, category_id)
);

-- Create event_sponsors junction table
CREATE TABLE IF NOT EXISTS event_sponsors (
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    sponsor_id UUID REFERENCES sponsors(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (event_id, sponsor_id)
);

-- Create judges table
CREATE TABLE IF NOT EXISTS judges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(255),
    bio TEXT,
    twitter_handle VARCHAR(50),
    image_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_twitter_handle CHECK (twitter_handle ~* '^@[A-Za-z0-9_]+$')
);

-- Create event_judges junction table
CREATE TABLE IF NOT EXISTS event_judges (
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    judge_id UUID REFERENCES judges(id) ON DELETE CASCADE,
    role VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (event_id, judge_id)
);

-- Create participants table
CREATE TABLE IF NOT EXISTS participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    bio TEXT,
    avatar_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_phone CHECK (phone ~* '^\+?[0-9]{10,15}$')
);

-- Create event_participants junction table
CREATE TABLE IF NOT EXISTS event_participants (
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    participant_id UUID REFERENCES participants(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'registered',
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (event_id, participant_id),
    CONSTRAINT valid_status CHECK (status IN ('registered', 'attended', 'cancelled'))
);

-- Create results table
CREATE TABLE IF NOT EXISTS results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    participant_id UUID REFERENCES participants(id) ON DELETE CASCADE,
    judge_id UUID REFERENCES judges(id) ON DELETE CASCADE,
    technical_score DECIMAL(5,2),
    presentation_score DECIMAL(5,2),
    innovation_score DECIMAL(5,2),
    total_score DECIMAL(5,2) GENERATED ALWAYS AS (
        COALESCE(technical_score, 0) + 
        COALESCE(presentation_score, 0) + 
        COALESCE(innovation_score, 0)
    ) STORED,
    position INTEGER,
    feedback TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_technical_score CHECK (technical_score >= 0 AND technical_score <= 100),
    CONSTRAINT valid_presentation_score CHECK (presentation_score >= 0 AND presentation_score <= 100),
    CONSTRAINT valid_innovation_score CHECK (innovation_score >= 0 AND innovation_score <= 100),
    CONSTRAINT valid_status CHECK (status IN ('pending', 'evaluated', 'published')),
    UNIQUE(event_id, participant_id, judge_id)
);

-- Create tweets table
CREATE TABLE IF NOT EXISTS tweets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tweet_id VARCHAR(255) NOT NULL UNIQUE,
    content TEXT NOT NULL,
    author_name VARCHAR(255) NOT NULL,
    author_handle VARCHAR(255) NOT NULL,
    author_image_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    hashtags TEXT[],
    fetched_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_twitter_handle CHECK (author_handle ~* '^@[A-Za-z0-9_]+$')
);

-- Create indexes for better performance
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_title ON events(title);
CREATE INDEX idx_tweets_created_at ON tweets(created_at);
CREATE INDEX idx_tweets_hashtags ON tweets USING GIN(hashtags);
CREATE INDEX idx_tweets_author_handle ON tweets(author_handle);
CREATE INDEX idx_participants_email ON participants(email);
CREATE INDEX idx_participants_name ON participants(name);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_results_event ON results(event_id);
CREATE INDEX idx_results_participant ON results(participant_id);
CREATE INDEX idx_results_judge ON results(judge_id);
CREATE INDEX idx_results_status ON results(status);
CREATE INDEX idx_results_total_score ON results(total_score);
CREATE INDEX idx_judges_name ON judges(name);
CREATE INDEX idx_judges_twitter_handle ON judges(twitter_handle);
CREATE INDEX idx_sponsors_name ON sponsors(name);
CREATE INDEX idx_sponsors_level ON sponsors(sponsorship_level);
CREATE INDEX idx_categories_name ON categories(name);

-- Create text search indexes
CREATE INDEX idx_events_description_trgm ON events USING gin (description gin_trgm_ops);
CREATE INDEX idx_judges_bio_trgm ON judges USING gin (bio gin_trgm_ops);
CREATE INDEX idx_tweets_content_trgm ON tweets USING gin (content gin_trgm_ops);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_judges_updated_at
    BEFORE UPDATE ON judges
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_participants_updated_at
    BEFORE UPDATE ON participants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 