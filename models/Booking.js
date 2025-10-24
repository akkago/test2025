const pool = require('../config/database');

class Booking {
  static async create(eventId, userId) {
    const result = await pool.query(`
      INSERT INTO bookings (event_id, user_id) 
      VALUES ($1, $2) 
      RETURNING *
    `, [eventId, userId]);
    
    return result.rows[0];
  }

  static async findByEventAndUser(eventId, userId) {
    const result = await pool.query(
      'SELECT * FROM bookings WHERE event_id = $1 AND user_id = $2',
      [eventId, userId]
    );
    
    return result.rows[0];
  }

  static async getBookingsByEvent(eventId) {
    const result = await pool.query(
      'SELECT * FROM bookings WHERE event_id = $1 ORDER BY created_at DESC',
      [eventId]
    );
    
    return result.rows;
  }
}

module.exports = Booking;
