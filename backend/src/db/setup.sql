-- Run the main schema file
\i schema.sql

-- Run the initialization file with sample data
\i init.sql

-- Grant necessary permissions (also included in init.sql but kept here for safety)
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO techfest_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO techfest_user; 