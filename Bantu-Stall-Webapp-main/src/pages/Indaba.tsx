
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import IndabaComponent from '../components/indaba/Indaba';

const Indaba: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <IndabaComponent />
      </main>
      <Footer />
    </div>
  );
};

export default Indaba;
