import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCarStore } from '../../store/useCarStore';
import { X, Lock, Unlock, Delete } from 'lucide-react';
import { toast } from 'sonner';
import './GloveboxPin.css';

export default function GloveboxPin() {
  const { isGloveboxPinScreenOpen, toggleGloveboxPin } = useCarStore();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const CORRECT_PIN = '1234';

  const handleKeyPress = (num) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      
      if (newPin.length === 4) {
        verifyPin(newPin);
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
    setError(false);
  };

  const verifyPin = (currentPin) => {
    if (currentPin === CORRECT_PIN) {
      setSuccess(true);
      toast.success('Glovebox Aberto');
      setTimeout(() => {
        toggleGloveboxPin();
        setPin('');
        setSuccess(false);
      }, 1000);
    } else {
      setError(true);
      toast.error('PIN Incorreto');
      setTimeout(() => {
        setPin('');
        setError(false);
      }, 500);
    }
  };

  const close = () => {
    toggleGloveboxPin();
    setPin('');
    setError(false);
  };

  return (
    <AnimatePresence>
      {isGloveboxPinScreenOpen && (
        <motion.div 
          className="glovebox-pin-container"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
        >
          <div className="glovebox-header">
            <h3>Glovebox PIN</h3>
            <button className="close-btn" onClick={close}>
              <X size={24} />
            </button>
          </div>

          <div className="glovebox-body">
            {success ? <Unlock size={48} color="#1DB954" /> : <Lock size={48} color={error ? "#ff3b30" : "white"} />}
            <p style={{ marginTop: '1rem', color: error ? '#ff3b30' : 'var(--text-secondary)' }}>
              {error ? 'PIN Incorreto' : 'Introduza o PIN de 4 dígitos'}
            </p>

            <div className={`pin-dots ${error ? 'error-shake' : ''}`}>
              {[0, 1, 2, 3].map(i => (
                <div key={i} className={`pin-dot ${pin.length > i ? 'filled' : ''} ${success ? 'success' : ''}`}></div>
              ))}
            </div>

            <div className="numpad">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button key={num} className="numpad-btn" onClick={() => handleKeyPress(num.toString())}>
                  {num}
                </button>
              ))}
              <div className="numpad-empty"></div>
              <button className="numpad-btn" onClick={() => handleKeyPress('0')}>0</button>
              <button className="numpad-btn delete" onClick={handleDelete}>
                <Delete size={24} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
