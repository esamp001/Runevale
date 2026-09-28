/**
 * Calculates derived secondary stats from base RO stats and level
 */
export function calculateDerivedStats(baseLevel, stats) {
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
export function getStatPointCost(currentStat) {
    return Math.floor((currentStat - 1) / 10) + 2;
}
