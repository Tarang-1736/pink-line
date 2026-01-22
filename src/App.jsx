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
  const [user, setUser] = useState({ name: '', phone: '', password: '', address: '' });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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

  const handleLoginSuccess = () => {
    const savedUser = localStorage.getItem('current_pink_user');
    if (savedUser) setUser(JSON.parse(savedUser));
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('current_pink_user');
    setIsAuthenticated(false);
    setIsSettingsOpen(false);
  };

  if (!isAuthenticated) return <Auth onLogin={handleLoginSuccess} />;

  return (
    <div className="h-screen w-full flex flex-col font-sans overflow-hidden bg-[#fdfaf5]">
      {/* EXACT MATCH: Heritage Header */}
      <nav className="p-6 bg-[#fdfaf5] flex justify-between items-center z-[1001] border-b border-orange-100">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-2">
            <h1 className="text-[28px] font-black text-[#b05656] font-serif leading-none">पधारे सा</h1>
            <span className="text-xl font-light text-[#b05656] mx-1">|</span>
            <h1 className="text-2xl font-black text-[#b05656] italic tracking-tight">PINK LINE</h1>
          </div>
          <p className="text-[12px] font-bold text-[#d4af37] uppercase tracking-[0.1em] mt-1">Jaipur's Royal Security</p>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="absolute w-20 h-20 opacity-80 animate-spin-slow">
            <svg viewBox="0 0 100 100" fill="none" stroke="#b05656" strokeWidth="0.8">
              <circle cx="50" cy="50" r="42" strokeDasharray="2,2" />
              {[...Array(24)].map((_, i) => (
                <path key={i} d="M50 4 L52 12 L48 12 Z" fill="#b05656" transform={`rotate(${i * 15} 50 50)`} />
              ))}
            </svg>
          </div>
          <button onClick={() => setIsSettingsOpen(true)} className="relative z-10 w-14 h-14 bg-[#b05656] rounded-xl border-2 border-[#d4af37] flex items-center justify-center shadow-md active:scale-95 transition-transform">
            <span className="text-2xl font-black text-white uppercase">{user.name ? user.name[0] : 'T'}</span>
          </button>
        </div>
      </nav>

      {/* Map Content with Heritage Parchment Filter */}
      <div className="flex-1 relative z-0">
        <MapContainer center={mapCenter} zoom={15} className="h-full w-full heritage-map">
          <ChangeView center={mapCenter} />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={mapCenter}><Popup>Khamma Ghani, {user.name}!</Popup></Marker>
        </MapContainer>
        <button className="absolute bottom-10 right-10 w-20 h-20 bg-red-600 text-white rounded-full z-[1000] font-black shadow-[0_0_30px_rgba(220,38,38,0.5)] border-4 border-white animate-pulse">SOS</button>
      </div>

      {/* EXACT MATCH: "Your Royal Carriage" Booking Panel */}
      <div className="bg-[#D46A6A] p-10 rounded-t-[3.5rem] shadow-[0_-20px_60px_rgba(0,0,0,0.2)] z-[1001] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: `radial-gradient(circle, #ffffff 1.5px, transparent 1.5px)`, backgroundSize: '24px 24px' }}></div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-1.5 bg-[#FFD700] rounded-full mb-8 opacity-80"></div>
          <h2 className="text-2xl font-black text-white font-serif italic mb-8 tracking-tight">Your Royal Carriage</h2>
          <div className="w-full max-w-lg space-y-5">
            <div className="relative">
              <input type="text" placeholder="Pickup Location (Palace/Home)" className="w-full py-5 px-8 bg-[#fdfaf5] rounded-full outline-none border-2 border-[#FFD700] text-[#0f172a] font-medium shadow-inner" />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
            </div>
            <button className="w-full bg-[#b05656] text-white py-5 rounded-full font-black text-xl shadow-lg uppercase tracking-wide">Book Secure Ride</button>
          </div>
        </div>
      </div>

      {/* EXACT MATCH: Modern Profile Settings Drawer */}
      {isSettingsOpen && (
        <div className="absolute inset-0 z-[2000] flex justify-end">
          <div onClick={() => setIsSettingsOpen(false)} className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
          <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col p-8 animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-[28px] font-black text-[#1e293b] tracking-tight">Profile Settings</h2>
              <button onClick={() => setIsSettingsOpen(false)} className="text-slate-400 text-3xl font-light">✕</button>
            </div>
            <div className="space-y-10 flex-1">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">Full Name</label>
                <div className="w-full p-6 bg-[#f8fafc] rounded-[1.5rem]"><p className="text-xl font-black text-[#0f172a] tracking-tight">{user.name || "Tarang Shandilya"}</p></div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">Verified Phone</label>
                <div className="w-full p-6 bg-[#f8fafc] rounded-[1.5rem]"><p className="text-xl font-bold text-slate-400 tracking-tight leading-none">{user.phone || "9351789086"}</p></div>
              </div>
            </div>
            <div className="mt-auto"><button onClick={handleLogout} className="w-full bg-[#111827] text-white py-6 rounded-[1.5rem] font-black text-lg tracking-[0.15em] uppercase shadow-xl transition-all">Secure Logout</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;