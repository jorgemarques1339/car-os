import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCarStore } from '../../store/useCarStore';
import { Lock, Unlock, Zap, Car, Settings, Shield, MonitorSmartphone, Bluetooth } from 'lucide-react';
import './ControlCenter.css';

export default function ControlCenter() {
  const { isControlCenterOpen, toggleControlCenter, doorsLocked, toggleDoors } = useCarStore();
  const [activeTab, setActiveTab] = useState('quick');

  const tabs = [
    { id: 'quick', label: 'Quick Controls', icon: Zap },
    { id: 'display', label: 'Display', icon: MonitorSmartphone },
    { id: 'autopilot', label: 'Autopilot', icon: Shield },
    { id: 'software', label: 'Software', icon: Settings }
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'quick':
        return (
          <>
            <h3 className="cc-title">Quick Controls</h3>
            <div className="cc-grid">
              <div 
                className={`cc-btn ${doorsLocked ? 'active' : ''}`}
                onClick={toggleDoors}
              >
                {doorsLocked ? <Lock size={28} /> : <Unlock size={28} />}
                <span>{doorsLocked ? 'Portas Trancadas' : 'Portas Destrancadas'}</span>
              </div>
              <div className="cc-btn">
                <Car size={28} />
                <span>Espelhos</span>
              </div>
              <div className="cc-btn active">
                <Zap size={28} />
                <span>Modo Sentry</span>
              </div>
              <div className="cc-btn">
                <Bluetooth size={28} />
                <span>Bluetooth</span>
              </div>
            </div>
          </>
        );
      case 'display':
        return (
          <>
            <h3 className="cc-title">Display Settings</h3>
            <div className="cc-slider-container">
              <label>Brilho do Ecrã</label>
              <input type="range" min="0" max="100" defaultValue="80" className="cc-slider" />
            </div>
            <div className="cc-grid">
              <div className="cc-btn active">Dark Mode</div>
              <div className="cc-btn">Light Mode</div>
            </div>
          </>
        );
      case 'autopilot':
        return (
          <>
            <h3 className="cc-title">Autopilot</h3>
            <p style={{ color: '#888', marginBottom: '2rem' }}>Full Self-Driving (Supervised)</p>
            <div className="cc-toggle-row">
              <span>Auto Steer (Beta)</span>
              <div className="toggle-switch active"></div>
            </div>
            <div className="cc-toggle-row">
              <span>Traffic Light Control</span>
              <div className="toggle-switch active"></div>
            </div>
          </>
        );
      case 'software':
        return (
          <div className="software-tab">
            <h3 className="cc-title">Software</h3>
            <h2>CarOs v12.0.4</h2>
            <p>O seu software está atualizado.</p>
            <img src="https://placehold.co/300x150/111/fff?text=Model+Car" alt="Car" className="software-car-img" />
            <button className="software-update-btn">Verificar Atualizações</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isControlCenterOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            className="control-center-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleControlCenter}
          />

          {/* Modal Panel */}
          <motion.div 
            className="control-center-panel"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="cc-layout">
              <div className="cc-sidebar">
                {tabs.map(tab => (
                  <button 
                    key={tab.id}
                    className={`cc-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <tab.icon size={20} />
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="cc-content-area">
                {renderContent()}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
