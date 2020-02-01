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
        this.loadRoomAssets();
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
        this.drawRoomInitial();
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

    loadRoomAssets(){
        this.load.image('wall-left-top-corner', 'images/wall/left-top-corner.png');
        this.load.image('wall-right-top-corner', 'images/wall/right-top-corner.png');
        this.load.image('wall-left', 'images/wall/left.png');
        this.load.image('wall-top', 'images/wall/top.png');
        this.load.image('wall-bottom', 'images/wall/bottom.png');
        this.load.image('wall-bottom-small', 'images/wall/bottom-small.png');
        this.load.image('wall-middle-right-corner', 'images/wall/middle-right-corner.png');

        this.load.image('wall-brick-center', 'images/wall/brick-center.png');
        this.load.image('wall-right-small', 'images/wall/right-small.png');
    }

    drawRoomInitial() {
        this.add.image(152, 8, "wall-left-top-corner");
        this.add.image(872, 8, "wall-right-top-corner");

        for (var i=168; i<=856; i+=16){
            this.add.image(i, 8, "wall-top");
        }

        for (var i=168; i<=856; i+=16){
            this.add.image(i, 20, "wall-bottom-small");
        }

        for (var i=179; i<=856; i+=16){
            this.add.image(i, 38, "wall-brick-center");
        }

        this.add.image(163, 20, "wall-middle-right-corner");
        
        for (var i=24; i<=344; i+=16){
            this.add.image(152, i, "wall-left");
        }

        for (var i=30; i<=344; i+=16){
            this.add.image(163, i, "wall-right-small");
        }  
    }
};