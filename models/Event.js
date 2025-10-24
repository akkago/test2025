const pool = require('../config/database');

class Event {
  static async findById(id) {
    const result = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async getAvailableSeats(eventId) {
    const result = await pool.query(`
      SELECT 
        e.total_seats,
        COUNT(b.id) as booked_seats
      FROM events e
      LEFT JOIN bookings b ON e.id = b.event_id
      WHERE e.id = $1
      GROUP BY e.id, e.total_seats
    `, [eventId]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const { total_seats, booked_seats } = result.rows[0];
    return total_seats - parseInt(booked_seats);
  }
}

module.exports = Event;
