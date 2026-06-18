import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCarStore } from '../../store/useCarStore';
import { Play, Pause, SkipBack, SkipForward, X, Shuffle, Repeat } from 'lucide-react';
import './MediaCenter.css';

export default function MediaCenter() {
  const { isMediaCenterOpen, toggleMediaCenter, currentSong, isPlaying, togglePlay } = useCarStore();
  const [progress, setProgress] = useState(0); // 0 to 100

  // Simulate progress bar moving when playing
  useEffect(() => {
    let interval;
    if (isPlaying && isMediaCenterOpen) {
      interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) return 0;
          return p + 0.5; // Avança 0.5% por cada 500ms
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isMediaCenterOpen]);

  const handleDragProgress = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newProgress = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setProgress(newProgress);
  };

  return (
    <AnimatePresence>
      {isMediaCenterOpen && (
        <motion.div 
          className="media-center-container"
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        >
          <div className="media-center-header">
            <h3>Spotify</h3>
            <button className="close-media-btn" onClick={toggleMediaCenter}>
              <X size={24} />
            </button>
          </div>

          <div className="media-center-body">
            <img src={currentSong.cover} alt="Album Cover" className="media-big-cover" />
            <div className="media-details">
              <h2>{currentSong.title}</h2>
              <p>{currentSong.artist}</p>
            </div>
            
            {/* Progress Bar */}
            <div className="progress-container" onClick={handleDragProgress}>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }}>
                  <div className="progress-handle"></div>
                </div>
              </div>
              <div className="progress-times">
                <span>0:{Math.floor((progress / 100) * 180).toString().padStart(2, '0')}</span>
                <span>3:00</span>
              </div>
            </div>

            {/* Controls */}
            <div className="media-controls-main">
              <button className="media-icon-btn"><Shuffle size={20} /></button>
              <button className="media-icon-btn"><SkipBack size={32} fill="white" /></button>
              <button className="media-play-btn" onClick={togglePlay}>
                {isPlaying ? <Pause size={40} fill="white" /> : <Play size={40} fill="white" style={{marginLeft: '4px'}} />}
              </button>
              <button className="media-icon-btn"><SkipForward size={32} fill="white" /></button>
              <button className="media-icon-btn"><Repeat size={20} /></button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
