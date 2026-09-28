import React from 'react';
import { useGameStore } from '../store/gameStore';
import { Shield, Sparkles, Swords, Zap } from 'lucide-react';

export const CharacterHUD: React.FC = () => {
  const {
    characterName,
    baseLevel,
    baseExp,
    nextExp,
    currentHp,
    currentSp,
    derived,
    zeny,
    isAutoAttacking,
    toggleAutoAttack
  } = useGameStore();

  const expPct = Math.min(100, Math.floor((baseExp / nextExp) * 100));
  const hpPct = Math.min(100, Math.floor((currentHp / derived.maxHp) * 100));
  const spPct = Math.min(100, Math.floor((currentSp / derived.maxSp) * 100));

  return (
    <div style={{
      position: 'absolute',
      top: 16,
      left: 16,
      zIndex: 10,
      width: 320,
      padding: '16px 20px',
      background: 'rgba(15, 20, 32, 0.88)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(212, 175, 55, 0.4)',
      borderRadius: 12,
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      color: '#fff'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div>
          <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: '1.15rem', color: '#f5d76e', margin: 0 }}>
            {characterName}
          </h2>
          <span style={{ fontSize: '0.8rem', color: '#8c9ba5' }}>Base Lv. {baseLevel} Novice</span>
        </div>
        <button
          onClick={toggleAutoAttack}
          style={{
            background: isAutoAttacking ? 'linear-gradient(135deg, #27ae60, #2ecc71)' : 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: 6,
            color: '#fff',
            padding: '4px 10px',
            fontSize: '0.75rem',
            cursor: 'pointer',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}
        >
          <Swords size={14} />
          {isAutoAttacking ? 'AUTO: ON' : 'AUTO: OFF'}
        </button>
      </div>

      {/* HP Bar */}
      <div style={{ marginBottom: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 2 }}>
          <span style={{ color: '#e74c3c', fontWeight: 600 }}>HP</span>
          <span style={{ color: '#ccc' }}>{currentHp} / {derived.maxHp}</span>
        </div>
        <div style={{ width: '100%', height: 7, background: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ width: `${hpPct}%`, height: '100%', background: 'linear-gradient(90deg, #c0392b, #e74c3c)', transition: 'width 0.2s' }} />
        </div>
      </div>

      {/* SP Bar */}
      <div style={{ marginBottom: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 2 }}>
          <span style={{ color: '#3498db', fontWeight: 600 }}>SP</span>
          <span style={{ color: '#ccc' }}>{currentSp} / {derived.maxSp}</span>
        </div>
        <div style={{ width: '100%', height: 7, background: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ width: `${spPct}%`, height: '100%', background: 'linear-gradient(90deg, #2980b9, #3498db)', transition: 'width 0.2s' }} />
        </div>
      </div>

      {/* EXP Bar */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 2 }}>
          <span style={{ color: '#f1c40f', fontWeight: 600 }}>EXP</span>
          <span style={{ color: '#ccc' }}>{expPct}% ({baseExp}/{nextExp})</span>
        </div>
        <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ width: `${expPct}%`, height: '100%', background: 'linear-gradient(90deg, #f39c12, #f1c40f)', transition: 'width 0.2s' }} />
        </div>
      </div>

      {/* Quick stats & Zeny */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 8, color: '#8c9ba5' }}>
        <span>ATK: <strong style={{ color: '#fff' }}>{derived.atk}</strong></span>
        <span>DEF: <strong style={{ color: '#fff' }}>{derived.def}</strong></span>
        <span>ASPD: <strong style={{ color: '#fff' }}>{derived.aspd}</strong></span>
        <span style={{ color: '#f5d76e' }}>🪙 {zeny.toLocaleString()} Z</span>
      </div>
    </div>
  );
};
