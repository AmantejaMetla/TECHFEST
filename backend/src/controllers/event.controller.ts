import { Request, Response } from 'express';
import { EventService } from '../services/event.service';

export class EventController {
  // Create a new event
  static async createEvent(req: Request, res: Response) {
    try {
      const event = await EventService.createEvent(req.body);
      res.status(201).json(event);
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({ error: 'Failed to create event' });
    }
  }

  // Get all events
  static async getAllEvents(req: Request, res: Response) {
    try {
      const events = await EventService.getAllEvents();
      res.json(events);
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ error: 'Failed to fetch events' });
    }
  }

  // Get event by ID
  static async getEventById(req: Request, res: Response) {
    try {
      const event = await EventService.getEventById(req.params.id);
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }
      res.json(event);
    } catch (error) {
      console.error('Error fetching event:', error);
      res.status(500).json({ error: 'Failed to fetch event' });
    }
  }

  // Update event
  static async updateEvent(req: Request, res: Response) {
    try {
      const event = await EventService.updateEvent(req.params.id, req.body);
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }
      res.json(event);
    } catch (error) {
      console.error('Error updating event:', error);
      res.status(500).json({ error: 'Failed to update event' });
    }
  }

  // Delete event
  static async deleteEvent(req: Request, res: Response) {
    try {
      const event = await EventService.getEventById(req.params.id);
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }
      await EventService.deleteEvent(req.params.id);
      res.json({ message: 'Event deleted successfully' });
    } catch (error) {
      console.error('Error deleting event:', error);
      res.status(500).json({ error: 'Failed to delete event' });
    }
  }

  // Add participant to event
  static async addParticipant(req: Request, res: Response) {
    try {
      const { eventId, participantId } = req.params;
      const result = await EventService.addParticipant(eventId, participantId);
      res.status(201).json(result);
    } catch (error) {
      console.error('Error adding participant:', error);
      if (error instanceof Error && error.message.includes('not found')) {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Failed to add participant' });
    }
  }

  // Get event participants
  static async getEventParticipants(req: Request, res: Response) {
    try {
      const participants = await EventService.getEventParticipants(req.params.id);
      res.json(participants);
    } catch (error) {
      console.error('Error fetching participants:', error);
      if (error instanceof Error && error.message.includes('not found')) {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Failed to fetch participants' });
    }
  }
} 