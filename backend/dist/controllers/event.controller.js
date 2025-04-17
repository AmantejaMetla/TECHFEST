"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventController = void 0;
const event_service_1 = require("../services/event.service");
class EventController {
    // Create a new event
    static createEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const event = yield event_service_1.EventService.createEvent(req.body);
                res.status(201).json(event);
            }
            catch (error) {
                console.error('Error creating event:', error);
                res.status(500).json({ error: 'Failed to create event' });
            }
        });
    }
    // Get all events
    static getAllEvents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const events = yield event_service_1.EventService.getAllEvents();
                res.json(events);
            }
            catch (error) {
                console.error('Error fetching events:', error);
                res.status(500).json({ error: 'Failed to fetch events' });
            }
        });
    }
    // Get event by ID
    static getEventById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const event = yield event_service_1.EventService.getEventById(req.params.id);
                if (!event) {
                    return res.status(404).json({ error: 'Event not found' });
                }
                res.json(event);
            }
            catch (error) {
                console.error('Error fetching event:', error);
                res.status(500).json({ error: 'Failed to fetch event' });
            }
        });
    }
    // Update event
    static updateEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const event = yield event_service_1.EventService.updateEvent(req.params.id, req.body);
                if (!event) {
                    return res.status(404).json({ error: 'Event not found' });
                }
                res.json(event);
            }
            catch (error) {
                console.error('Error updating event:', error);
                res.status(500).json({ error: 'Failed to update event' });
            }
        });
    }
    // Delete event
    static deleteEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const event = yield event_service_1.EventService.getEventById(req.params.id);
                if (!event) {
                    return res.status(404).json({ error: 'Event not found' });
                }
                yield event_service_1.EventService.deleteEvent(req.params.id);
                res.json({ message: 'Event deleted successfully' });
            }
            catch (error) {
                console.error('Error deleting event:', error);
                res.status(500).json({ error: 'Failed to delete event' });
            }
        });
    }
    // Add participant to event
    static addParticipant(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { eventId, participantId } = req.params;
                const result = yield event_service_1.EventService.addParticipant(eventId, participantId);
                res.status(201).json(result);
            }
            catch (error) {
                console.error('Error adding participant:', error);
                if (error instanceof Error && error.message.includes('not found')) {
                    return res.status(404).json({ error: error.message });
                }
                res.status(500).json({ error: 'Failed to add participant' });
            }
        });
    }
    // Get event participants
    static getEventParticipants(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const participants = yield event_service_1.EventService.getEventParticipants(req.params.id);
                res.json(participants);
            }
            catch (error) {
                console.error('Error fetching participants:', error);
                if (error instanceof Error && error.message.includes('not found')) {
                    return res.status(404).json({ error: error.message });
                }
                res.status(500).json({ error: 'Failed to fetch participants' });
            }
        });
    }
}
exports.EventController = EventController;
