const express = require('express');
const router = express.Router();

const memberController = require('../controllers/memberController');
const paymentController = require('../controllers/paymentController');
const adminController = require('../controllers/adminController');

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'API is operational'
  });
});

// Member routes
router.post('/members/register', memberController.register);
router.post('/members/renew', memberController.renew);
router.get('/members/status', memberController.checkStatus);
router.get('/members/active', memberController.getActiveMembers);

// Payment routes
router.post('/check-mpesa', paymentController.checkStatus);
router.get('/payments/mpesa-callback', paymentController.validateCallback);
router.post('/payments/mpesa-callback', paymentController.handleCallback);

// Admin routes
router.get('/admin/stats', adminController.authenticate, adminController.getStats);
router.get('/test-axtrax', adminController.testAxtrax);

module.exports = router;