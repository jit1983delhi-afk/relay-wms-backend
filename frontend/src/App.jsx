import React, { useState } from 'react';
import RelayLogin from './components/RelayLogin';
import StockQuality from './pages/StockQuality';

export default function App() {
  const [user, setUser] = useState(null);
  return user ? <StockQuality /> : <RelayLogin onLogin={u => setUser(u)} />;
}
