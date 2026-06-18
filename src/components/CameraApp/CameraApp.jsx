import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCarStore } from '../../store/useCarStore';
import { X, Camera, Video, AlertCircle, Grid3x3 } from 'lucide-react';
import './CameraApp.css';

export default function CameraApp() {
  const { isCameraOpen, toggleCamera } = useCarStore();
  const [activeView, setActiveView] = useState('Grid');

  const views = ['Front', 'Rear', 'Left', 'Right'];

  return (
    <AnimatePresence>
      {isCameraOpen && (
        <motion.div 
          className="camera-app-container"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        >
          <div className="camera-header">
            <div className="camera-title">
              <Camera size={24} />
              <h2>Sentry Mode & Dashcam</h2>
              <span className="recording-dot"></span>
              <span className="recording-text">REC</span>
            </div>
            <button className="close-btn" onClick={toggleCamera}>
              <X size={28} />
            </button>
          </div>

          <div className="camera-body">
            {activeView === 'Grid' ? (
              <div className="camera-grid">
                {views.map(view => (
                  <div key={view} className="camera-feed grid-item" onClick={() => setActiveView(view)}>
                    <p className="camera-label">{view}</p>
                    <div className="video-simulation noise"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="camera-feed-wrapper fullscreen-feed">
                <div className="camera-feed">
                  <p className="camera-label">{activeView} Camera</p>
                  <div className="video-simulation noise"></div>
                  <div className="video-overlay-data">
                    <span>{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</span>
                    <span>14 km/h</span>
                  </div>
                </div>
              </div>
            )}

            <div className="camera-controls">
              <button 
                className={`cam-view-btn ${activeView === 'Grid' ? 'active' : ''}`}
                onClick={() => setActiveView('Grid')}
              >
                <Grid3x3 size={20} />
                <span>All</span>
              </button>
              {views.map(view => (
                <button 
                  key={view}
                  className={`cam-view-btn ${activeView === view ? 'active' : ''}`}
                  onClick={() => setActiveView(view)}
                >
                  <Video size={20} />
                  <span>{view}</span>
                </button>
              ))}
            </div>

            <div className="camera-footer">
              <button className="sentry-alert-btn">
                <AlertCircle size={20} />
                <span>Save Clip no USB</span>
              </button>
              <p>120 GB Available</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
