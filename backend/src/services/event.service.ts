import { query } from '../config/database';

export interface Event {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  status: 'draft' | 'published' | 'completed' | 'cancelled';
  created_at: string;
}

export class EventService {
  // Create a new event
  static async createEvent(eventData: Omit<Event, 'id' | 'created_at'>) {
    const { title, description, start_date, end_date, location, status } = eventData;
    const result = await query(
      'INSERT INTO events (title, description, start_date, end_date, location, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description, start_date, end_date, location, status]
    );
    return result.rows[0];
  }

  // Get all events
  static async getAllEvents() {
    const result = await query('SELECT * FROM events ORDER BY start_date DESC');
    return result.rows;
  }

  // Get event by ID
  static async getEventById(id: number | string) {
    const result = await query('SELECT * FROM events WHERE id = $1', [parseInt(id.toString())]);
    return result.rows[0];
  }

  // Update event
  static async updateEvent(id: number | string, eventData: Partial<Omit<Event, 'id' | 'created_at'>>) {
    const { title, description, start_date, end_date, location, status } = eventData;
    const result = await query(
      `UPDATE events 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           start_date = COALESCE($3, start_date),
           end_date = COALESCE($4, end_date),
           location = COALESCE($5, location),
           status = COALESCE($6, status)
       WHERE id = $7
       RETURNING *`,
      [title, description, start_date, end_date, location, status, parseInt(id.toString())]
    );
    return result.rows[0];
  }

  // Delete event
  static async deleteEvent(id: number | string) {
    await query('DELETE FROM events WHERE id = $1', [parseInt(id.toString())]);
    return { message: 'Event deleted successfully' };
  }

  // Add participant to event
  static async addParticipant(eventId: number | string, participantId: number | string) {
    // First check if both event and participant exist
    const eventExists = await query('SELECT id FROM events WHERE id = $1', [parseInt(eventId.toString())]);
    if (eventExists.rows.length === 0) {
      throw new Error('Event not found');
    }

    const participantExists = await query('SELECT id FROM participants WHERE id = $1', [parseInt(participantId.toString())]);
    if (participantExists.rows.length === 0) {
      throw new Error('Participant not found');
    }

    const result = await query(
      'INSERT INTO event_participants (event_id, participant_id) VALUES ($1, $2) RETURNING *',
      [parseInt(eventId.toString()), parseInt(participantId.toString())]
    );
    return result.rows[0];
  }

  // Get event participants
  static async getEventParticipants(eventId: number | string) {
    // First check if event exists
    const eventExists = await query('SELECT id FROM events WHERE id = $1', [parseInt(eventId.toString())]);
    if (eventExists.rows.length === 0) {
      throw new Error('Event not found');
    }

    const result = await query(
      `SELECT p.* FROM participants p
       JOIN event_participants ep ON p.id = ep.participant_id
       WHERE ep.event_id = $1
       ORDER BY p.name`,
      [parseInt(eventId.toString())]
    );
    return result.rows;
  }
} 