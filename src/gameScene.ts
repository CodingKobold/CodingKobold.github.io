import "phaser";
import { Majster } from './majster';
import { Dialog } from "./dialog";

import { ItemType } from "./itemType.enum";

export class GameScene extends Phaser.Scene {
    private majster: Majster;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

    private dialog: Dialog;
    private dialogText: Phaser.GameObjects.Text;

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

        this.dialog = new Dialog();
        this.dialog.create(ItemType.Boot);

        this.dialogText = this.add.text(50, 600, "", { font: '20px Consolas', fill: '#FFFFFF' });

        this.loadDialog();
    }

    update(): void {
        this.majster.move(this.cursors);
    }

    private loadDialog() {
        this.time.addEvent({delay: 50, callback: this.updateDialog, callbackScope: this, repeat: 20});
    }

    private updateDialog() {
        this.dialog.nextLetter();
        this.dialogText.setText(this.dialog.text);
    }
};