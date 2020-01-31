import "phaser";

export class GameScene extends Phaser.Scene {

    constructor() {
        super({
            key: "GameScene"
        });
    }

    init(): void {
        
    }

    preload(): void {
        
    }

    create(): void {
        let graphics = this.add.graphics();

        let outerArea: Phaser.Geom.Rectangle = new Phaser.Geom.Rectangle(0, 0, 144, 576);
        let workshopArea: Phaser.Geom.Rectangle = new Phaser.Geom.Rectangle(144, 0, 736, 576);
        let itemsArea: Phaser.Geom.Rectangle = new Phaser.Geom.Rectangle(880, 0, 464, 720);
        let dialogArea: Phaser.Geom.Rectangle = new Phaser.Geom.Rectangle(0, 576, 880, 144);
        
        graphics.fillStyle(0x00ff00);
        graphics.fillRectShape(outerArea);

        graphics.fillStyle(0xffff00);
        graphics.fillRectShape(workshopArea);

        graphics.fillStyle(0x0000ff);
        graphics.fillRectShape(itemsArea);

        graphics.fillStyle(0x000000);
        graphics.fillRectShape(dialogArea);
    }

    update(): void {

    }
};