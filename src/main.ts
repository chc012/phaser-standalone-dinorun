import * as Phaser from 'phaser';
import Scenes from './scenes';

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: 'DinoRun',
  type: Phaser.AUTO,

  width: 600,
  height: 150,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },

  scene: Scenes,

  physics: {
    default: 'arcade',
    arcade: {
      gravity: {y: 1000},
      debug: false,
    },
  },

  parent: 'game',
  backgroundColor: '#000000',
};

export const game = new Phaser.Game(gameConfig);
/*
window.addEventListener('resize', () => {
  game.scale.refresh();
});
*/
