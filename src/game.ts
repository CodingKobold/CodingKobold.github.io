import { GameScene } from "./gameScene";
import { WelcomeScene } from "./welcomeScene";
import { ScoreScene } from "./scoreScene";

const config: Phaser.Types.Core.GameConfig = {
  title: "Game",
  width: 800,
  height: 600,
  parent: "game",
  scene: [WelcomeScene, GameScene, ScoreScene],
  physics: {
    default: "arcade",
    arcade: {
      debug: false
    }
  },
  backgroundColor: "#000033"
};

export class StarfallGame extends Phaser.Game {    
  constructor(config: Phaser.Types.Core.GameConfig) {
      super(config);
    }
}

window.onload = () => {
    let game = new StarfallGame(config);
};