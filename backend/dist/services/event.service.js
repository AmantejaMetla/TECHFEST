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
exports.EventService = void 0;
const database_1 = require("../config/database");
class EventService {
    // Create a new event
    static createEvent(eventData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, description, start_date, end_date, location, status } = eventData;
            const result = yield (0, database_1.query)('INSERT INTO events (title, description, start_date, end_date, location, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [title, description, start_date, end_date, location, status]);
            return result.rows[0];
        });
    }
    // Get all events
    static getAllEvents() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield (0, database_1.query)('SELECT * FROM events ORDER BY start_date DESC');
            return result.rows;
        });
    }
    // Get event by ID
    static getEventById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield (0, database_1.query)('SELECT * FROM events WHERE id = $1', [parseInt(id.toString())]);
            return result.rows[0];
        });
    }
    // Update event
    static updateEvent(id, eventData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, description, start_date, end_date, location, status } = eventData;
            const result = yield (0, database_1.query)(`UPDATE events 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           start_date = COALESCE($3, start_date),
           end_date = COALESCE($4, end_date),
           location = COALESCE($5, location),
           status = COALESCE($6, status)
       WHERE id = $7
       RETURNING *`, [title, description, start_date, end_date, location, status, parseInt(id.toString())]);
            return result.rows[0];
        });
    }
    // Delete event
    static deleteEvent(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, database_1.query)('DELETE FROM events WHERE id = $1', [parseInt(id.toString())]);
            return { message: 'Event deleted successfully' };
        });
    }
    // Add participant to event
    static addParticipant(eventId, participantId) {
        return __awaiter(this, void 0, void 0, function* () {
            // First check if both event and participant exist
            const eventExists = yield (0, database_1.query)('SELECT id FROM events WHERE id = $1', [parseInt(eventId.toString())]);
            if (eventExists.rows.length === 0) {
                throw new Error('Event not found');
            }
            const participantExists = yield (0, database_1.query)('SELECT id FROM participants WHERE id = $1', [parseInt(participantId.toString())]);
            if (participantExists.rows.length === 0) {
                throw new Error('Participant not found');
            }
            const result = yield (0, database_1.query)('INSERT INTO event_participants (event_id, participant_id) VALUES ($1, $2) RETURNING *', [parseInt(eventId.toString()), parseInt(participantId.toString())]);
            return result.rows[0];
        });
    }
    // Get event participants
    static getEventParticipants(eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            // First check if event exists
            const eventExists = yield (0, database_1.query)('SELECT id FROM events WHERE id = $1', [parseInt(eventId.toString())]);
            if (eventExists.rows.length === 0) {
                throw new Error('Event not found');
            }
            const result = yield (0, database_1.query)(`SELECT p.* FROM participants p
       JOIN event_participants ep ON p.id = ep.participant_id
       WHERE ep.event_id = $1
       ORDER BY p.name`, [parseInt(eventId.toString())]);
            return result.rows;
        });
    }
}
exports.EventService = EventService;
