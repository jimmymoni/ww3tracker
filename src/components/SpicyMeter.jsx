// Market Data Component - Displays real financial market indicators
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Twitter, Link } from 'lucide-react';
import { fetchPolymarketData } from '../lib/api';
import html2canvas from 'html2canvas';

const SpicyMeter = ({ tension = 65, usHP = 75, iranHP = 60 }) => {
  const [ww3Probability, setWW3Probability] = useState(37);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState('--:--');
  const [copied, setCopied] = useState(false);
  const cardRef = useRef(null);

  // Fetch WW3 probability from Polymarket
  useEffect(() => {
    const loadWW3Data = async () => {
      try {
        const polyResult = await fetchPolymarketData();
        if (polyResult.escalation?.probability !== undefined) {
          setWW3Probability(polyResult.escalation.probability);
        }
      } catch (err) {
        console.error('WW3 fetch error:', err);
      }
    };
    loadWW3Data();
    const interval = setInterval(loadWW3Data, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch real market data
  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const res = await fetch('/api/markets');
        const data = await res.json();
        
        if (data.stocks && data.stocks.length > 0) {
          setStocks(data.stocks);
          setLastUpdate(new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
        }
      } catch (err) {
        console.error('Market fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMarkets();
    const interval = setInterval(fetchMarkets, 60000);
    return () => clearInterval(interval);
  }, []);

  const shareToX = () => {
    const oil = stocks.find(s => s.label === 'OIL.WAR');
    const gold = stocks.find(s => s.label === 'SAFE.HAVEN');
    const defense = stocks.find(s => s.label === 'WAR.STOCKS');
    
    const text = `Market Update:\nOil: ${oil?.change || 'N/A'}\nGold: ${gold?.change || 'N/A'}\nDefense: ${defense?.change || 'N/A'}\nww3tracker.live`;
    
    window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(text), '_blank');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText('https://ww3tracker.live');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadCard = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, { backgroundColor: '#0a0a0a', scale: 2, useCORS: true });
      const link = document.createElement('a');
      link.download = `market-data-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  // Get color for market row
  const getColor = (stock) => {
    if (stock.label === 'USD/IRR') return '#f87171';
    if (stock.meaning === 'bad') {
      return stock.direction === 'up' ? '#f87171' : '#4ade80';
    } else if (stock.meaning === 'warning') {
      return stock.direction === 'up' ? '#facc15' : '#4ade80';
    }
    return '#4ade80';
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        backgroundColor: '#0f0f0f',
        borderRadius: '12px',
        padding: '16px',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '400px',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>📉</span>
          <div>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#ffffff',
              letterSpacing: '0.05em',
              margin: 0,
            }}>
              MARKET DATA
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#ef4444',
              }} />
              <span style={{
                fontSize: '10px',
                fontWeight: 'bold',
                color: '#ef4444',
                letterSpacing: '0.1em',
              }}>
                LIVE
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button onClick={shareToX} style={{ padding: '8px', borderRadius: '6px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <Twitter style={{ width: '16px', height: '16px', color: '#9ca3af' }} />
          </button>
          <button onClick={copyLink} style={{ padding: '8px', borderRadius: '6px', background: 'transparent', border: 'none', cursor: 'pointer', position: 'relative' }}>
            <Link style={{ width: '16px', height: '16px', color: '#9ca3af' }} />
            {copied && (
              <span style={{
                position: 'absolute',
                top: '-24px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '9px',
                backgroundColor: '#22c55e',
                color: '#ffffff',
                padding: '2px 8px',
                borderRadius: '4px',
                whiteSpace: 'nowrap',
              }}>
                COPIED!
              </span>
            )}
          </button>
          <button onClick={downloadCard} style={{ padding: '8px', borderRadius: '6px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <svg style={{ width: '16px', height: '16px', color: '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Stock Rows */}
      <div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#6b7280', fontSize: '12px' }}>
            Connecting to markets...
          </div>
        ) : stocks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#6b7280', fontSize: '12px' }}>
            Market data unavailable
          </div>
        ) : (
          <>
            {stocks.map((stock, index) => (
              <motion.div
                key={stock.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  opacity: stock.stale ? 0.6 : 1,
                }}
              >
                <span style={{
                  fontFamily: 'monospace',
                  fontSize: '13px',
                  color: '#ffffff',
                  fontWeight: 'bold',
                  letterSpacing: '0.05em',
                }}>
                  {stock.label}
                  {stock.stale && <span style={{ fontSize: '9px', color: '#9ca3af', marginLeft: '4px' }}>⚠️</span>}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    color: '#e5e7eb',
                    fontWeight: '500',
                  }}>
                    {stock.price}
                  </span>
                  <span style={{
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: getColor(stock),
                  }}>
                    {stock.direction === 'up' ? '▲' : '▼'} {stock.change}
                  </span>
                </div>
              </motion.div>
            ))}
          </>
        )}
        
        {/* WW3 Risk */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 0',
            borderBottom: '2px solid rgba(255,255,255,0.2)',
          }}
        >
          <span style={{
            fontFamily: 'monospace',
            fontSize: '13px',
            color: '#ffffff',
            fontWeight: 'bold',
          }}>
            WW3.RISK
            <span style={{ fontSize: '9px', color: '#9ca3af', marginLeft: '4px' }}>(Polymarket)</span>
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              fontFamily: 'monospace',
              fontSize: '18px',
              fontWeight: 'bold',
              color: ww3Probability >= 50 ? '#f87171' : '#4ade80',
            }}>
              {ww3Probability}%
            </span>
            <span style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: ww3Probability >= 50 ? '#f87171' : '#4ade80',
            }}>
              {ww3Probability > 50 ? '▲' : '▼'}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '16px',
        paddingTop: '12px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{
          fontSize: '10px',
          color: '#6b7280',
          fontFamily: 'monospace',
        }}>
          Updated {lastUpdate}
        </span>
        <span style={{
          fontSize: '10px',
          color: '#4b5563',
          fontFamily: 'monospace',
        }}>
          Real market data
        </span>
      </div>
    </motion.div>
  );
};

export default SpicyMeter;
