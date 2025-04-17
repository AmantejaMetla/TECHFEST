-- Show current NULL scores
SELECT event_id, participant_id, judge_id, technical_score, presentation_score, innovation_score, total_score 
FROM results 
WHERE technical_score IS NULL 
   OR presentation_score IS NULL 
   OR innovation_score IS NULL;

-- Update NULL scores to 0
UPDATE results 
SET 
    technical_score = COALESCE(technical_score, 0),
    presentation_score = COALESCE(presentation_score, 0),
    innovation_score = COALESCE(innovation_score, 0)
WHERE technical_score IS NULL 
   OR presentation_score IS NULL 
   OR innovation_score IS NULL;

-- Verify that no NULL scores remain
SELECT 
    event_id,
    participant_id,
    judge_id,
    technical_score,
    presentation_score,
    innovation_score,
    total_score
FROM results
ORDER BY event_id, participant_id, judge_id; 