const axios = require('axios');
require('dotenv').config();

class MpesaService {
  constructor() {
    this.environment = process.env.MPESA_ENVIRONMENT || 'sandbox';
    this.consumerKey = process.env.MPESA_CONSUMER_KEY;
    this.consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    this.businessShortCode = process.env.MPESA_BUSINESS_SHORTCODE;
    this.passKey = process.env.MPESA_PASSKEY;
    this.callbackURL = process.env.MPESA_CALLBACK_URL;
    
    this.baseURL = this.environment === 'production' 
      ? 'https://api.safaricom.co.ke' 
      : 'https://sandbox.safaricom.co.ke';
  }

  async generateAccessToken() {
    try {
      const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');
      const response = await axios.get(
        `${this.baseURL}/oauth/v1/generate?grant_type=client_credentials`,
        {
          headers: { Authorization: `Basic ${auth}` }
        }
      );
      return response.data.access_token;
    } catch (error) {
      console.error('Token generation failed:', error.response?.data || error.message);
      throw new Error('Failed to generate access token');
    }
  }

  async initiateSTKPush(phone, amount, accountReference, transactionDesc) {
    try {
      const token = await this.generateAccessToken();
      
      const timestamp = new Date()
        .toISOString()
        .replace(/[-:]/g, '')
        .split('.')[0];
      
      const password = Buffer.from(`${this.businessShortCode}${this.passKey}${timestamp}`).toString('base64');
      
      const requestData = {
        BusinessShortCode: this.businessShortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: phone,
        PartyB: this.businessShortCode,
        PhoneNumber: phone,
        CallBackURL: this.callbackURL,
        AccountReference: accountReference,
        TransactionDesc: transactionDesc
      };

      const response = await axios.post(
        `${this.baseURL}/mpesa/stkpush/v1/processrequest`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('STK Push failed:', error.response?.data || error.message);
      throw new Error('STK Push request failed');
    }
  }

  async checkPaymentStatus(checkoutRequestID) {
    try {
      const token = await this.generateAccessToken();
      
      const timestamp = new Date()
        .toISOString()
        .replace(/[-:]/g, '')
        .split('.')[0];
      
      const password = Buffer.from(`${this.businessShortCode}${this.passKey}${timestamp}`).toString('base64');
      
      const requestData = {
        BusinessShortCode: this.businessShortCode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestID
      };

      const response = await axios.post(
        `${this.baseURL}/mpesa/stkpushquery/v1/query`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Payment status check failed:', error.response?.data || error.message);
      throw new Error('Failed to check payment status');
    }
  }

  handleCallback(callbackData) {
    try {
      if (!callbackData.Body?.stkCallback) {
        return { success: false, error: 'Invalid callback data' };
      }

      const stkCallback = callbackData.Body.stkCallback;
      
      if (stkCallback.ResultCode === 0) {
        const metadata = {};
        if (stkCallback.CallbackMetadata?.Item) {
          stkCallback.CallbackMetadata.Item.forEach(item => {
            metadata[item.Name] = item.Value;
          });
        }

        return {
          success: true,
          data: {
            MerchantRequestID: stkCallback.MerchantRequestID,
            CheckoutRequestID: stkCallback.CheckoutRequestID,
            ResultCode: stkCallback.ResultCode,
            ResultDesc: stkCallback.ResultDesc,
            metadata: {
              amount: metadata.Amount,
              mpesaReceiptNumber: metadata.MpesaReceiptNumber,
              phoneNumber: metadata.PhoneNumber
            }
          }
        };
      } else {
        return {
          success: false,
          error: stkCallback.ResultDesc,
          data: {
            MerchantRequestID: stkCallback.MerchantRequestID,
            CheckoutRequestID: stkCallback.CheckoutRequestID,
            ResultCode: stkCallback.ResultCode,
            ResultDesc: stkCallback.ResultDesc
          }
        };
      }
    } catch (error) {
      console.error('Callback handling failed:', error.message);
      return { success: false, error: 'Failed to process callback' };
    }
  }
}

module.exports = new MpesaService();