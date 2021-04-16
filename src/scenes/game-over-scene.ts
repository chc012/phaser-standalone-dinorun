const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'GameOver',
};

export class GameOverScene extends Phaser.Scene {
    constructor() {
        super(sceneConfig);
    }

    private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;

    public create(): void {
        this.cursorKeys = this.input.keyboard.createCursorKeys();
    }

    public update(): void {
        if (this.cursorKeys.space.isDown || this.cursorKeys.up.isDown) {
            this.scene.start("Game");
        }
    }
}