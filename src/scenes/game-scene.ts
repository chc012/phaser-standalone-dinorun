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
      getGameWidth(this) * 0.5,
      getGameHeight(this) * 0.5, 
      "bg"
    );
    this.bg.setDisplaySize(getGameWidth(this), getGameHeight(this));

    this.ground = this.physics.add.sprite(
      getGameWidth(this) * 0.5,
      getGameHeight(this) * 0.975,
      "ground"
    );
    this.ground.setSize(
      getGameWidth(this),
      getGameHeight(this) * 0.05
    );
    this.ground.setCollideWorldBounds(true);

    this.cloud = this.physics.add.group({allowGravity: false});
    
    this.dino = this.physics.add.sprite(
      getGameWidth(this) * 0.1,
      getGameHeight(this),
      "dino"
    );
    this.dino.setOrigin(0.5, 1);
    this.dino.setDisplaySize(
      getGameWidth(this) * 0.0667,
      getGameHeight(this) * 0.3
    );
    this.dino.setCollideWorldBounds(true);
    this.dino.setDepth(2);

    this.cacti = this.physics.add.group({allowGravity: false});
    this.ptera = this.physics.add.group({allowGravity: false});
    
    this.scoreText = this.add.text(
      getGameWidth(this) * 0.88,
      getGameHeight(this) * 0.08,
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

    if (this.cloud.getLength() < 3
        && Phaser.Math.FloatBetween(0, 1) < 0.01) {
      let new_cloud: Phaser.Physics.Arcade.Sprite = this.cloud.create(
        getGameWidth(this),
        getGameHeight(this) * Phaser.Math.FloatBetween(0.1, 0.4),
        "cloud"
      );
      new_cloud.setVelocityX(Phaser.Math.Between(-20, -50));
      new_cloud.setOrigin(0, 0);
      new_cloud.setDisplaySize(
        getGameWidth(this) * 0.1,
        getGameHeight(this) * 0.2
      );
    }
    this.cloud.children.each(function (child: Phaser.Physics.Arcade.Sprite) {
      if (child.getRightCenter().x <=0) {
        child.destroy();
      }
    });

    if (this.ptera.getLength() < 1
        && Phaser.Math.FloatBetween(0, 1) < 0.005) {
      let new_ptera: Phaser.Physics.Arcade.Sprite = this.ptera.create(
        getGameWidth(this),
        getGameHeight(this) * Phaser.Math.FloatBetween(0.2, 0.6),
        "ptera"
      );
      new_ptera.setVelocityX(-150);
      new_ptera.setOrigin(0, 0);
      new_ptera.setDisplaySize(
        getGameWidth(this) * 0.06,
        getGameHeight(this) * 0.24 * 0.88
      );
    }
    this.ptera.children.each(function (child: Phaser.Physics.Arcade.Sprite) {
      if (child.getRightCenter().x <=0) {
        child.destroy();
      }
    });

    if (this.cacti.getLength() < 2
        && Phaser.Math.FloatBetween(0, 1) < 0.01) {
      let new_cactus: Phaser.Physics.Arcade.Sprite = this.cacti.create(
        getGameWidth(this),
        getGameHeight(this),
        "cacti"
      );
      new_cactus.setVelocityX(-150);
      new_cactus.setOrigin(0, 1);
      new_cactus.setDisplaySize(
        getGameWidth(this) * 0.06,
        getGameHeight(this) * 0.24 * 0.88
      );
    }
    this.cacti.children.each(function (child: Phaser.Physics.Arcade.Sprite) {
      if (child.getRightCenter().x <=0) {
        child.destroy();
      }
    });

    // Animation is failing me, think about it later

    if ((this.cursorKeys.up.isDown || this.cursorKeys.space.isDown)
        && (this.dino.body.bottom === getGameHeight(this))) {
      this.dino.setVelocityY(-450);
    }

    // Check jump and duck
    // Hard-coded, don't know why these values work
    if (this.cursorKeys.down.isDown
        && this.dino.texture.key == "dino") {
      this.dino.setTexture("dino_duck");
      this.dino.setSize(
        getGameWidth(this) * 0.2,
        getGameHeight(this) * 0.38
      );
      this.dino.setDisplaySize(
        getGameWidth(this) * 0.095,
        getGameHeight(this) * 0.2
      );
    }
    if (this.cursorKeys.down.isUp
        && this.dino.texture.key == "dino_duck") {
      this.dino.setTexture("dino");
      this.dino.setSize(
        getGameWidth(this) * 0.14,
        getGameHeight(this) * 0.6
      );
    }

  }
}
