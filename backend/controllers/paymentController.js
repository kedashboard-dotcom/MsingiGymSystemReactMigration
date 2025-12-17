const mpesaService = require('../config/mpesa');
const User = require('../models/User');

exports.checkStatus = async (req, res) => {
  try {
    const { checkout_request_id } = req.body;
    
    if (!checkout_request_id) {
      return res.status(400).json({
        status: 'error',
        message: 'Checkout ID required'
      });
    }

    const status = await mpesaService.checkPaymentStatus(checkout_request_id);
    res.json({
      status: 'success',
      data: status
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Status check failed'
    });
  }
};

exports.validateCallback = (req, res) => {
  res.json({
    ResultCode: 0,
    ResultDesc: 'Callback URL validated'
  });
};

exports.handleCallback = async (req, res) => {
  try {
    const result = mpesaService.handleCallback(req.body);

    if (result.success) {
      const { metadata } = result.data;
      
      // Find and update user
      const user = await User.findByPhone(metadata.phoneNumber);
      if (user) {
        const paymentData = {
          mpesa_receipt: metadata.mpesaReceiptNumber,
          amount: metadata.amount
        };

        if (user.status === 'active') {
          await User.extendMembership(user.membership_id, paymentData);
        } else {
          await User.updateAfterPayment(user.membership_id, paymentData);
        }
      }

      res.json({
        ResultCode: 0,
        ResultDesc: 'Success'
      });
    } else {
      res.json({
        ResultCode: 1,
        ResultDesc: result.error
      });
    }
  } catch (error) {
    console.error('Callback error:', error);
    res.json({
      ResultCode: 1,
      ResultDesc: 'Error processing callback'
    });
  }
};