import React from 'react';
import { useGameStore } from '../store/gameStore';
import { ScrollText } from 'lucide-react';

export const CombatLogWindow: React.FC = () => {
  const { combatLogs } = useGameStore();

  return (
    <div style={{
      position: 'absolute',
      bottom: 16,
      left: 16,
      zIndex: 10,
      width: 380,
      height: 140,
      padding: '12px 16px',
      background: 'rgba(10, 14, 22, 0.9)',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: 10,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 6px 20px rgba(0,0,0,0.5)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 4 }}>
        <ScrollText size={14} color="#f5d76e" />
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#f5d76e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Adventure Log
        </span>
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        fontSize: '0.75rem',
        color: '#b0bec5'
      }}>
        {combatLogs.map((log, idx) => (
          <div key={idx} style={{ opacity: Math.max(0.3, 1 - idx * 0.15) }}>
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};
