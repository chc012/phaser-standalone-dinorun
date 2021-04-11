import { getGameWidth, getGameHeight } from '../helpers';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Boot',
};

/**
 * The initial scene that loads all necessary assets to the game and displays a loading bar.
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super(sceneConfig);
  }

  public preload(): void {
    const halfWidth = getGameWidth(this) * 0.5;
    const halfHeight = getGameHeight(this) * 0.5;

    const progressBarHeight = 100;
    const progressBarWidth = 400;

    const progressBarContainer = this.add.rectangle(
      halfWidth,
      halfHeight,
      progressBarWidth,
      progressBarHeight,
      0x000000,
    );
    const progressBar = this.add.rectangle(
      halfWidth + 20 - progressBarContainer.width * 0.5,
      halfHeight,
      10,
      progressBarHeight - 20,
      0x888888,
    );

    const loadingText = this.add.text(halfWidth - 75, halfHeight - 100, 'Loading...').setFontSize(24);
    const percentText = this.add.text(halfWidth - 25, halfHeight, '0%').setFontSize(24);
    const assetText = this.add.text(halfWidth - 25, halfHeight + 100, '').setFontSize(24);

    this.load.on('progress', (value) => {
      progressBar.width = (progressBarWidth - 30) * value;

      const percent = value * 100;
      percentText.setText(`${percent}%`);
    });

    this.load.on('fileprogress', (file) => {
      assetText.setText(file.key);
    });

    this.load.on('complete', () => {
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
      progressBar.destroy();
      progressBarContainer.destroy();

      this.scene.start('MainMenu');
    });

    this.loadAssets();
  }

  /**
   * All assets that need to be loaded by the game (sprites, images, animations, tiles, music, etc)
   * should be added to this method. Once loaded in, the loader will keep track of them, indepedent of which scene
   * is currently active, so they can be accessed anywhere.
   */
  private loadAssets() {

    this.load.image("cloud", "assets/sprites/cloud.png");
    this.load.image("game_over", "assets/sprites/game_over.png");
    this.load.image("ground", "assets/sprites/ground.png");
    this.load.image("logo", "assets/sprites/logo.png");
    this.load.image("replay", "assets/sprites/replay_button.png");
    this.load.image("bg", "assets/sprites/bg.png");
    
    this.load.spritesheet(
      "cacti",
      "assets/sprites/cacti.png",
      {frameWidth: 68, frameHeight: 70}
    );
    this.load.spritesheet(
      "dino",
      "assets/sprites/dino.png",
      {frameWidth: 88, frameHeight: 95}
    );
    this.load.spritesheet(
      "dino_duck",
      "assets/sprites/dino_ducking.png",
      {frameWidth: 118, frameHeight: 60}
    );
    this.load.spritesheet(
      "ptera",
      "assets/sprites/ptera.png",
      {frameWidth: 92, frameHeight: 81}
    );
  }
}
