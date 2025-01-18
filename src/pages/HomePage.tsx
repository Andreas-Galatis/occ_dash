import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

export function HomePage() {
  const { login } = useAuth();

  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative h-screen">
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1510924199351-4e9d94df18a6?auto=format&fit=crop&q=80"
          alt="Church worship"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <img 
                src="/overflow-logo.png" 
                alt="Overflow City Church"
                className="w-64 mb-8"
              />
              <h1 className="text-5xl font-bold text-white mb-6">
                Welcome to Overflow City Church
              </h1>
              <p className="text-xl text-gray-200 mb-8">
                A place where faith overflows and lives are transformed.
              </p>
              <div className="space-x-4">
                <button
                  onClick={login}
                  className="inline-block px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  View Dashboard
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl text-gray-600">
              To create an overflow of God's love in our city through authentic worship,
              meaningful connections, and active community engagement.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}