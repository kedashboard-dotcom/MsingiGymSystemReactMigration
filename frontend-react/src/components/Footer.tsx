import React from 'react';
import { Phone, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                <span>{process.env.REACT_APP_CONTACT_PHONE}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                <span>{process.env.REACT_APP_CONTACT_EMAIL}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <a href="/register" className="block hover:text-primary-400">Register</a>
              <a href="/renew" className="block hover:text-primary-400">Renew</a>
              <a href="/status" className="block hover:text-primary-400">Check Status</a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Hours</h3>
            <p>Mon - Fri: 6:00 AM - 10:00 PM</p>
            <p>Weekends: 7:00 AM - 8:00 PM</p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p>&copy; {currentYear} Msingi Gym. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;