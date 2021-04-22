import { MenuButton } from '../ui/menu-button';
import { getGameWidth, getGameHeight } from '../helpers';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'MainMenu',
};

/**
 * The initial scene that starts, shows the splash screens, and loads the necessary assets.
 */
export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super(sceneConfig);
  }

  public create(): void {
    this.add
      .text(100, 50, 'This is a sample main menu', {
        color: '#FFFFFF',
      })
      .setFontSize(24);

    new MenuButton(this, getGameWidth(this)*0.25, getGameHeight(this)*0.75, 'Start Game', () => {
      this.scene.start('Game');
    });
    
  }
}
