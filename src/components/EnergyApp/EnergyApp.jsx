import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCarStore } from '../../store/useCarStore';
import { X, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import './EnergyApp.css';

export default function EnergyApp() {
  const { isEnergyAppOpen, toggleEnergyApp, energyHistory } = useCarStore();

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const val = payload[0].value;
      return (
        <div className="energy-tooltip">
          <p>{val > 0 ? 'Consumo' : 'Regeneração'}</p>
          <h4>{Math.abs(val)} kW</h4>
        </div>
      );
    }
    return null;
  };

  return (
    <AnimatePresence>
      {isEnergyAppOpen && (
        <motion.div 
          className="energy-app-container"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        >
          <div className="energy-header">
            <div className="energy-title">
              <Zap size={24} color="#1DB954" />
              <h2>Consumo de Energia</h2>
            </div>
            <button className="close-btn" onClick={toggleEnergyApp}>
              <X size={28} />
            </button>
          </div>

          <div className="energy-body">
            <div className="energy-stats">
              <div className="stat-box">
                <span className="stat-label">Média Ult. 20s</span>
                <span className="stat-value">
                  {Math.round(energyHistory.reduce((acc, curr) => acc + curr.value, 0) / 20)} kW
                </span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Regeneração</span>
                <span className="stat-value text-green">Ativa</span>
              </div>
            </div>

            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={energyHistory}
                  margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                  <XAxis dataKey="time" hide />
                  <YAxis domain={[-50, 100]} hide />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.2)' }} />
                  <ReferenceLine y={0} stroke="#888" strokeDasharray="3 3" />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#1DB954" 
                    strokeWidth={4} 
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="energy-disclaimer">Acelere (W) para aumentar o consumo. Trave (S) para regenerar energia para a bateria.</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
