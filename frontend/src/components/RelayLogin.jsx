import React, { useState } from 'react';
import axios from 'axios';

export default function RelayLogin({ onLogin }) {
  const [employee_id, setEmployeeId] = useState('ADMIN-TWBP');
  const [password, setPassword] = useState('Admin@1234');
  const login = async () => {
    try {
      const res = await axios.post('/api/auth/login', { employee_id, password });
      localStorage.setItem('token', res.data.token);
      if (onLogin) onLogin(res.data.user);
    } catch (err) {
      alert('Login failed: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div style={{maxWidth:420, margin:'40px auto', padding:20, border:'1px solid #eee', borderRadius:8, textAlign:'center'}}>
      <img src="/logo.png" alt="TWBP" style={{maxWidth:240, marginBottom:12}}/>
      <h2>Relay WMS — Employee Login</h2>
      <input placeholder="Employee ID" value={employee_id} onChange={e=>setEmployeeId(e.target.value)} style={{width:'100%',padding:8,margin:'8px 0'}} />
      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:'100%',padding:8,margin:'8px 0'}} />
      <button onClick={login} style={{padding:'8px 16px'}}>Login</button>
    </div>
  );
}
