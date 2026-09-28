import { create } from 'zustand';
import { CharacterStats, DerivedStats, calculateDerivedStats, getStatPointCost } from '@runevale/shared';

export interface GameState {
  characterName: string;
  baseLevel: number;
  baseExp: number;
  nextExp: number;
  statusPoints: number;
  stats: CharacterStats;
  derived: DerivedStats;
  currentHp: number;
  currentSp: number;
  zeny: number;
  combatLogs: string[];
  isAutoAttacking: boolean;

  // Actions
  allocateStat: (statKey: keyof CharacterStats) => void;
  gainExp: (amount: number) => void;
  addLog: (msg: string) => void;
  toggleAutoAttack: () => void;
  takeDamage: (amount: number) => void;
  heal: (amount: number) => void;
}

const initialStats: CharacterStats = {
  str: 1,
  agi: 1,
  vit: 1,
  int: 1,
  dex: 1,
  luk: 1
};

export const useGameStore = create<GameState>((set, get) => {
  const derived = calculateDerivedStats(1, initialStats);

  return {
    characterName: 'Novice Adventurer',
    baseLevel: 1,
    baseExp: 0,
    nextExp: 100,
    statusPoints: 48,
    stats: initialStats,
    derived: derived,
    currentHp: derived.maxHp,
    currentSp: derived.maxSp,
    zeny: 500,
    combatLogs: ['Welcome to Runevale. Ready for adventure!'],
    isAutoAttacking: true,

    allocateStat: (statKey) => {
      const state = get();
      const currentVal = state.stats[statKey];
      const cost = getStatPointCost(currentVal);

      if (state.statusPoints < cost || currentVal >= 99) return;

      const newStats = {
        ...state.stats,
        [statKey]: currentVal + 1
      };
      const newDerived = calculateDerivedStats(state.baseLevel, newStats);

      set({
        stats: newStats,
        statusPoints: state.statusPoints - cost,
        derived: newDerived,
        currentHp: Math.min(state.currentHp, newDerived.maxHp),
        currentSp: Math.min(state.currentSp, newDerived.maxSp)
      });

      get().addLog(`[Build] Raised ${statKey.toUpperCase()} to ${currentVal + 1} (spent ${cost} pts)`);
    },

    gainExp: (amount) => {
      const state = get();
      let currentExp = state.baseExp + amount;
      let level = state.baseLevel;
      let nextExp = state.nextExp;
      let pointsGained = 0;

      while (currentExp >= nextExp) {
        currentExp -= nextExp;
        level += 1;
        const pts = Math.floor(level / 5) + 3;
        pointsGained += pts;
        nextExp = Math.floor(nextExp * 1.5);
      }

      const newDerived = calculateDerivedStats(level, state.stats);

      if (level > state.baseLevel) {
        get().addLog(`🎉 LEVEL UP! You reached Base Level ${level}! (+${pointsGained} Status Points)`);
      }

      set({
        baseLevel: level,
        baseExp: currentExp,
        nextExp,
        statusPoints: state.statusPoints + pointsGained,
        derived: newDerived,
        currentHp: newDerived.maxHp,
        currentSp: newDerived.maxSp
      });
    },

    addLog: (msg) => {
      set((state) => ({
        combatLogs: [msg, ...state.combatLogs].slice(0, 50)
      }));
    },

    toggleAutoAttack: () => {
      set((state) => ({ isAutoAttacking: !state.isAutoAttacking }));
    },

    takeDamage: (amount) => {
      set((state) => ({
        currentHp: Math.max(0, state.currentHp - amount)
      }));
    },

    heal: (amount) => {
      set((state) => ({
        currentHp: Math.min(state.derived.maxHp, state.currentHp + amount)
      }));
    }
  };
});
