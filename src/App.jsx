import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import Auth from './Auth';

// Fix for Leaflet default marker icons
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 15, { duration: 2 });
  }, [center, map]);
  return null;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({ name: '', phone: '' });
  const [mapCenter, setMapCenter] = useState([26.9124, 75.7873]); // Jaipur

  useEffect(() => {
    const savedUser = localStorage.getItem('current_pink_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setMapCenter([pos.coords.latitude, pos.coords.longitude]),
        null, { enableHighAccuracy: true }
      );
    }
  }, []);

  if (!isAuthenticated) return <Auth onLogin={() => setIsAuthenticated(true)} />;

  return (
    <div className="h-screen w-full flex flex-col font-sans overflow-hidden bg-[#fdfaf5]">
      {/* 1. Heritage Header */}
      <nav className="fixed top-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md shadow-sm flex justify-between items-center z-[1001] border-b-4 border-[#D46A6A]">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-2">
            <h1 className="text-xl font-black text-[#b05656] font-serif leading-none">पधारे सा</h1>
            <span className="text-lg font-light text-[#b05656]">|</span>
            <h1 className="text-lg font-black text-[#b05656] italic">PINK LINE</h1>
          </div>
          <p className="text-[10px] font-bold text-[#d4af37] uppercase tracking-widest mt-1">Jaipur's Royal Security</p>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="absolute w-14 h-14 opacity-60 animate-spin-slow">
            <svg viewBox="0 0 100 100" fill="none" stroke="#b05656" strokeWidth="0.8">
              <circle cx="50" cy="50" r="42" strokeDasharray="2,2" />
              {[...Array(12)].map((_, i) => (
                <path key={i} d="M50 5 L53 15 L47 15 Z" fill="#b05656" transform={`rotate(${i * 30} 50 50)`} />
              ))}
            </svg>
          </div>
          <div className="relative z-10 w-10 h-10 bg-[#b05656] rounded-xl border border-[#d4af37] flex items-center justify-center text-white font-bold">
            {user.name ? user.name[0] : 'T'}
          </div>
        </div>
      </nav>

      {/* 2. Map Background */}
      <div className="flex-1 relative z-0">
        <MapContainer center={mapCenter} zoom={15} className="h-full w-full heritage-map">
          <ChangeView center={mapCenter} />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={mapCenter} />
        </MapContainer>
        <button className="absolute bottom-80 right-6 w-16 h-16 bg-red-600 text-white rounded-full z-[1000] font-black shadow-2xl border-4 border-white animate-pulse">SOS</button>
      </div>

      {/* 3. Ola-Style Bottom Dashboard (Pink Heritage Theme) */}
      <div className="bg-[#D46A6A] p-8 rounded-t-[3.5rem] shadow-[0_-20px_60px_rgba(0,0,0,0.3)] z-[1001] relative overflow-hidden">
        {/* Bandhani Pattern Overlay */}
        <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: `radial-gradient(circle, #ffffff 1.5px, transparent 1.5px)`, backgroundSize: '24px 24px' }}></div>
        
        <div className="relative z-10">
          <div className="w-12 h-1.5 bg-[#FFD700] rounded-full mx-auto mb-8 opacity-60"></div>
          
          {/* Ola Style Search Bar */}
          <div className="bg-[#fdfaf5] rounded-2xl p-4 flex items-center border-2 border-[#FFD700] mb-8 shadow-inner">
            <div className="w-2.5 h-2.5 bg-green-600 rounded-full mr-4"></div>
            <input type="text" placeholder="Where to, Baisa?" className="bg-transparent outline-none w-full text-lg font-bold text-[#111827] placeholder:text-gray-400" />
            <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>

          {/* Quick Service Grid (Rapido Style) */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {['Auto', 'Cab', 'Bike', 'Safety'].map((item) => (
              <div key={item} className="flex flex-col items-center">
                <div className="w-16 h-16 bg-[#b05656] rounded-2xl flex items-center justify-center border border-white/10 shadow-xl hover:border-[#FFD700] transition-all">
                  <span className="text-2xl">🚕</span>
                </div>
                <p className="text-[10px] font-black uppercase text-white tracking-widest mt-2">{item}</p>
              </div>
            ))}
          </div>

          <button className="w-full bg-[#111827] text-white py-5 rounded-2xl font-black text-lg shadow-2xl uppercase tracking-widest active:scale-95 transition-transform">
            Book Secure Ride
          </button>
        </div>
      </div>

      {/* 4. Bottom Navigation */}
      <div className="bg-white border-t border-gray-100 p-4 flex justify-around items-center z-[1001]">
        <div className="flex flex-col items-center text-[#b05656]">
          <span className="text-xl">🏠</span>
          <p className="text-[10px] font-black uppercase mt-1">Ride</p>
        </div>
        <div className="flex flex-col items-center text-gray-400">
          <span className="text-xl">🛡️</span>
          <p className="text-[10px] font-black uppercase mt-1">Safety</p>
        </div>
        <div className="flex flex-col items-center text-gray-400">
          <span className="text-xl">👤</span>
          <p className="text-[10px] font-black uppercase mt-1">Profile</p>
        </div>
      </div>
    </div>
  );
}

export default App;