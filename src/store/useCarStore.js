import { create } from 'zustand';

export const useCarStore = create((set) => ({
  // Vehicle Status
  speed: 0,
  gear: 'P', // P, R, N, D
  batteryLevel: 85, // %
  range: 340, // km
  doorsLocked: true,
  headlights: false,
  isControlCenterOpen: false,
  isAutopilotActive: false,
  isClimateMenuOpen: false,
  isAppDrawerOpen: false,
  isMediaCenterOpen: false,
  isMuted: false,
  
  // Climate Control
  driverTemp: 21.0, // Celsius
  passengerTemp: 21.0,
  heatedSeatsDriver: 0, // 0, 1, 2, 3
  heatedSeatsPassenger: 0,
  defrosterActive: false,
  
  // Media State
  isPlaying: false,
  currentSong: {
    title: 'Starboy',
    artist: 'The Weeknd, Daft Punk',
    cover: 'https://i.scdn.co/image/ab67616d0000b2734718e2b124f79258be7bc452'
  },

  // Actions
  // Vehicle Actions
  setSpeed: (newSpeed) => set({ speed: newSpeed }),
  setGear: (gear) => set({ gear }),
  toggleDoors: () => set((state) => ({ doorsLocked: !state.doorsLocked })),
  toggleHeadlights: () => set((state) => ({ headlights: !state.headlights })),
  toggleControlCenter: () => set((state) => ({ isControlCenterOpen: !state.isControlCenterOpen })),
  toggleAutopilot: () => set((state) => ({ isAutopilotActive: !state.isAutopilotActive })),
  toggleClimateMenu: () => set((state) => ({ isClimateMenuOpen: !state.isClimateMenuOpen })),
  toggleAppDrawer: () => set((state) => ({ isAppDrawerOpen: !state.isAppDrawerOpen })),
  toggleMediaCenter: () => set((state) => ({ isMediaCenterOpen: !state.isMediaCenterOpen })),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  
  // Climate Actions
  increaseDriverTemp: () => set((state) => ({ driverTemp: Math.min(state.driverTemp + 0.5, 30) })),
  decreaseDriverTemp: () => set((state) => ({ driverTemp: Math.max(state.driverTemp - 0.5, 15) })),
  increasePassengerTemp: () => set((state) => ({ passengerTemp: Math.min(state.passengerTemp + 0.5, 30) })),
  decreasePassengerTemp: () => set((state) => ({ passengerTemp: Math.max(state.passengerTemp - 0.5, 15) })),
  toggleHeatedSeatDriver: () => set((state) => ({ heatedSeatsDriver: (state.heatedSeatsDriver + 1) % 4 })),
  toggleHeatedSeatPassenger: () => set((state) => ({ heatedSeatsPassenger: (state.heatedSeatsPassenger + 1) % 4 })),
  toggleDefroster: () => set((state) => ({ defrosterActive: !state.defrosterActive })),
  
  // Media Actions
  setVolume: (volume) => set({ volume }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying }))
}));
