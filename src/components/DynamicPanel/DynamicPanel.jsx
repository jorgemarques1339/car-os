import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { toast } from 'sonner';
import { useCarStore } from '../../store/useCarStore';
import { Map, Music, Navigation, Compass, AlertTriangle } from 'lucide-react';
import './DynamicPanel.css';

// Fix Leaflet marker icons not showing by default in Vite
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Component to handle GPS and camera flyTo
function LocationMarker() {
  const [position, setPosition] = useState(null);
  const map = useMap();

  useEffect(() => {
    // Pedir permissão GPS ao browser
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = [pos.coords.latitude, pos.coords.longitude];
          setPosition(coords);
          map.flyTo(coords, 16, { animate: true, duration: 2 });
          toast.success("GPS localizado com sucesso");
        },
        (err) => {
          console.warn("GPS error:", err);
          toast.error("Acesso ao GPS negado ou falhou.");
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      toast.error("O seu browser não suporta GPS.");
    }
  }, [map]);

  return position === null ? null : (
    <Marker position={position}>
      <Popup>O seu veículo está aqui.</Popup>
    </Marker>
  );
}

// Mock Component for Rear Camera
function RearCamera() {
  return (
    <motion.div 
      className="rear-camera-view"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
    >
      <div className="camera-feed">
        <div className="camera-overlay">
          {/* Guide lines */}
          <div className="guide-line left-line"></div>
          <div className="guide-line right-line"></div>
          <div className="guide-line center-line"></div>
          <div className="camera-warning">
            <AlertTriangle color="var(--warning-color)" size={24} />
            <span>Check surroundings for safety</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function DynamicPanel() {
  const { currentSong, isPlaying, togglePlay, gear } = useCarStore();

  return (
    <div className="dynamic-panel">
      <AnimatePresence mode="wait">
        {gear === 'R' ? (
          <RearCamera key="camera" />
        ) : (
          <motion.div 
            key="map"
            className="map-view-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ width: '100%', height: '100%' }}
          >
            {/* Real Map Integration */}
            <div className="map-background">
              <MapContainer 
                center={[38.7223, -9.1393]} // Default to Lisbon if no GPS
                zoom={14} 
                zoomControl={false}
                style={{ width: '100%', height: '100%', background: '#0a0a0a' }}
              >
                {/* Esri World Imagery (Satellite) */}
                <TileLayer
                  attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                />
                <LocationMarker />
              </MapContainer>
              <div className="map-overlay"></div>
            </div>

            {/* Floating Widgets Section */}
            <div className="widgets-carousel">
              
              {/* Media Widget */}
              <div className="widget media-widget snap-item">
                <img src={currentSong.cover} alt="Cover" className="album-cover" />
                <div className="media-info">
                  <h4 className="song-title">{currentSong.title}</h4>
                  <p className="song-artist">{currentSong.artist}</p>
                </div>
                <button className="play-btn" onClick={togglePlay}>
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
              </div>
              
              {/* Trip Info Widget */}
              <div className="widget trip-widget snap-item">
                <Compass size={24} color="var(--text-secondary)" />
                <div className="trip-info">
                  <span className="trip-label">Current Trip</span>
                  <span className="trip-value">12.4 km</span>
                </div>
              </div>

              {/* Energy Widget Mock */}
              <div className="widget energy-widget snap-item">
                <div className="trip-info">
                  <span className="trip-label">Avg. Energy</span>
                  <span className="trip-value">145 Wh/km</span>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
