import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCarStore } from '../../store/useCarStore';
import { Music, Map, Settings, Camera, Gamepad2, Phone, Calendar, Video, Book, Compass, MessageSquare, Zap, Tv, Radio, MonitorPlay, Navigation } from 'lucide-react';
import './AppDrawer.css';

export default function AppDrawer() {
  const { isAppDrawerOpen, toggleAppDrawer, toggleMediaCenter, toggleCamera, toggleEnergyApp } = useCarStore();

  const handleAppClick = (appName) => {
    toggleAppDrawer(); // Fecha a gaveta
    if (appName === 'Spotify') {
      toggleMediaCenter();
    }
    if (appName === 'Câmaras') {
      toggleCamera();
    }
    if (appName === 'Energia') {
      toggleEnergyApp();
    }
  };

  const apps = [
    { name: 'Spotify', icon: Music, color: '#1DB954' },
    { name: 'Câmaras', icon: Camera, color: '#333' },
    { name: 'Energia', icon: Zap, color: '#1DB954' },
    { name: 'Arcade', icon: Gamepad2, color: '#E1306C' },
    { name: 'Netflix', icon: Tv, color: '#E50914' },
    { name: 'YouTube', icon: MonitorPlay, color: '#FF0000' },
    { name: 'Nav', icon: Navigation, color: '#3B82F6' },
    { name: 'Messages', icon: MessageSquare, color: '#10B981' },
    { name: 'Arcade', icon: Gamepad2, color: '#8B5CF6' },
    { name: 'Calendar', icon: Calendar, color: '#EC4899' },
  ];

  return (
    <AnimatePresence>
      {isAppDrawerOpen && (
        <>
          <motion.div 
            className="app-drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleAppDrawer}
          />
          <motion.div 
            className="app-drawer-container"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="app-drawer-grid">
              {apps.map((app, index) => (
                <div key={index} className="app-icon-wrapper" onClick={() => handleAppClick(app.name)}>
                  <div className="app-icon" style={{ backgroundColor: app.color }}>
                    <app.icon size={36} color="white" />
                  </div>
                  <span className="app-name">{app.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
