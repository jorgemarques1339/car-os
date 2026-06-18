import { useEffect, useRef } from 'react';
import { useCarStore } from '../store/useCarStore';
import { toast } from 'sonner';

export function useDriveSimulation() {
  const { speed, setSpeed, gear, setGear, doorsLocked, toggleDoors } = useCarStore();
  
  // Usamos useRef para rastrear as teclas ativas para podermos atualizar a velocidade no loop de frame
  const keys = useRef({ w: false, s: false });
  // Variável local pura para cálculos (desligada do React lifecycle)
  const currentSpeedRef = useRef(useCarStore.getState().speed);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === 'w') keys.current.w = true;
      if (e.key.toLowerCase() === 's') keys.current.s = true;
    };

    const handleKeyUp = (e) => {
      if (e.key.toLowerCase() === 'w') keys.current.w = false;
      if (e.key.toLowerCase() === 's') keys.current.s = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    let animationFrameId;
    let lastTime = performance.now();

    const loop = (time) => {
      const delta = (time - lastTime) / 1000; // seconds
      lastTime = time;

      let currentSpeed = currentSpeedRef.current;
      const acceleration = 40; // km/h por segundo
      const braking = 80; // km/h por segundo
      const friction = 10; // km/h por segundo
      
      let energyCurrent = 0;

      if (keys.current.w) {
        currentSpeed += acceleration * delta;
        energyCurrent = 50; // Consumo alto
      } else if (keys.current.s) {
        currentSpeed -= braking * delta;
        if (currentSpeed > 0) energyCurrent = -30; // Regeneração
      } else {
        // Natural friction
        if (currentSpeed > 0) {
          currentSpeed -= friction * delta;
          energyCurrent = 5; // Consumo passivo
        }
        if (currentSpeed < 0) currentSpeed += friction * delta;
      }

      // Clamp speed
      if (currentSpeed < 0) currentSpeed = 0;
      if (currentSpeed > 220) currentSpeed = 220; 

      // Snap to 0 if very slow
      if (currentSpeed < 1 && !keys.current.w && !keys.current.s) {
        currentSpeed = 0;
      }
      
      currentSpeedRef.current = currentSpeed; // Update inner speed immediately

      // Se começar a andar, mudar para D e trancar as portas automaticamente
      if (currentSpeed > 0 && useCarStore.getState().gear !== 'D') {
        useCarStore.getState().setGear('D');
        if (!useCarStore.getState().doorsLocked) {
          useCarStore.getState().toggleDoors();
          toast.success('Portas trancadas automaticamente');
        }
      }

      // Atualizar o React UI APENAS se a velocidade formatada (arredondada) mudar!
      const roundedSpeed = Math.round(currentSpeed);
      if (roundedSpeed !== useCarStore.getState().speed) {
        useCarStore.getState().setSpeed(roundedSpeed);
      }

      // Atualizar o gráfico de energia a cada 1 segundo (usando delta time rudimentar)
      // Como não guardamos lastEnergyTime global, usamos a mudança de Segundos real do relógio
      const currentSecond = new Date().getSeconds();
      if (!keys.current.lastSec || keys.current.lastSec !== currentSecond) {
        keys.current.lastSec = currentSecond;
        if (currentSpeed === 0) energyCurrent = 0;
        useCarStore.getState().addEnergyData(energyCurrent);
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animationFrameId);
  }, [setSpeed]);
}
