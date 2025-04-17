\echo 'Current User Roles:'
SELECT username, role FROM users ORDER BY role;

\echo '\nJudges Information:'
SELECT j.name, j.title, u.username, u.role 
FROM judges j 
LEFT JOIN users u ON j.user_id = u.id;

\echo '\nEvent Judges Roles:'
SELECT e.title as event_title, j.name as judge_name, ej.role 
FROM event_judges ej
JOIN events e ON ej.event_id = e.id
JOIN judges j ON ej.judge_id = j.id; 