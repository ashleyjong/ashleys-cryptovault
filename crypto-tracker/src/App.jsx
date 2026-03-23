import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CryptoCard from './components/CryptoCard';
import './App.css';

function App() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('app-theme') || 'light');
  const [searchTerm, setSearchTerm] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(60);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('app-theme', newTheme);  
  };

  const fetchCryptoData = async () => {
    setLoading(true); 
    setError(false);
    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,cardano&order=market_cap_desc'
      );
      setCoins(response.data);
      setLastUpdated(new Date().toLocaleTimeString());
      setSecondsLeft(60); 
    } catch (err) {
      console.error("API Error:", err);
      setError(true);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 60000); 
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 60));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`dashboard-container ${theme}`}>
      <div className="bg-mesh"></div>
      
      <header className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <h1>
            Ashley's CryptoVault
            <span className="version-badge">v1.2.0</span>
          </h1>
          <div className="theme-switch-wrapper">
            <span className="theme-icon material-symbols-outlined">light_mode</span>
            <label className="theme-switch">
              <input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} />
              <span className="slider round"></span>
            </label>
            <span className="theme-icon material-symbols-outlined">dark_mode</span>
          </div>
        </div>
        
        <div className="sync-container">
          <div className="last-sync-text">
            <p className="sync-label">LAST SYNC: {lastUpdated || 'Never'}</p>
            <p className="sync-time" style={{ fontSize: '0.85rem', marginTop: '4px', color: 'var(--accent-color)' }}>Next update in: {secondsLeft}s</p>
          </div>
          <button 
            className="sync-btn"
            onClick={fetchCryptoData}
            disabled={loading}
          >
            <svg 
              className={`sync-icon ${loading ? 'spinning' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {loading ? 'Syncing...' : 'Sync Now'}
          </button>
        </div>
      </header>
      
      <div style={{ flex: 1, minHeight: '60vh', display: 'flex', flexDirection: 'column' }}>
        {loading && coins.length === 0 ? (
          <div className="loading-screen">
            <div className="spinner"></div>
            <span>Securely fetching vault data...</span>
          </div>
        ) : !loading && coins.length === 0 ? (
          <div className="empty-state">
            <div className="empty-card">
              <h2>No Data Found</h2>
              <p style={{ marginBottom: '30px', lineHeight: '1.6' }}>
                We couldn't retrieve the cryptocurrency data. Please check your connection or try again later.
              </p>
              <button className="sync-btn" onClick={fetchCryptoData}>
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search for a coin..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="card-grid">
              {filteredCoins.length > 0 ? (
                filteredCoins.map((coin) => (
                  <CryptoCard key={coin.id} coin={coin} />
                ))
              ) : (
                <div className="empty-state" style={{ gridColumn: '1 / -1', height: '30vh' }}>
                  <div className="empty-card" style={{ padding: '3rem' }}>
                    <h3 style={{ color: 'var(--text-primary)', marginTop: 0 }}>No coins found</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                      We couldn't find any coins matching "{searchTerm}"
                    </p>
                    <button 
                      className="sync-btn" 
                      onClick={() => setSearchTerm('')}
                      style={{ padding: '8px 20px', margin: '0 auto' }}
                    >
                      Clear Search
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <footer className="footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontWeight: '600' }}>System Status:</span>
          <div className={`status-indicator ${error ? 'offline' : 'online'}`}>
            <div className="status-dot" style={{ backgroundColor: 'currentColor' }}></div>
            <span>{error ? 'Offline (Error)' : 'Online'}</span>
          </div>
        </div>
        <div style={{ fontWeight: '500' }}>
          API Connection: <strong style={{ color: error ? 'var(--danger-text)' : 'var(--success-text)' }}>{error ? 'Disconnected' : 'Active'}</strong>
        </div>
      </footer>
    </div>
  );
}

export default App;