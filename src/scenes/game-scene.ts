import { Input } from 'phaser';
import { getGameWidth, getGameHeight } from '../helpers';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game',
};

export class GameScene extends Phaser.Scene {
  
  private bg: Phaser.GameObjects.Image;
  private dino: Phaser.Physics.Arcade.Sprite;
  private ground: Phaser.Physics.Arcade.Sprite;
  private cacti: Phaser.Physics.Arcade.Group;
  private ptera: Phaser.Physics.Arcade.Group;
  private cloud: Phaser.Physics.Arcade.Group;
  
  private speed = 7;
  private score = 0;

  private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  private scoreText: Phaser.GameObjects.Text;

  constructor() {
    super(sceneConfig);
  }

  public create(): void {
    
    // All imgs and sprites, ordered by overlap
    this.bg = this.add.image(
      getGameWidth(this)*0.5,
      getGameHeight(this)*0.5, 
      "bg"
    );
    this.bg.setDisplaySize(getGameWidth(this), getGameHeight(this));

    this.ground = this.physics.add.sprite(
      getGameWidth(this)*0.5,
      getGameHeight(this)*0.975,
      "ground"
    );
    this.ground.setSize(
      getGameWidth(this),
      getGameHeight(this)*0.05
    );
    this.ground.setCollideWorldBounds(true);

    this.cloud = this.physics.add.group();
    
    this.dino = this.physics.add.sprite(
      getGameWidth(this)*0.1,
      getGameHeight(this)*0.853,
      "dino"
    );
    this.dino.setDisplaySize(
      getGameWidth(this)*0.0667,
      getGameHeight(this)*0.3
    );
    this.dino.setCollideWorldBounds(true);

    this.cacti = this.physics.add.group();
    this.ptera = this.physics.add.group();
    
    this.scoreText = this.add.text(
      getGameWidth(this)*0.88,
      getGameHeight(this)*0.08,
      "00000",
      {fontSize: "20px", color: "#000"}
    );
    
    // Animation for dino and ptera
    this.anims.create({
      key: "run",
      frames: this.anims.generateFrameNumbers(
        "dino",
        {start: 0, end: 4}
      ),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "duck_run",
      frames: this.anims.generateFrameNumbers(
        "dino_duck",
        {start: 0, end: 1}
      ),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "fly",
      frames: this.anims.generateFrameNumbers(
        "ptera",
        {start: 0, end: 1}
      ),
      frameRate: 10,
      repeat: -1
    });

    // Collision effect
    this.physics.add.collider(this.dino, this.cacti, hit, null, this);
    this.physics.add.collider(this.dino, this.ptera, hit, null, this);

    function hit(dino: Phaser.Physics.Arcade.Sprite, obstacle) {
      return
    }

    this.cursorKeys = this.input.keyboard.createCursorKeys();
  }

  public update(): void {

    this.dino.anims.play("run");

    if ((this.cursorKeys.up.isDown || this.cursorKeys.space.isDown)
        && (this.dino.body.bottom === getGameHeight(this))) {
      this.dino.setVelocityY(-450);
    }
    if (this.cursorKeys.down.isDown) {
      this.dino.anims.play("duck_run");
    }

  }
}
