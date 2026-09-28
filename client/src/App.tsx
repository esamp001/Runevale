import React from 'react';
import { GameContainer } from './game/GameContainer';
import { CharacterHUD } from './ui/CharacterHUD';
import { StatAllocationWindow } from './ui/StatAllocationWindow';
import { CombatLogWindow } from './ui/CombatLogWindow';

export const App: React.FC = () => {
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* 2D Isometric Phaser Canvas */}
      <GameContainer />

      {/* React UI Overlays */}
      <CharacterHUD />
      <StatAllocationWindow />
      <CombatLogWindow />
    </div>
  );
};
