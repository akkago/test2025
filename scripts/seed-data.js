const pool = require('../config/database');

async function seedData() {
  try {
    console.log('🌱 Добавление тестовых данных...');

    // Добавляем тестовые события
    const events = [
      { name: 'Конференция по разработке', total_seats: 100 },
      { name: 'Воркшоп по машинному обучению', total_seats: 50 },
      { name: 'Семинар по блокчейну', total_seats: 30 }
    ];

    for (const event of events) {
      const result = await pool.query(
        'INSERT INTO events (name, total_seats) VALUES ($1, $2) RETURNING id',
        [event.name, event.total_seats]
      );
      console.log(`✅ Событие "${event.name}" создано с ID: ${result.rows[0].id}`);
    }

    console.log('✅ Тестовые данные успешно добавлены!');
  } catch (error) {
    console.error('❌ Ошибка при добавлении тестовых данных:', error);
  } finally {
    await pool.end();
  }
}

seedData();
