import { WelcomeScene } from "./welcomeScene";
import { GameScene } from "./gameScene";
import { ScoreScene } from "./scoreScene";
import { ItemListScene } from "./itemListScene";
import { ItemSelectionScene } from "./itemSelectionScene";

const gameConfig: Phaser.Types.Core.GameConfig = {
    title: "Nie ma problemu",
    width: 1344,
    height: 720,
    parent: "game",
    scene: [WelcomeScene, GameScene, ScoreScene, ItemListScene, ItemSelectionScene],
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    },
    backgroundColor: "#000000"
};

export class NieMaProblemuGame extends Phaser.Game {
    constructor(config: Phaser.Types.Core.GameConfig) {
        super(config);
    }
}

window.onload = () => {
    let game = new NieMaProblemuGame(gameConfig);
};