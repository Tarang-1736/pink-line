import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import Auth from './Auth';

// Heritage marker icons
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
  const [activeTab, setActiveTab] = useState('personal');
  const [mapCenter, setMapCenter] = useState([26.9124, 75.7873]);

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

  const updateUserData = (key, value) => {
    const updatedUser = { ...user, [key]: value };
    localStorage.setItem('current_pink_user', JSON.stringify(updatedUser));
    const allUsers = JSON.parse(localStorage.getItem('pink_line_users')) || [];
    const updatedList = allUsers.map(u => u.phone === user.phone ? updatedUser : u);
    localStorage.setItem('pink_line_users', JSON.stringify(updatedList));
    setUser(updatedUser);
  };

  if (!isAuthenticated) return <Auth onLogin={handleLoginSuccess} />;

  return (
    <div className="h-screen w-full flex flex-col font-sans overflow-hidden bg-[#FFF9F0]">
      {/* Heritage Navbar */}
      <nav className="p-4 bg-white shadow-md flex justify-between items-center px-6 border-b-4 border-[#D46A6A] z-[1001]">
        <div className="flex flex-col">
          <h1 className="text-xl font-black text-[#D46A6A] font-serif italic uppercase leading-tight">
            पधारे सा | <span className="text-slate-800 text-lg">Pink Line</span>
          </h1>
          <p className="text-[10px] font-bold text-[#FFD700] uppercase tracking-[0.2em]">Jaipur's Royal Security</p>
        </div>
        
        {/* Profile Section with Visible Mandala */}
        <div className="relative flex items-center justify-center">
          {/* Rotating Mandala SVG */}
          <div className="absolute w-16 h-16 opacity-50 animate-spin-slow pointer-events-none">
            <svg viewBox="0 0 100 100" fill="none" stroke="#D46A6A" strokeWidth="1.2">
              <circle cx="50" cy="50" r="45" strokeDasharray="4,4" />
              <circle cx="50" cy="50" r="25" />
              {[...Array(12)].map((_, i) => (
                <path 
                  key={i} 
                  d="M50 5 L55 15 L45 15 Z" 
                  fill="#D46A6A" 
                  transform={`rotate(${i * 30} 50 50)`} 
                />
              ))}
            </svg>
          </div>
          
          <button 
            onClick={() => setIsSettingsOpen(true)} 
            className="relative z-10 p-1 border-2 border-[#FFD700] rounded-full bg-white active:scale-90 transition-transform"
          >
            <div className="w-10 h-10 rounded-full bg-[#D46A6A] flex items-center justify-center text-white font-black uppercase">
              {user.name ? user.name[0] : 'T'}
            </div>
          </button>
        </div>
      </nav>

      {/* Map Content */}
      <div className="flex-1 relative z-0">
        <MapContainer center={mapCenter} zoom={15} className="h-full w-full heritage-map">
          <ChangeView center={mapCenter} />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={mapCenter}><Popup>Khamma Ghani, {user.name}!</Popup></Marker>
        </MapContainer>
        
        <button 
          onClick={() => alert("SOS Alert Sent!")} 
          className="absolute bottom-10 right-6 w-16 h-16 bg-[#D46A6A] text-white rounded-full z-[1000] font-black shadow-[0_0_20px_rgba(212,106,106,0.6)] animate-pulse border-4 border-white"
        >
          SOS
        </button>
      </div>

      {/* Booking Panel */}
      <div className="bg-white p-6 rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.1)] z-[1001] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#D46A6A_2px,transparent_2px)] [background-size:20px_20px]"></div>
        <div className="relative z-10">
          <div className="w-12 h-1.5 bg-[#FFD700] rounded-full mx-auto mb-6"></div>
          <h2 className="text-xl font-black text-slate-800 font-serif italic mb-4">Your Royal Carriage</h2>
          <div className="space-y-3">
            <input type="text" placeholder="Pickup Location (Palace/Home)" className="w-full p-4 bg-slate-50 rounded-2xl outline-none ring-1 ring-slate-100 focus:ring-2 focus:ring-[#D46A6A]" />
            <input type="text" placeholder="Where to, Baisa?" className="w-full p-4 bg-slate-50 rounded-2xl outline-none ring-1 ring-slate-100 focus:ring-2 focus:ring-[#D46A6A]" />
          </div>
          <button className="w-full bg-[#D46A6A] text-white py-4 rounded-2xl font-black text-lg mt-6 shadow-lg uppercase tracking-widest active:scale-[0.98] transition-all">
            Book Secure Ride
          </button>
        </div>
      </div>

      {/* Settings Drawer */}
      {isSettingsOpen && (
        <div className="absolute inset-0 z-[2000] flex justify-end">
          <div onClick={() => setIsSettingsOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
          <div className="relative w-full max-w-xs bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right">
            <div className="p-6 border-b-4 border-[#FFD700] flex justify-between items-center">
              <h2 className="text-xl font-black text-slate-800 font-serif">Profile Settings</h2>
              <button onClick={() => setIsSettingsOpen(false)} className="text-slate-400 text-2xl">✕</button>
            </div>
            <div className="flex bg-slate-50 p-1 m-4 rounded-2xl font-black text-[10px] uppercase">
              <button onClick={() => setActiveTab('personal')} className={`flex-1 py-3 rounded-xl ${activeTab === 'personal' ? 'bg-white text-[#D46A6A] shadow-sm' : 'text-slate-400'}`}>Personal</button>
              <button onClick={() => setActiveTab('security')} className={`flex-1 py-3 rounded-xl ${activeTab === 'security' ? 'bg-white text-[#D46A6A] shadow-sm' : 'text-slate-400'}`}>Security</button>
            </div>
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              {activeTab === 'personal' ? (
                <>
                  <input type="text" defaultValue={user.name} onBlur={(e) => updateUserData('name', e.target.value)} placeholder="Full Name" className="w-full p-4 bg-slate-50 rounded-xl outline-none ring-1 ring-slate-100 font-bold" />
                  <textarea defaultValue={user.address} onBlur={(e) => updateUserData('address', e.target.value)} placeholder="Jaipur Address" className="w-full p-4 bg-slate-50 rounded-xl outline-none ring-1 ring-slate-100 h-24" />
                </>
              ) : (
                <>
                  <div className="w-full p-4 bg-slate-100 rounded-xl text-slate-400 font-bold">{user.phone}</div>
                  <input type="password" placeholder="New Password" onBlur={(e) => e.target.value && updateUserData('password', e.target.value)} className="w-full p-4 bg-slate-50 rounded-xl outline-none ring-1 ring-slate-100 focus:ring-2 focus:ring-[#D46A6A]" />
                </>
              )}
            </div>
            <div className="p-6">
              <button onClick={handleLogout} className="w-full bg-[#D46A6A] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg">Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;