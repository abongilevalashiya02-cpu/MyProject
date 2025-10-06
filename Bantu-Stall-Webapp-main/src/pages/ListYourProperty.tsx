import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PropertyListingModal from '../components/venues/PropertyListingModal';
import PropertyListingForm from '../components/venues/PropertyListingForm';

const ListYourProperty: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(true); // true = modal, false = full page
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleFormClose = () => {
    setModalOpen(false);
    setFormSubmitted(true);
  };

  const handleFormReset = () => {
    setFormSubmitted(false);
    if (showModal) setModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl mb-6 flex flex-col items-center">
          <div className="flex gap-2 mb-4">
            <button
              className={`px-4 py-2 rounded-l bg-${showModal ? 'bantu-orange' : 'gray-200'} text-${showModal ? 'white' : 'gray-700'} font-semibold shadow`}
              onClick={() => { setShowModal(true); setModalOpen(true); }}
              disabled={showModal}
            >
              Pop-out Form
            </button>
            <button
              className={`px-4 py-2 rounded-r bg-${!showModal ? 'bantu-orange' : 'gray-200'} text-${!showModal ? 'white' : 'gray-700'} font-semibold shadow`}
              onClick={() => { setShowModal(false); setModalOpen(false); }}
              disabled={!showModal}
            >
              Full Page Form
            </button>
          </div>
        </div>
        {showModal ? (
          <>
            <PropertyListingModal isOpen={modalOpen || !formSubmitted} onClose={handleFormClose} />
            {formSubmitted && (
              <div className="text-center mt-12">
                <h2 className="text-2xl font-bold mb-4">Thank you for submitting your property!</h2>
                <p className="mb-6 text-gray-600">Our team will review your listing and contact you soon. If you have questions, please contact <a href="mailto:nontombi@bantustall.com" className="text-bantu-orange underline">Nontombi</a>.</p>
                <button
                  className="px-6 py-2 bg-bantu-orange text-white rounded shadow hover:bg-orange-600 transition"
                  onClick={handleFormReset}
                >
                  List Another Property
                </button>
                <button
                  className="ml-4 px-6 py-2 bg-gray-200 text-gray-700 rounded shadow hover:bg-gray-300 transition"
                  onClick={() => window.location.href = '/'}
                >
                  Back to Home
                </button>
              </div>
            )}
          </>
        ) : (
          !formSubmitted ? (
            <div className="w-full max-w-4xl mx-auto">
              <PropertyListingForm onClose={handleFormClose} />
            </div>
          ) : (
            <div className="text-center mt-12">
              <h2 className="text-2xl font-bold mb-4">Thank you for submitting your property!</h2>
              <p className="mb-6 text-gray-600">Our team will review your listing and contact you soon. If you have questions, please contact <a href="mailto:nontombi@bantustall.com" className="text-bantu-orange underline">Nontombi</a>.</p>
              <button
                className="px-6 py-2 bg-bantu-orange text-white rounded shadow hover:bg-orange-600 transition"
                onClick={handleFormReset}
              >
                List Another Property
              </button>
              <button
                className="ml-4 px-6 py-2 bg-gray-200 text-gray-700 rounded shadow hover:bg-gray-300 transition"
                onClick={() => window.location.href = '/'}
              >
                Back to Home
              </button>
            </div>
          )
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ListYourProperty;
