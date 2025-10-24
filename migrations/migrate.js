const pool = require('../config/database');

async function createTables() {
  try {
    // Создание таблицы events
    await pool.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        total_seats INTEGER NOT NULL
      )
    `);

    // Создание таблицы bookings
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
        user_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(event_id, user_id)
      )
    `);

    console.log('Таблицы успешно созданы');
  } catch (error) {
    console.error('Ошибка при создании таблиц:', error);
  } finally {
    await pool.end();
  }
}

createTables();
