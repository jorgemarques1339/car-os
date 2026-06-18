import React, { useState } from 'react';
import { useCarStore } from '../../store/useCarStore';
import { Settings, Car, Camera, Volume2, VolumeX, Wind, Grid3x3 } from 'lucide-react';
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor, TouchSensor } from '@dnd-kit/core';
import { arrayMove, SortableContext, horizontalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { toast } from 'sonner';
import './BottomDock.css';

const SortableItem = ({ id, icon: Icon, onClick, isActive }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: 'none', // Prevent scrolling on touch devices while dragging
  };

  return (
    <button 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners} 
      className={`dock-icon-btn ${isActive ? 'active' : ''} ${id === 'car' ? 'car-highlight' : ''}`} 
      onClick={onClick}
    >
      <Icon size={id === 'car' ? 32 : 28} />
    </button>
  );
};

export default function BottomDock() {
  const { 
    driverTemp, passengerTemp, 
    increaseDriverTemp, decreaseDriverTemp,
    increasePassengerTemp, decreasePassengerTemp,
    heatedSeatsDriver, heatedSeatsPassenger,
    toggleHeatedSeatDriver, toggleHeatedSeatPassenger,
    defrosterActive, toggleDefroster,
    toggleControlCenter, toggleAppDrawer,
    setGear, isMuted, toggleMute, toggleCamera
  } = useCarStore();

  const handleCameraClick = () => {
    toggleCamera();
  };

  const handleVolumeClick = () => {
    toggleMute();
    toast(!isMuted ? 'Áudio Mutado' : 'Áudio Restaurado');
  };

  const handleSettingsClick = () => {
    toast.info('Menu de Configurações Avançadas (Mock)');
  };

  const handleDefrosterClick = () => {
    toggleDefroster();
    toast(defrosterActive ? 'Desembaçador Desligado' : 'Desembaçador Ligado (Potência Máxima)');
  };

  const [dockOrder, setDockOrder] = useState(['car', 'wind', 'volume', 'camera', 'appdrawer']);

  const dockConfig = {
    car: { icon: Car, action: toggleControlCenter },
    wind: { icon: Wind, action: handleDefrosterClick, isActive: defrosterActive },
    volume: { icon: isMuted ? VolumeX : Volume2, action: handleVolumeClick, isActive: isMuted },
    camera: { icon: Camera, action: handleCameraClick },
    appdrawer: { icon: Grid3x3, action: toggleAppDrawer },
  };

  const renderSeatHeater = (level, toggle) => {
    return (
      <button className={`seat-heater level-${level}`} onClick={toggle}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19v2h16v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4z"></path>
          <path d="M8 15V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v10"></path>
          {level > 0 && <path d="M12 9v2" className="heat-wave" stroke="var(--danger-color)" />}
          {level > 1 && <path d="M9 9v2" className="heat-wave" stroke="var(--danger-color)" />}
          {level > 2 && <path d="M15 9v2" className="heat-wave" stroke="var(--danger-color)" />}
        </svg>
      </button>
    );
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setDockOrder((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Requires 8px movement before drag starts, allowing clicks to pass through
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150, // Requires holding for 150ms before dragging on touch
        tolerance: 5,
      },
    })
  );

  return (
    <div className="bottom-dock">
      
      {/* Driver Climate Controls */}
      <div className="climate-control">
        <button className="temp-btn" onClick={decreaseDriverTemp}>&lt;</button>
        <span className="temp-display" onClick={useCarStore(s => s.toggleClimateMenu)} style={{ cursor: 'pointer' }}>{driverTemp.toFixed(1)}°</span>
        <button className="temp-btn" onClick={increaseDriverTemp}>&gt;</button>
      </div>

      {renderSeatHeater(heatedSeatsDriver, toggleHeatedSeatDriver)}

      {/* Center Icons - Sortable Dock */}
      <div className="center-icons">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={dockOrder} strategy={horizontalListSortingStrategy}>
            {dockOrder.map((id) => {
              const item = dockConfig[id];
              return (
                <SortableItem 
                  key={id} 
                  id={id} 
                  icon={item.icon} 
                  onClick={item.action} 
                  isActive={item.isActive}
                />
              );
            })}
          </SortableContext>
        </DndContext>
      </div>

      {renderSeatHeater(heatedSeatsPassenger, toggleHeatedSeatPassenger)}

      {/* Passenger Climate Controls */}
      <div className="climate-control">
        <button className="temp-btn" onClick={decreasePassengerTemp}>&lt;</button>
        <span className="temp-display" onClick={useCarStore(s => s.toggleClimateMenu)} style={{ cursor: 'pointer' }}>{passengerTemp.toFixed(1)}°</span>
        <button className="temp-btn" onClick={increasePassengerTemp}>&gt;</button>
      </div>
      
    </div>
  );
}
