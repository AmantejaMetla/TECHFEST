-- Update results with null scores to have default values
UPDATE results 
SET 
    technical_score = COALESCE(technical_score, 0.00),
    presentation_score = COALESCE(presentation_score, 0.00),
    innovation_score = COALESCE(innovation_score, 0.00)
WHERE 
    technical_score IS NULL 
    OR presentation_score IS NULL 
    OR innovation_score IS NULL; 