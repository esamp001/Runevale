export interface CharacterStats {
  str: number;
  agi: number;
  vit: number;
  int: number;
  dex: number;
  luk: number;
}

export interface DerivedStats {
  maxHp: number;
  maxSp: number;
  atk: number;
  matk: number;
  def: number;
  mdef: number;
  hit: number;
  flee: number;
  crit: number;
  aspd: number;
}

export interface MonsterDefinition {
  id: string;
  name: string;
  level: number;
  hp: number;
  exp: number;
  jobExp: number;
  atkMin: number;
  atkMax: number;
  def: number;
  mdef: number;
  hit: number;
  flee: number;
  element: string;
  scale: string;
  drops: {
    itemId: string;
    rate: number; // e.g. 0.05 for 5%
  }[];
}

export interface ItemDefinition {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'headgear' | 'accessory' | 'consumable' | 'loot';
  description: string;
  sellPrice: number;
  stats?: Partial<CharacterStats & DerivedStats>;
}

/**
 * Calculates derived secondary stats from base RO stats and level
 */
export function calculateDerivedStats(baseLevel: number, stats: CharacterStats): DerivedStats {
  const maxHp = 50 + (baseLevel * 10) + Math.floor(stats.vit * 12);
  const maxSp = 10 + (baseLevel * 3) + Math.floor(stats.int * 5);
  const atk = stats.str + Math.floor(stats.str / 10) ** 2 + Math.floor(stats.dex / 5) + Math.floor(stats.luk / 5);
  const matk = stats.int + Math.floor(stats.int / 7) ** 2;
  const def = stats.vit;
  const mdef = stats.int;
  const hit = baseLevel + stats.dex;
  const flee = baseLevel + stats.agi;
  const crit = 1 + Math.floor(stats.luk * 0.3);
  const aspd = Math.min(190, 140 + Math.floor(stats.agi * 0.4) + Math.floor(stats.dex * 0.1));

  return {
    maxHp,
    maxSp,
    atk,
    matk,
    def,
    mdef,
    hit,
    flee,
    crit,
    aspd
  };
}

/**
 * Ragnarok stat point cost calculator
 * In RO, raising a stat costs (floor((currentStat - 1) / 10) + 2) points.
 */
export function getStatPointCost(currentStat: number): number {
  return Math.floor((currentStat - 1) / 10) + 2;
}
