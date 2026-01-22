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
    <div className="min-h-screen bg-[#FFF9F0] flex flex-col justify-center p-6 items-center">
      <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 max-w-md w-full border-t-8 border-[#D46A6A]">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-[#D46A6A] tracking-tighter italic font-serif">PINK LINE</h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">The Heritage of Safety</p>
        </div>
        {error && <div className="p-3 mb-4 bg-red-50 text-red-500 text-xs font-bold rounded-xl">{error}</div>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && <input type="text" placeholder="Name" required className="w-full p-4 bg-slate-50 rounded-2xl outline-none ring-1 ring-slate-100" onChange={(e) => setFormData({...formData, name: e.target.value})} />}
          <input type="tel" placeholder="Mobile Number" required className="w-full p-4 bg-slate-50 rounded-2xl outline-none ring-1 ring-slate-100" onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          <input type="password" placeholder="Password" required className="w-full p-4 bg-slate-50 rounded-2xl outline-none ring-1 ring-slate-100" onChange={(e) => setFormData({...formData, password: e.target.value})} />
          <button type="submit" className="w-full bg-[#D46A6A] text-white py-4 rounded-2xl font-black text-lg shadow-lg uppercase tracking-widest">
            {isLogin ? "LOGIN" : "JOIN SISTERHOOD"}
          </button>
        </form>
        <button onClick={() => setIsLogin(!isLogin)} className="w-full mt-6 text-xs font-bold text-[#FFD700] uppercase tracking-widest">
          {isLogin ? "New to Pink City? Sign Up" : "Back to Login"}
        </button>
      </div>
    </div>
  );
}

export default Auth;