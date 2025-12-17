const User = require('../models/User');
const mpesaService = require('../config/mpesa');

exports.register = async (req, res) => {
  try {
    const { name, phone, amount = 2, membership_type = 'standard' } = req.body;

    // Validate
    if (!name || !phone) {
      return res.status(400).json({
        status: 'error',
        message: 'Name and phone required'
      });
    }

    // Check existing
    const existing = await User.findByPhone(phone);
    if (existing?.status === 'active') {
      return res.status(400).json({
        status: 'error',
        message: 'Active membership exists'
      });
    }

    // Create user
    const user = await User.create({ name, phone, amount, membership_type });

    // M-Pesa payment
    const paymentResponse = await mpesaService.initiateSTKPush(
      phone,
      amount,
      user.membership_id,
      `Gym ${membership_type} Membership`
    );

    if (paymentResponse.ResponseCode === '0') {
      res.json({
        status: 'success',
        message: 'Payment request sent',
        data: {
          membership_id: user.membership_id,
          checkout_request_id: paymentResponse.CheckoutRequestID
        }
      });
    } else {
      throw new Error(paymentResponse.ResponseDescription);
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Registration failed'
    });
  }
};

exports.renew = async (req, res) => {
  try {
    const { membership_id, phone, amount = 2 } = req.body;

    let user;
    if (membership_id) {
      user = await User.findByMembershipID(membership_id);
    } else if (phone) {
      user = await User.findByPhone(phone);
    }

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Member not found'
      });
    }

    const paymentResponse = await mpesaService.initiateSTKPush(
      user.phone,
      amount,
      user.membership_id,
      'Membership Renewal'
    );

    if (paymentResponse.ResponseCode === '0') {
      res.json({
        status: 'success',
        message: 'Renewal payment sent',
        data: {
          membership_id: user.membership_id,
          checkout_request_id: paymentResponse.CheckoutRequestID
        }
      });
    } else {
      throw new Error(paymentResponse.ResponseDescription);
    }
  } catch (error) {
    console.error('Renewal error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Renewal failed'
    });
  }
};

exports.checkStatus = async (req, res) => {
  try {
    const { membership_id, phone } = req.query;

    let user;
    if (membership_id) {
      user = await User.findByMembershipID(membership_id);
    } else if (phone) {
      user = await User.findByPhone(phone);
    }

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Member not found'
      });
    }

    const now = new Date();
    const endDate = new Date(user.membership_end);
    const daysRemaining = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
    const isActive = user.status === 'active' && daysRemaining > 0;

    res.json({
      status: 'success',
      data: {
        user: {
          ...user,
          status: isActive ? 'active' : 'expired',
          days_remaining: Math.max(0, daysRemaining)
        }
      }
    });
  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Status check failed'
    });
  }
};

exports.getActiveMembers = async (req, res) => {
  try {
    const members = await User.getActiveMembers();
    res.json({
      status: 'success',
      data: {
        count: members.length,
        members: members.map(m => ({
          name: m.name,
          phone: m.phone,
          membership_id: m.membership_id,
          membership_end: m.membership_end
        }))
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to get members'
    });
  }
};