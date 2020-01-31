import "phaser";
import { Majster } from './majster';

export class GameScene extends Phaser.Scene {
    private majster: Majster;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor() {
        super({
            key: "GameScene"
        });
    }

    init(): void {
        
    }

    preload(): void {
        this.load.image('majster', Majster.image)
    }

    create(): void {
        this.cursors = this.input.keyboard.createCursorKeys();

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

        this.majster = new Majster(this.physics.add.sprite(16,32,'majster'))
        this.majster.setPosition(160, 30);
    }

    update(): void {
        this.majster.move(this.cursors);
    }
};