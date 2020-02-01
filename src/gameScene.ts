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
        this.load.image('wall-middle-left-corner', 'images/wall/middle-left-corner.png');

        this.load.image('wall-brick-center', 'images/wall/brick-center.png');
        this.load.image('wall-right-small', 'images/wall/right-small.png');
        this.load.image('wall-brick-left', 'images/wall/brick-left.png');
        this.load.image('wall-brick-right', 'images/wall/brick-right.png');
        this.load.image('wall-brick-right-center', 'images/wall/brick-right-center.png');
    }

    drawRoomInitial() {
        var topStartPoint = 32;
        var bottomStopPoint = 560;
        var leftStartPoint = 168;
        var rightStopPoint = 840; //16 * x +12

        this.add.image(leftStartPoint, topStartPoint, "wall-left-top-corner");
        this.add.image(rightStopPoint, topStartPoint, "wall-right-top-corner");

        for (var i=leftStartPoint+16; i<=rightStopPoint-16; i+=16){
            this.add.image(i, topStartPoint, "wall-top");
        }

        for (var i=leftStartPoint+16; i<=rightStopPoint-16; i+=16){
            this.add.image(i, topStartPoint+12, "wall-bottom-small");
        }

        for (var i=leftStartPoint+27; i<=rightStopPoint-16; i+=16){
            this.add.image(i, topStartPoint+30, "wall-brick-center");
        }        
        
        for (var i=topStartPoint+8; i<=bottomStopPoint-16; i+=16){
            this.add.image(leftStartPoint, i, "wall-left");
        }

        for (var i=topStartPoint+22; i<=bottomStopPoint-16; i+=16){
            this.add.image(leftStartPoint+11, i, "wall-right-small");
        }  

        this.add.image(leftStartPoint, bottomStopPoint, "wall-brick-left");
        this.add.image(leftStartPoint, bottomStopPoint-24, "wall-right-top-corner").setAngle(180);

        for (var i=leftStartPoint+16; i<=rightStopPoint-16; i+=16){
            this.add.image(i, bottomStopPoint-24, "wall-top").setAngle(180);
        } 

        for (var i=leftStartPoint+16; i<=rightStopPoint-16; i+=16){
            this.add.image(i, bottomStopPoint, "wall-brick-center");
        } 

        this.add.image(rightStopPoint, bottomStopPoint, "wall-brick-right");

        this.add.image(rightStopPoint, bottomStopPoint-24, "wall-left-top-corner").setAngle(180);

        for (var i=topStartPoint+16; i<=bottomStopPoint-32; i+=16){
            this.add.image(rightStopPoint, i, "wall-brick-right-center");
        }
    
        for (var i=topStartPoint+16; i<=bottomStopPoint-32; i+=16){
            this.add.image(rightStopPoint-11, i, "wall-right-small").setAngle(180);
        }

        this.add.image(leftStartPoint+11, topStartPoint+12, "wall-middle-right-corner");
        this.add.image(rightStopPoint-11, topStartPoint+12, "wall-middle-left-corner");
    }
};