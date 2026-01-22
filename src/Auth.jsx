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
        setError("Already registered!"); return;
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
    <div className="min-h-screen bg-[#fdfaf5] flex items-center justify-center p-6">
      <div className="bg-white rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.1)] p-10 max-w-sm w-full border-t-8 border-[#b05656]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-[#b05656] font-serif italic uppercase">Pink Line</h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Heritage of Safety</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && <input type="text" placeholder="Full Name" required className="w-full p-4 bg-slate-50 rounded-2xl outline-none border border-slate-100 focus:ring-2 focus:ring-[#b05656]" onChange={(e) => setFormData({...formData, name: e.target.value})} />}
          <input type="tel" placeholder="Mobile Number" required className="w-full p-4 bg-slate-50 rounded-2xl outline-none border border-slate-100 focus:ring-2 focus:ring-[#b05656]" onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          <input type="password" placeholder="Password" required className="w-full p-4 bg-slate-50 rounded-2xl outline-none border border-slate-100 focus:ring-2 focus:ring-[#b05656]" onChange={(e) => setFormData({...formData, password: e.target.value})} />
          <button type="submit" className="w-full bg-[#b05656] text-white py-5 rounded-2xl font-black shadow-lg mt-4 active:scale-95 transition-all uppercase tracking-widest">{isLogin ? "Login" : "Sign Up"}</button>
        </form>
        <button onClick={() => setIsLogin(!isLogin)} className="w-full mt-6 text-[10px] font-bold text-[#d4af37] uppercase tracking-widest">{isLogin ? "New to Pink City? Sign Up" : "Back to Login"}</button>
      </div>
    </div>
  );
}

export default Auth;