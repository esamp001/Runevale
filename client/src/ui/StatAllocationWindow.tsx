import React from 'react';
import { useGameStore } from '../store/gameStore';
import { CharacterStats, getStatPointCost } from '@runevale/shared';
import { Plus, Award, Activity } from 'lucide-react';

const STAT_CONFIG: { key: keyof CharacterStats; label: string; desc: string; color: string }[] = [
  { key: 'str', label: 'STR', desc: 'Attack Power & Capacity', color: '#e74c3c' },
  { key: 'agi', label: 'AGI', desc: 'Attack Speed & Evasion', color: '#2ecc71' },
  { key: 'vit', label: 'VIT', desc: 'Max HP & Defense', color: '#f39c12' },
  { key: 'int', label: 'INT', desc: 'Magic ATK & Max SP', color: '#3498db' },
  { key: 'dex', label: 'DEX', desc: 'Accuracy & Cast Speed', color: '#9b59b6' },
  { key: 'luk', label: 'LUK', desc: 'Critical & Perfect Dodge', color: '#f1c40f' }
];

export const StatAllocationWindow: React.FC = () => {
  const { stats, statusPoints, allocateStat, derived } = useGameStore();

  return (
    <div style={{
      position: 'absolute',
      top: 16,
      right: 16,
      zIndex: 10,
      width: 320,
      padding: '16px 20px',
      background: 'rgba(15, 20, 32, 0.92)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(212, 175, 55, 0.5)',
      borderRadius: 12,
      boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
      color: '#fff'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 8 }}>
        <h3 style={{ fontFamily: 'Cinzel, serif', fontSize: '1rem', color: '#f5d76e', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Activity size={18} color="#f5d76e" /> Status Attributes
        </h3>
        <span style={{
          background: statusPoints > 0 ? 'rgba(243, 156, 18, 0.2)' : 'rgba(255,255,255,0.05)',
          color: statusPoints > 0 ? '#f39c12' : '#888',
          padding: '2px 8px',
          borderRadius: 6,
          fontSize: '0.75rem',
          fontWeight: 700,
          border: statusPoints > 0 ? '1px solid #f39c12' : '1px solid #444'
        }}>
          {statusPoints} pts
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {STAT_CONFIG.map(({ key, label, desc, color }) => {
          const val = stats[key];
          const cost = getStatPointCost(val);
          const canAfford = statusPoints >= cost && val < 99;

          return (
            <div
              key={key}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 10px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.06)'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color, fontWeight: 700, fontSize: '0.85rem' }}>{label}</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>{val}</span>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#7f8c8d' }}>{desc}</span>
              </div>

              <button
                disabled={!canAfford}
                onClick={() => allocateStat(key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  background: canAfford ? 'linear-gradient(135deg, #d4af37, #f39c12)' : 'rgba(255,255,255,0.05)',
                  color: canAfford ? '#000' : '#555',
                  border: 'none',
                  borderRadius: 6,
                  padding: '4px 8px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: canAfford ? 'pointer' : 'not-allowed',
                  transition: 'all 0.15s'
                }}
              >
                <Plus size={12} />
                +{cost}
              </button>
            </div>
          );
        })}
      </div>

      {/* Secondary combat preview */}
      <div style={{
        marginTop: 12,
        paddingTop: 8,
        borderTop: '1px solid rgba(255,255,255,0.1)',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 6,
        fontSize: '0.7rem',
        color: '#95a5a6'
      }}>
        <div>HIT: <strong style={{ color: '#fff' }}>{derived.hit}</strong></div>
        <div>FLEE: <strong style={{ color: '#fff' }}>{derived.flee}</strong></div>
        <div>CRIT: <strong style={{ color: '#fff' }}>{derived.crit}%</strong></div>
        <div>MATK: <strong style={{ color: '#fff' }}>{derived.matk}</strong></div>
        <div>MDEF: <strong style={{ color: '#fff' }}>{derived.mdef}</strong></div>
        <div>ASPD: <strong style={{ color: '#fff' }}>{derived.aspd}</strong></div>
      </div>
    </div>
  );
};
