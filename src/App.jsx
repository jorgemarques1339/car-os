import React from 'react';
import { motion } from 'framer-motion';
import { useCarStore } from './store/useCarStore';
import VehiclePanel from './components/VehiclePanel/VehiclePanel';
import DynamicPanel from './components/DynamicPanel/DynamicPanel';
import BottomDock from './components/BottomDock/BottomDock';
import TopBar from './components/TopBar/TopBar';
import ControlCenter from './components/ControlCenter/ControlCenter';
import ClimateScreen from './components/ClimateScreen/ClimateScreen';
import AppDrawer from './components/AppDrawer/AppDrawer';
import MediaCenter from './components/MediaCenter/MediaCenter';
import { useDriveSimulation } from './hooks/useDriveSimulation';
import './App.css';

function App() {
  const { gear, isAutopilotActive } = useCarStore();
  
  // Inicia simulação de condução global
  useDriveSimulation();

  return (
    <div className="app-container">
      <TopBar />
      <ControlCenter />
      <ClimateScreen />
      <AppDrawer />
      <MediaCenter />
      <div className="main-content">
        <motion.div 
          layout 
          initial={false}
          animate={{ flex: isAutopilotActive ? 1 : (gear === 'R' ? 0.4 : 1) }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          style={{ display: 'flex', flexDirection: 'column', height: '100%', minWidth: isAutopilotActive ? '100%' : 'auto', zIndex: 5 }}
        >
          <VehiclePanel />
        </motion.div>
        
        <motion.div 
          layout 
          initial={false}
          animate={{ 
            flex: isAutopilotActive ? 0 : (gear === 'R' ? 3 : 2),
            opacity: isAutopilotActive ? 0 : 1,
            minWidth: isAutopilotActive ? 0 : 'auto'
          }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', overflow: 'hidden' }}
        >
          <DynamicPanel />
        </motion.div>
      </div>
      <BottomDock />
    </div>
  );
}

export default App;
