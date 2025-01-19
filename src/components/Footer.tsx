import React from 'react';

export function Footer() {
  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <img 
              src="/overflow-logo.png" 
              alt="Overflow City Church" 
              className="h-12 mb-4"
            />
            <p className="text-gray-400">
              Encounter God, Discover Purpose, and Make a Difference
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-400">8633 Colesville Rd</p>
            <p className="text-gray-400">Silver Spring, MD 20910</p>
            <p className="text-gray-400">community@overflowcitychurch.com</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Service Times</h3>
            <p className="text-gray-400">Sunday: 10:00 AM</p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Overflow City Church. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}