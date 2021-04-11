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
  
  private speed = -200;
  private score = 0;
  private frame = 0;
  private highScore = 300;
  private scoreText: Phaser.GameObjects.Text;
  private highScoreText: Phaser.GameObjects.Text;

  private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;

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
    this.ground.setDisplaySize(
      getGameWidth(this),
      getGameHeight(this) * 0.1 
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
      getGameWidth(this) * 0.98,
      getGameHeight(this) * 0.08,
      "S:".concat("0"),
      {fontSize: "20px", color: "#000"}
    );
    this.scoreText.setOrigin(1, 0);

    this.highScoreText = this.add.text(
      getGameWidth(this) * 0.8,
      getGameHeight(this) * 0.08,
      "H:".concat(this.highScore.toString()),
      {fontSize: "20px", color: "#000"}
    );
    this.highScoreText.setOrigin(1, 0);
    
    // Animation for dino and ptera
    this.anims.create({
      key: "run",
      frames: this.anims.generateFrameNumbers(
        "dino",
        {start: 2, end: 3}
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

    this.anims.create({
      key: "die",
      frames: [{key: "dino", frame: 4}],
      frameRate: 20
    });

    // Collision effect
    this.physics.add.collider(this.dino, this.cacti, hit, null, this);
    this.physics.add.collider(this.dino, this.ptera, hit, null, this);

    // Setting end-game event
    // TODO
    function hit(dino: Phaser.Physics.Arcade.Sprite, obstacle) {
      this.physics.pause()
      dino.anims.play("die");
      this.gameOver = true;
    }

    this.cursorKeys = this.input.keyboard.createCursorKeys();
  }

  public update(): void {

    // Clouds
    if (this.cloud.getLength() < 5
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

    // Ptera
    if (this.ptera.getLength() < 1
        && Phaser.Math.FloatBetween(0, 1) < 0.005) {
      let new_ptera: Phaser.Physics.Arcade.Sprite = this.ptera.create(
        getGameWidth(this),
        getGameHeight(this) * Phaser.Math.FloatBetween(0.2, 0.6),
        "ptera"
      );
      new_ptera.setVelocityX(this.speed);
      new_ptera.setOrigin(0, 0);
      new_ptera.setDisplaySize(
        getGameWidth(this) * 0.06,
        getGameHeight(this) * 0.24 * 0.88
      );
      new_ptera.setDepth(1);
      new_ptera.anims.play("fly", true); 
    }
    this.ptera.children.each(function (child: Phaser.Physics.Arcade.Sprite) {
      if (child.getRightCenter().x <=0) {
        child.destroy();
      }
    });

    // Cacti
    if (this.cacti.getLength() < 2
        && Phaser.Math.FloatBetween(0, 1) < 0.01) {
      let new_cactus: Phaser.Physics.Arcade.Sprite = this.cacti.create(
        getGameWidth(this),
        getGameHeight(this),
        "cacti",

      );
      new_cactus.setVelocityX(this.speed);
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

    // Dino
    if (this.dino.texture.key == "dino") {
      this.dino.anims.play("run", true);
    } else {
      this.dino.anims.play("duck_run", true);
    }
    if ((this.cursorKeys.up.isDown || this.cursorKeys.space.isDown)
        && (this.dino.body.bottom === getGameHeight(this))) {
      this.dino.setVelocityY(-450);
    }

    // Score
    this.frame++;
    if (this.frame % 6 === 0) {
      this.score++;
      this.scoreText.setText("S:".concat(this.score.toString()));
      if (this.score >= this.highScore) {
        this.highScore = this.score;
        this.highScoreText.setText("H:".concat(this.highScore.toString()));
      }
    }

    // Speed change
    if (this.frame % 600 === 0) {
      console.log(this.frame);
      this.speed -= 50;
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
