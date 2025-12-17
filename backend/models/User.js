const db = require('../config/database');

class User {
  static async create({ name, phone, amount, membership_type = 'standard' }) {
    const membership_id = 'GYM' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();
    
    const [result] = await db.query(
      `INSERT INTO users (name, phone, membership_id, amount, membership_type, status, membership_start, membership_end) 
       VALUES (?, ?, ?, ?, ?, 'pending_payment', NOW(), DATE_ADD(NOW(), INTERVAL ? DAY))`,
      [name, phone, membership_id, amount, membership_type, process.env.MEMBERSHIP_DURATION_DAYS || 1]
    );
    
    return { id: result.insertId, membership_id, name, phone };
  }

  static async findByPhone(phone) {
    const [rows] = await db.query(
      'SELECT * FROM users WHERE phone = ? ORDER BY created_at DESC LIMIT 1',
      [phone]
    );
    return rows[0];
  }

  static async findByMembershipID(membership_id) {
    const [rows] = await db.query(
      'SELECT * FROM users WHERE membership_id = ?',
      [membership_id]
    );
    return rows[0];
  }

  static async updateAfterPayment(membership_id, paymentData) {
    await db.query(
      `UPDATE users 
       SET status = 'active', 
           mpesa_receipt = ?,
           payment_date = NOW(),
           membership_start = NOW(),
           membership_end = DATE_ADD(NOW(), INTERVAL ? DAY)
       WHERE membership_id = ?`,
      [paymentData.mpesa_receipt, process.env.MEMBERSHIP_DURATION_DAYS || 1, membership_id]
    );
  }

  static async extendMembership(membership_id, paymentData) {
    await db.query(
      `UPDATE users 
       SET mpesa_receipt = ?,
           payment_date = NOW(),
           membership_end = DATE_ADD(membership_end, INTERVAL ? DAY)
       WHERE membership_id = ?`,
      [paymentData.mpesa_receipt, process.env.MEMBERSHIP_DURATION_DAYS || 1, membership_id]
    );
  }

  static async getActiveMembers() {
    const [rows] = await db.query(
      `SELECT * FROM users 
       WHERE status = 'active' AND membership_end > NOW()
       ORDER BY membership_end ASC`
    );
    return rows;
  }
}

module.exports = User;