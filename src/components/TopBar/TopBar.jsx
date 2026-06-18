import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Bluetooth, User } from 'lucide-react';
import './TopBar.css';

export default function TopBar() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="top-bar">
      {/* Left side: Profile & Status */}
      <div className="top-bar-left">
        <div className="profile-badge">
          <User size={16} />
          <span>Wolfi</span>
        </div>
        <div className="status-icons-top">
          <Wifi size={16} />
          <Bluetooth size={16} />
          <BatteryMedium size={16} color="var(--success-color)" />
        </div>
      </div>

      {/* Right side: Time and Temp */}
      <div className="top-bar-right">
        <span className="outside-temp">18°C</span>
        <span className="time-display">{formatTime(time)}</span>
      </div>
    </div>
  );
}
