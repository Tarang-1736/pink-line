import React, { useState } from 'react';

function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', phone: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const existingUsers = JSON.parse(localStorage.getItem('pink_line_users')) || [];
    if (!isLogin) {
      if (existingUsers.find(u => u.phone === formData.phone)) {
        setError("Number already registered!");
        return;
      }
      localStorage.setItem('pink_line_users', JSON.stringify([...existingUsers, formData]));
      localStorage.setItem('current_pink_user', JSON.stringify(formData));
      onLogin();
    } else {
      const user = existingUsers.find(u => u.phone === formData.phone && u.password === formData.password);
      if (user) {
        localStorage.setItem('current_pink_user', JSON.stringify(user));
        onLogin();
      } else {
        setError("Invalid credentials!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F0] flex items-center justify-center p-6">
      <div className="bg-white rounded-[3rem] shadow-2xl p-10 max-w-sm w-full border-t-8 border-[#D46A6A]">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-[#D46A6A] font-serif italic tracking-tighter uppercase">Pink Line</h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">The Heritage of Safety</p>
        </div>
        {error && <div className="p-3 mb-4 bg-red-50 text-red-500 text-[10px] font-bold rounded-xl text-center">{error}</div>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && <input type="text" placeholder="Full Name" required className="w-full p-4 bg-slate-50 rounded-2xl outline-none" onChange={(e) => setFormData({...formData, name: e.target.value})} />}
          <input type="tel" placeholder="Mobile Number" required className="w-full p-4 bg-slate-50 rounded-2xl outline-none" onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          <input type="password" placeholder="Password" required className="w-full p-4 bg-slate-50 rounded-2xl outline-none" onChange={(e) => setFormData({...formData, password: e.target.value})} />
          <button type="submit" className="w-full bg-[#D46A6A] text-white py-5 rounded-2xl font-black text-sm shadow-lg mt-4 uppercase">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <button onClick={() => setIsLogin(!isLogin)} className="w-full mt-8 text-[10px] font-bold text-[#FFD700] uppercase tracking-widest">{isLogin ? "New? Sign Up" : "Back to Login"}</button>
      </div>
    </div>
  );
}

export default Auth;