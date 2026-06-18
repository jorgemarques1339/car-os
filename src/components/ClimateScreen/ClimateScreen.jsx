import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCarStore } from '../../store/useCarStore';
import { Fan, Power, Thermometer } from 'lucide-react';
import './ClimateScreen.css';

export default function ClimateScreen() {
  const { isClimateMenuOpen, toggleClimateMenu, driverTemp, passengerTemp } = useCarStore();

  return (
    <AnimatePresence>
      {isClimateMenuOpen && (
        <motion.div 
          className="climate-screen-container"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        >
          {/* Close Area */}
          <div className="climate-close-area" onClick={toggleClimateMenu}>
            <div className="drag-handle"></div>
          </div>

          <div className="climate-content">
            <h1 className="climate-title">Climate Control</h1>
            
            <div className="climate-interior-mockup">
              <div className="seat driver-seat">
                <span className="seat-temp">{driverTemp.toFixed(1)}°</span>
                <div className="air-flow air-flow-driver">
                  <div className="air-line"></div>
                  <div className="air-line"></div>
                  <div className="air-line"></div>
                </div>
              </div>
              <div className="seat passenger-seat">
                <span className="seat-temp">{passengerTemp.toFixed(1)}°</span>
                <div className="air-flow air-flow-passenger">
                  <div className="air-line"></div>
                  <div className="air-line"></div>
                  <div className="air-line"></div>
                </div>
              </div>
            </div>

            <div className="climate-actions">
              <button className="climate-power-btn">
                <Power size={32} />
              </button>
              <button className="climate-btn active">
                <Fan size={24} />
                <span>Auto</span>
              </button>
              <button className="climate-btn">
                <Thermometer size={24} />
                <span>Keep</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
