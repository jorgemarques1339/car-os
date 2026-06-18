import React from 'react';
import { useCarStore } from '../../store/useCarStore';
import { BatteryMedium, Zap, Lock, Unlock, Lightbulb, View } from 'lucide-react';
import { toast } from 'sonner';
import Car3DModel from './Car3DModel';
import './VehiclePanel.css';

export default function VehiclePanel() {
  const { speed, gear, batteryLevel, range, doorsLocked, toggleDoors, setGear, energyHistory } = useCarStore();
  const avgConsumption = Math.round(energyHistory.reduce((acc, curr) => acc + curr.value, 0) / (energyHistory.length || 1));

  const handleGearChange = (g) => {
    setGear(g);
    if (g === 'R') toast('Rear Camera Activated');
    if (g === 'D') toast.success('Drive Mode Engaged');
    if (g === 'P') toast('Vehicle Parked');
  };

  const renderGears = () => {
    const gears = ['P', 'R', 'N', 'D'];
    return (
      <div className="gear-selector">
        {gears.map((g) => (
          <span 
            key={g} 
            className={`gear ${gear === g ? 'active' : ''}`}
            onClick={() => handleGearChange(g)}
            style={{ cursor: 'pointer' }}
          >
            {g}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="vehicle-panel" style={{ borderRight: useCarStore(s => s.isAutopilotActive) ? 'none' : '' }}>
      {/* Top Section: Status Info */}
      <div className="status-header">
        <div className="status-icons">
          <button className="icon-btn" onClick={() => {
            toggleDoors();
            toast(!doorsLocked ? 'Doors Locked' : 'Doors Unlocked');
          }}>
            {doorsLocked ? <Lock size={20} /> : <Unlock size={20} />}
          </button>
          <button className={`icon-btn ${useCarStore(s => s.headlights) ? 'active' : ''}`} onClick={() => {
            useCarStore.getState().toggleHeadlights();
            toast(useCarStore.getState().headlights ? 'Headlights ON' : 'Headlights OFF');
          }}>
            <Lightbulb size={20} color={useCarStore(s => s.headlights) ? 'var(--warning-color)' : 'var(--text-primary)'} />
          </button>
          <button className={`icon-btn ${useCarStore(s => s.isAutopilotActive) ? 'active' : ''}`} onClick={() => {
            useCarStore.getState().toggleAutopilot();
            toast.success(useCarStore.getState().isAutopilotActive ? 'Autopilot Engaged' : 'Autopilot Disengaged');
          }}>
            <View size={20} color={useCarStore(s => s.isAutopilotActive) ? 'var(--accent-color)' : 'var(--text-primary)'} />
          </button>
        </div>
        
        <div className="battery-widget">
          <div className="battery-level">
            <BatteryMedium size={24} className="battery-icon" color={batteryLevel > 20 ? 'var(--success-color)' : 'var(--danger-color)'} />
            <span className="battery-text" style={{ color: batteryLevel > 20 ? "white" : "var(--danger-color)" }}>
              {batteryLevel.toFixed(1)}%
            </span>
          </div>
          <div className="avg-consumption">
            <Zap size={16} color="var(--text-secondary)" />
            <span>Média: {avgConsumption} kW</span>
          </div>
        </div>
      </div>

      {/* Speedometer Section */}
      <div className="speed-section">
        <div className="speed-value">{speed}</div>
        <div className="speed-unit">km/h</div>
      </div>
      
      {/* Gear Selector */}
      {renderGears()}

      {/* 3D Car Model */}
      <div className="car-placeholder">
        <Car3DModel />
      </div>
    </div>
  );
}
