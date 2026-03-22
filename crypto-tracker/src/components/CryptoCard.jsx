import React, { useState, useEffect } from 'react';

const CryptoCard = ({ coin }) => {
  const isPositive = coin.price_change_percentage_24h > 0;
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (coin.current_price) {
      setIsUpdating(true);
      const timeout = setTimeout(() => {
        setIsUpdating(false);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [coin.current_price]);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(val);
  };

  return (
    <div className="crypto-card">
      <div className="card-header">
        <img src={coin.image} alt={coin.name} className="coin-icon" />
        <div>
          <h3 className="coin-name">{coin.name}</h3>
          <span className="coin-symbol">{coin.symbol.toUpperCase()}</span>
        </div>
      </div>
      
      <p className="price-label">CURRENT PRICE</p>
      <p className={`price-value ${isUpdating ? 'updating' : ''}`}>{formatCurrency(coin.current_price)}</p>

      <div className={`change-badge ${isPositive ? 'positive' : 'negative'}`}>
        {isPositive ? '▲' : '▼'} {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
      </div>
    </div>
  );
};

export default CryptoCard;