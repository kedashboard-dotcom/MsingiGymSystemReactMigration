import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Shield, Users } from 'lucide-react';

const Home: React.FC = () => {
  const features = [
    { icon: <CheckCircle />, title: 'Instant Registration', desc: 'Register and pay with M-Pesa' },
    { icon: <Shield />, title: 'Secure Payments', desc: 'Safe encrypted transactions' },
    { icon: <Users />, title: '24/7 Access', desc: 'Round-the-clock gym access' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to Msingi Gym</h1>
        <p className="text-xl text-gray-600 mb-8">Transform your fitness journey today</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register" className="btn-primary px-8 py-3">
            Register Now
          </Link>
          <Link to="/renew" className="border-2 border-primary-600 text-primary-600 px-8 py-3 rounded-lg">
            Renew Membership
          </Link>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 bg-white rounded-lg shadow">
              <div className="text-primary-600 flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;