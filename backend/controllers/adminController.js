const db = require('../config/database');

exports.authenticate = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token || token !== `Bearer ${process.env.ADMIN_API_KEY}`) {
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized'
    });
  }
  next();
};

exports.getStats = async (req, res) => {
  try {
    const [[total]] = await db.query('SELECT COUNT(*) as count FROM users');
    const [[active]] = await db.query(
      'SELECT COUNT(*) as count FROM users WHERE status = "active" AND membership_end > NOW()'
    );

    res.json({
      status: 'success',
      data: {
        total_members: total.count,
        active_members: active.count,
        axtrax_enabled: process.env.AXTRAX_ENABLED === 'true'
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to get stats'
    });
  }
};

exports.testAxtrax = async (req, res) => {
  try {
    res.json({
      status: 'success',
      message: 'Axtrax test endpoint',
      enabled: process.env.AXTRAX_ENABLED === 'true'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};