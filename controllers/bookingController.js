const Event = require('../models/Event');
const Booking = require('../models/Booking');

class BookingController {
  static async reserve(req, res) {
    try {
      const { event_id, user_id } = req.validatedData;

      // Проверяем, существует ли событие
      const event = await Event.findById(event_id);
      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Событие не найдено'
        });
      }

      // Проверяем, не забронировал ли уже пользователь место на это событие
      const existingBooking = await Booking.findByEventAndUser(event_id, user_id);
      if (existingBooking) {
        return res.status(409).json({
          success: false,
          message: 'Пользователь уже забронировал место на это событие'
        });
      }

      // Проверяем доступность мест
      const availableSeats = await Event.getAvailableSeats(event_id);
      if (availableSeats === null) {
        return res.status(404).json({
          success: false,
          message: 'Событие не найдено'
        });
      }

      if (availableSeats <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Нет доступных мест для бронирования'
        });
      }

      // Создаем бронирование
      const booking = await Booking.create(event_id, user_id);

      res.status(201).json({
        success: true,
        message: 'Место успешно забронировано',
        data: {
          booking_id: booking.id,
          event_id: booking.event_id,
          user_id: booking.user_id,
          created_at: booking.created_at
        }
      });

    } catch (error) {
      console.error('Ошибка при бронировании:', error);
      
      // Обработка ошибки уникальности (если пользователь попытался забронировать дважды)
      if (error.code === '23505') {
        return res.status(409).json({
          success: false,
          message: 'Пользователь уже забронировал место на это событие'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Внутренняя ошибка сервера'
      });
    }
  }
}

module.exports = BookingController;
