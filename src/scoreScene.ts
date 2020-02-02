import "phaser";

export class ScoreScene extends Phaser.Scene {
  score: number;
  result: Phaser.GameObjects.Text;
  scoreText: Phaser.GameObjects.Text;
  hint: Phaser.GameObjects.Text;

  constructor() {
    super({
      key: "ScoreScene"
    });
  }

  init(params: any): void {
    this.score = params.score;
  }

  preload(){
      this.load.image('brigade-logo', 'images/brigade-logo.png');
      this.load.image('fajrant', 'images/Fajrant.png');
  }

  create(): void {
    this.add.image(675, 100, 'brigade-logo').setDisplaySize(300,150);
    this.add.image(675, 275, 'fajrant').setDisplaySize(700,200);

    if (this.score > 0 ){
      this.add.text(420, 400, "Zarobiłeś: ", { font: '48px Consolas', fill: '#FBFBAC'});
      this.add.text(775, 400, this.score + "PLN", { font: '48px Consolas', fill: 'green'});
      this.add.text(440, 475, "Można iść na flaszeczkę! :D", { font: '32px Consolas', fill: '#FBFBAC'});
    }
    if (this.score <= 0 ){
      this.add.text(420, 400, "Straciłeś: ", { font: '48px Consolas', fill: '#FBFBAC'});
      this.add.text(775, 400, Math.abs(this.score) + "PLN", { font: '48px Consolas', fill: 'red'});
      this.add.text(440, 475, "Dzisiaj bez flaszeczki :C", { font: '32px Consolas', fill: '#FBFBAC'});
    }

    this.add.text(150, 600, "Naciśnij spacje, aby zacząć kolejny dzień",  { font: '48px Consolas', fill: '#FBFBAC' });

    var keyObj = this.input.keyboard.addKey('space');  // Get key object

    keyObj.on('down', function(event) { 
        this.scene.start("GameScene");
    }, this);
  }
};