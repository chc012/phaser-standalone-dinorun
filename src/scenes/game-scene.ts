//import { Input } from 'phaser';
import { getGameWidth, getGameHeight } from '../helpers';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game',
};

const JUMP_FORCE = -450;
const BASE_SPEED = -200;
const BASE_SCORE = 0;
const BASE_FRAME = 0;


export class GameScene extends Phaser.Scene {
  
  private bg: Phaser.GameObjects.Image;
  private ground: Phaser.GameObjects.TileSprite;
  private dino: Phaser.Physics.Arcade.Sprite;
  private cacti: Phaser.Physics.Arcade.Group;
  private ptera: Phaser.Physics.Arcade.Group;
  private cloud: Phaser.Physics.Arcade.Group;
  private last_obs: Phaser.Physics.Arcade.Sprite;
  
  private speed: number;
  private score: number;
  private frame: number;
  private scoreText: Phaser.GameObjects.Text;
  private highScoreText: Phaser.GameObjects.Text;
  private highScore = 500;

  private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super(sceneConfig);
  }

  public create(): void {

    // Clean up for game restart
    this.speed = BASE_SPEED;
    this.score = BASE_SCORE;
    this.frame = BASE_FRAME;
    this.last_obs = undefined;
    
    // All imgs and sprites, ordered by overlap
    this.bg = this.add.image(
      getGameWidth(this) * 0.5,
      getGameHeight(this) * 0.5, 
      "bg"
    );
    this.bg.setDisplaySize(getGameWidth(this), getGameHeight(this));

    this.ground = this.add.tileSprite(
      0,
      getGameHeight(this),
      getGameWidth(this),
      getGameHeight(this) * 0.1,
      "ground"
    );
    this.ground.setOrigin(0, 1);

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

    // Collision effect
    this.physics.add.collider(this.dino, this.cacti, hit, null, this);
    this.physics.add.collider(this.dino, this.ptera, hit, null, this);

    // Setting end-game event
    function hit (dino: Phaser.Physics.Arcade.Sprite,
      obs: Phaser.Physics.Arcade.Sprite) {
      dino.setTexture("dino", 4);
      this.scene.launch("GameOver");
      this.scene.pause();
    }

    this.cursorKeys = this.input.keyboard.createCursorKeys();
  }

  public update(): void {
    // Warning: most of the values in .setSize functions are
    // hard-coded, magical

    // Ground
    this.ground.tilePositionX -= this.speed / 100;

    // Clouds
    if (this.cloud.getLength() < 5
        && Phaser.Math.FloatBetween(0, 1) < 0.01) {
      let new_cloud: Phaser.Physics.Arcade.Sprite = this.cloud.create(
        getGameWidth(this),
        getGameHeight(this) * Phaser.Math.FloatBetween(0.1, 0.4),
        "cloud"
      );
      new_cloud.setVelocityX(Phaser.Math.Between(
        this.speed / 10,
        this.speed / 5
      ));
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

    // Check if there is enough space to put in another obstacle
    let can_add_obs = (this.last_obs === undefined)
                      || (this.last_obs.getRightCenter().x < (getGameWidth(this) * 0.7))

    // Cacti
    if (this.cacti.getLength() < 2
        && can_add_obs
        && Phaser.Math.FloatBetween(0, 1) < 0.015) {
      let new_cactus: Phaser.Physics.Arcade.Sprite = this.cacti.create(
        getGameWidth(this),
        getGameHeight(this),
        "cacti",
        // TODO: diverse cactus texture
      );
      new_cactus.setVelocityX(this.speed);
      new_cactus.setOrigin(0, 1);
      new_cactus.setSize(
        getGameWidth(this) * 0.08,
        getGameHeight(this) * 0.24 * 0.88
      );
      new_cactus.setDisplaySize(
        getGameWidth(this) * 0.08,
        getGameHeight(this) * 0.30 * 0.88
      );
      this.last_obs = new_cactus;
    }
    this.cacti.children.each(function (child: Phaser.Physics.Arcade.Sprite) {
      if (child.getRightCenter().x <=0) {
        child.destroy();
      }
    });

    // Check again for cacti
    can_add_obs = (this.last_obs === undefined)
                  || (this.last_obs.getRightCenter().x < (getGameWidth(this) * 0.7))
    
    // Ptera
    if (this.ptera.getLength() < 1
        && can_add_obs
        && Phaser.Math.FloatBetween(0, 1) < 0.008) {
      let new_ptera: Phaser.Physics.Arcade.Sprite = this.ptera.create(
        getGameWidth(this),
        getGameHeight(this) * Phaser.Math.FloatBetween(0.2, 0.6),
        "ptera"
      );
      new_ptera.setVelocityX(this.speed);
      new_ptera.setOrigin(0, 0);
      new_ptera.setSize(
        getGameWidth(this) * 0.06,
        getGameHeight(this) * 0.24 * 0.88
      );
      new_ptera.setDisplaySize(
        getGameWidth(this) * 0.06,
        getGameHeight(this) * 0.24 * 0.88
      );
      new_ptera.setDepth(1);
      new_ptera.anims.play("fly", true);
      this.last_obs = new_ptera;
    }
    this.ptera.children.each(function (child: Phaser.Physics.Arcade.Sprite) {
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
      this.dino.setVelocityY(JUMP_FORCE);
    }
    // Check dino duck
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
      this.speed -= 50;
    }

  }
}
