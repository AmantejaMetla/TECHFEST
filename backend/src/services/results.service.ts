import { query } from '../config/database';

export interface ResultScore {
  technical_score: number;
  presentation_score: number;
  innovation_score: number;
  feedback?: string;
}

export class ResultsService {
  // Submit or update a result for a participant by a judge
  static async submitResult(
    eventId: string,
    participantId: string,
    judgeId: string,
    scores: ResultScore
  ) {
    const { technical_score, presentation_score, innovation_score, feedback } = scores;
    
    const result = await query(
      `INSERT INTO results 
       (event_id, participant_id, judge_id, technical_score, presentation_score, innovation_score, feedback, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'evaluated')
       ON CONFLICT (event_id, participant_id, judge_id)
       DO UPDATE SET 
         technical_score = $4,
         presentation_score = $5,
         innovation_score = $6,
         feedback = $7,
         status = 'evaluated',
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [eventId, participantId, judgeId, technical_score, presentation_score, innovation_score, feedback]
    );
    
    return result.rows[0];
  }

  // Get all results for an event
  static async getEventResults(eventId: string) {
    const result = await query(
      `SELECT 
         r.*,
         p.name as participant_name,
         j.name as judge_name
       FROM results r
       JOIN participants p ON r.participant_id = p.id
       JOIN judges j ON r.judge_id = j.id
       WHERE r.event_id = $1
       ORDER BY r.total_score DESC`,
      [eventId]
    );
    return result.rows;
  }

  // Get results for a specific participant in an event
  static async getParticipantResults(eventId: string, participantId: string) {
    const result = await query(
      `SELECT 
         r.*,
         j.name as judge_name
       FROM results r
       JOIN judges j ON r.judge_id = j.id
       WHERE r.event_id = $1 AND r.participant_id = $2`,
      [eventId, participantId]
    );
    return result.rows;
  }

  // Get all results submitted by a judge for an event
  static async getJudgeResults(eventId: string, judgeId: string) {
    const result = await query(
      `SELECT 
         r.*,
         p.name as participant_name
       FROM results r
       JOIN participants p ON r.participant_id = p.id
       WHERE r.event_id = $1 AND r.judge_id = $2`,
      [eventId, judgeId]
    );
    return result.rows;
  }

  // Publish results for an event
  static async publishEventResults(eventId: string) {
    const result = await query(
      `UPDATE results 
       SET status = 'published'
       WHERE event_id = $1 AND status = 'evaluated'
       RETURNING *`,
      [eventId]
    );
    return result.rows;
  }

  // Get aggregated results for an event (average scores across all judges)
  static async getAggregatedResults(eventId: string) {
    const result = await query(
      `SELECT 
         r.participant_id,
         p.name as participant_name,
         ROUND(AVG(r.technical_score)::numeric, 2) as avg_technical_score,
         ROUND(AVG(r.presentation_score)::numeric, 2) as avg_presentation_score,
         ROUND(AVG(r.innovation_score)::numeric, 2) as avg_innovation_score,
         ROUND(AVG(r.total_score)::numeric, 2) as avg_total_score,
         COUNT(r.judge_id) as number_of_judges,
         STRING_AGG(r.feedback, ' | ') as all_feedback
       FROM results r
       JOIN participants p ON r.participant_id = p.id
       WHERE r.event_id = $1 AND r.status = 'published'
       GROUP BY r.participant_id, p.name
       ORDER BY avg_total_score DESC`,
      [eventId]
    );
    return result.rows;
  }
} 