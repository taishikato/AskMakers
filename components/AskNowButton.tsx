import { useState } from 'react';
import Modal from 'react-modal';
import SignUpModal from './Navbar/SignUpModal';

const AskNowButton = () => {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  return (
    <>
      <a
        onClick={() => setIsSignupModalOpen(true)}
        className="text-white px-6 py-3 bg-green-500 rounded font-semibold"
      >
        Ask Now
      </a>
      <Modal
        isOpen={isSignupModalOpen}
        onRequestClose={() => setIsSignupModalOpen(false)}
        ariaHideApp={false}
        style={{
          overlay: {
            zIndex: 100000,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          },
          content: {
            padding: '1.25rem',
            width: '600px',
            maxWidth: '100%',
            position: 'absolute',
            top: '40%',
            left: '50%',
            bottom: 'none',
            transform: 'translateY(-50%)translateX(-50%)',
            border: 'none',
            backgroundColor: '#f9f9f9',
          },
        }}
      >
        <SignUpModal />
      </Modal>
    </>
  );
};

export default AskNowButton;
