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
        rate: number;
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
export declare function calculateDerivedStats(baseLevel: number, stats: CharacterStats): DerivedStats;
/**
 * Ragnarok stat point cost calculator
 * In RO, raising a stat costs (floor((currentStat - 1) / 10) + 2) points.
 */
export declare function getStatPointCost(currentStat: number): number;
