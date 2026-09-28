import Phaser from 'phaser';
import { useGameStore } from '../../store/gameStore';

export class MainScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Arc;
  private playerLabel!: Phaser.GameObjects.Text;
  private monster!: Phaser.GameObjects.Arc | null;
  private monsterLabel!: Phaser.GameObjects.Text | null;
  private monsterHpBar!: Phaser.GameObjects.Graphics | null;
  private monsterMaxHp: number = 50;
  private monsterCurrentHp: number = 50;
  private attackTimer: number = 0;
  private isEngaging: boolean = false;

  constructor() {
    super({ key: 'MainScene' });
  }

  create() {
    const { width, height } = this.scale;

    // Draw an isometric diamond grid
    const gridGraphics = this.add.graphics();
    gridGraphics.lineStyle(1, 0x1f293d, 0.7);

    const tileWidth = 64;
    const tileHeight = 32;
    const originX = width / 2;
    const originY = height / 3;

    for (let x = -8; x <= 8; x++) {
      for (let y = -8; y <= 8; y++) {
        const isoX = originX + (x - y) * (tileWidth / 2);
        const isoY = originY + (x + y) * (tileHeight / 2);

        gridGraphics.strokePoints([
          new Phaser.Geom.Point(isoX, isoY - tileHeight / 2),
          new Phaser.Geom.Point(isoX + tileWidth / 2, isoY),
          new Phaser.Geom.Point(isoX, isoY + tileHeight / 2),
          new Phaser.Geom.Point(isoX - tileWidth / 2, isoY),
          new Phaser.Geom.Point(isoX, isoY - tileHeight / 2)
        ]);
      }
    }

    // Player Avatar (Isometric circle + label)
    this.player = this.add.circle(originX - 60, originY + 30, 16, 0x3498db);
    this.player.setStrokeStyle(2, 0xffffff);

    this.playerLabel = this.add.text(originX - 60, originY - 2, 'Novice', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '12px',
      color: '#ffffff'
    }).setOrigin(0.5);

    // Spawn first monster
    this.spawnMonster(originX + 80, originY + 50);
  }

  private spawnMonster(x: number, y: number) {
    if (this.monster) {
      this.monster.destroy();
      this.monsterLabel?.destroy();
      this.monsterHpBar?.destroy();
    }

    this.monsterMaxHp = 40 + useGameStore.getState().baseLevel * 10;
    this.monsterCurrentHp = this.monsterMaxHp;

    // Poring-style monster (pinkish circle)
    this.monster = this.add.circle(x, y, 14, 0xff6b81);
    this.monster.setStrokeStyle(2, 0xffffff);

    this.monsterLabel = this.add.text(x, y - 24, 'Poring Lv.1', {
      fontFamily: 'Outfit, sans-serif',
      fontSize: '11px',
      color: '#ff6b81'
    }).setOrigin(0.5);

    this.monsterHpBar = this.add.graphics();
    this.updateHpBar();
    this.isEngaging = true;
  }

  private updateHpBar() {
    if (!this.monsterHpBar || !this.monster) return;
    this.monsterHpBar.clear();
    const barWidth = 36;
    const barHeight = 4;
    const x = this.monster.x - barWidth / 2;
    const y = this.monster.y - 12;

    this.monsterHpBar.fillStyle(0x000000, 0.7);
    this.monsterHpBar.fillRect(x, y, barWidth, barHeight);

    const pct = Math.max(0, this.monsterCurrentHp / this.monsterMaxHp);
    this.monsterHpBar.fillStyle(0x2ecc71, 1);
    this.monsterHpBar.fillRect(x, y, barWidth * pct, barHeight);
  }

  override update(time: number, delta: number) {
    const store = useGameStore.getState();
    if (!store.isAutoAttacking || !this.isEngaging || !this.monster) return;

    this.attackTimer += delta;
    // ASPD delay conversion: RO style (delay in ms = (200 - aspd) * 20)
    const attackDelay = Math.max(250, (200 - store.derived.aspd) * 15);

    if (this.attackTimer >= attackDelay) {
      this.attackTimer = 0;
      this.performAttack();
    }
  }

  private performAttack() {
    if (!this.monster) return;
    const store = useGameStore.getState();

    // Damage formula: ATK + variance + CRIT check
    const isCrit = Math.random() * 100 < store.derived.crit;
    const baseDamage = store.derived.atk + Math.floor(Math.random() * (store.stats.dex / 2 + 5));
    const finalDamage = isCrit ? Math.floor(baseDamage * 1.4) : baseDamage;

    this.monsterCurrentHp -= finalDamage;
    this.updateHpBar();

    // Spawn floating damage text
    const text = this.add.text(
      this.monster.x + (Math.random() * 20 - 10),
      this.monster.y - 20,
      `${isCrit ? 'CRIT! ' : ''}${finalDamage}`,
      {
        fontFamily: 'Outfit, sans-serif',
        fontSize: isCrit ? '16px' : '13px',
        fontStyle: isCrit ? 'bold' : 'normal',
        color: isCrit ? '#f1c40f' : '#ffffff'
      }
    ).setOrigin(0.5);

    this.tweens.add({
      targets: text,
      y: text.y - 30,
      alpha: 0,
      duration: 750,
      ease: 'Power1',
      onComplete: () => text.destroy()
    });

    // Flash monster
    this.tweens.add({
      targets: this.monster,
      alpha: 0.4,
      yoyo: true,
      duration: 80
    });

    if (this.monsterCurrentHp <= 0) {
      this.defeatMonster();
    }
  }

  private defeatMonster() {
    this.isEngaging = false;
    const store = useGameStore.getState();
    const expGained = 20 + store.baseLevel * 4;

    store.gainExp(expGained);
    store.addLog(`Defeated Poring! Gained +${expGained} EXP and Jellopy.`);

    if (this.monster) {
      this.tweens.add({
        targets: [this.monster, this.monsterLabel, this.monsterHpBar],
        alpha: 0,
        scale: 0.1,
        duration: 300,
        onComplete: () => {
          this.monster?.destroy();
          this.monsterLabel?.destroy();
          this.monsterHpBar?.destroy();
          this.monster = null;

          // Respawn after 800ms
          this.time.delayedCall(800, () => {
            const { width, height } = this.scale;
            const originX = width / 2;
            const originY = height / 3;
            const offsetX = Math.random() * 120 - 60;
            const offsetY = Math.random() * 80 - 20;
            this.spawnMonster(originX + 70 + offsetX, originY + 40 + offsetY);
          });
        }
      });
    }
  }
}
