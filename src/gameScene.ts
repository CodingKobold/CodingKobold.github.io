import "phaser";
import { Majster } from './majster';
import { Dialog } from "./dialog";

import { ItemType } from "./itemType.enum";

export class GameScene extends Phaser.Scene {
    private majster: Majster;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

    private dialog: Dialog;
    private dialogText: Phaser.GameObjects.Text;

    private graphics: Phaser.GameObjects.Graphics;

    private walls: Phaser.Physics.Arcade.StaticGroup;

    constructor() {
        super({
            key: "GameScene"
        });
    }

    init(): void {
        this.graphics = this.add.graphics();
    }

    preload(): void {         
        this.loadRoomAssets();
        this.load.image('majster', Majster.image);
    }

    create(): void {
        // TODO: Remove when not needed anymore
        this.prepareGameShapes();
        this.drawRoomInitial();
        this.prepareMajster();
        this.prepareDialog();

        this.cursors = this.input.keyboard.createCursorKeys();
        this.loadDialog();

        this.physics.add.collider(this.majster.majster, this.walls);
    }
    
    update(): void {
        this.majster.move(this.cursors);
    }

    private prepareGameShapes() {
        let outerArea: Phaser.Geom.Rectangle = new Phaser.Geom.Rectangle(0, 0, 144, 576);
        let workshopArea: Phaser.Geom.Rectangle = new Phaser.Geom.Rectangle(144, 0, 736, 576);
        let itemsArea: Phaser.Geom.Rectangle = new Phaser.Geom.Rectangle(880, 0, 464, 720);
        let dialogArea: Phaser.Geom.Rectangle = new Phaser.Geom.Rectangle(0, 576, 880, 144);
        
        this.graphics.fillStyle(0x00ff00);
        this.graphics.fillRectShape(outerArea);

        this.graphics.fillStyle(0xffff00);
        this.graphics.fillRectShape(workshopArea);

        this.graphics.fillStyle(0x0000ff);
        this.graphics.fillRectShape(itemsArea);

        this.graphics.fillStyle(0x000000);
        this.graphics.fillRectShape(dialogArea);
    }

    private prepareDialog() {
        this.dialog = new Dialog();
        this.dialog.create(ItemType.Boot);
        this.dialogText = this.add.text(50, 606, "", { font: '20px Consolas', fill: '#FFFFFF' });
    }

    prepareMajster() {
        this.majster = new Majster(this.physics.add.sprite(16,32,'majster'))
        this.majster.setPosition(250, 100);
    }

    private loadDialog() {
        this.time.addEvent({delay: 50, callback: this.updateDialog, callbackScope: this, repeat: 50});
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

        this.load.image('wall-window1', 'images/wall/window1.png');
        this.load.image('wall-door', 'images/wall/door.png');

        this.load.image('floor-1', 'images/wall/floor1.png');
        this.load.image('floor-2', 'images/wall/floor-2.png');
    }

    drawRoomInitial() {
        this.walls = this.physics.add.staticGroup();

        var topStartPoint = 24;
        var bottomStopPoint = 480;
        var leftStartPoint = 168;
        var rightStopPoint = 856; //16 * x +12

        //podłoga
        for (var i = leftStartPoint+22; i<=rightStopPoint-10; i+=16){
            this.add.image(i, topStartPoint+53, "floor-2");
        }
        

        //środkowy murek
        for (var i=leftStartPoint + 27; i<=rightStopPoint - 16; i += 16) {
            this.walls.create(i, topStartPoint + 30, "wall-brick-center");
        }  
        
        //górna ściana
        for (var i = leftStartPoint + 16; i <= rightStopPoint - 16; i += 16) {
            this.walls.create(i, topStartPoint, "wall-top");
        }

        for (var i = leftStartPoint + 22; i <= rightStopPoint - 8; i += 16) {
            this.walls.create(i, topStartPoint+12, "wall-bottom-small");
        }
 
        //lewa ściana
        for (var i=topStartPoint+8; i<=bottomStopPoint-16; i+=16){
            this.walls.create(leftStartPoint, i, "wall-left");
        }

        for (var i=topStartPoint+22; i<=bottomStopPoint-16; i+=16){
            this.walls.create(leftStartPoint+11, i, "wall-right-small");
        }  

        //prawa ściana
        for (var i=topStartPoint+16; i<=bottomStopPoint-32; i+=16){
            this.walls.create(rightStopPoint, i, "wall-brick-right-center");
        }

        for (var i=topStartPoint+16; i<=bottomStopPoint-40; i+=16){
            this.walls.create(rightStopPoint-11, i, "wall-right-small").setAngle(180);
        }

        //dolna ściana
        for (var i=leftStartPoint+16; i<=rightStopPoint-16; i+=16){
            if (i <= leftStartPoint+144 || i >= leftStartPoint + 272){
                this.walls.create(i, bottomStopPoint-24, "wall-top").setAngle(180);
                this.walls.create(i, bottomStopPoint-36, "wall-bottom-small").setAngle(180);
            }       
        }

        // //narożniki zewnętrzne i wewnętrzne
        this.walls.create(leftStartPoint+11, topStartPoint+12, "wall-middle-right-corner");
        this.walls.create(rightStopPoint-11, topStartPoint+12, "wall-middle-left-corner");
        this.walls.create(leftStartPoint+11, bottomStopPoint-36, "wall-middle-left-corner").setAngle(180);
        this.walls.create(rightStopPoint-11, bottomStopPoint-36, "wall-middle-right-corner").setAngle(180);

        this.walls.create(leftStartPoint, topStartPoint, "wall-left-top-corner");
        this.walls.create(rightStopPoint, topStartPoint, "wall-right-top-corner");
        this.walls.create(rightStopPoint, bottomStopPoint-24, "wall-left-top-corner").setAngle(180);
        this.walls.create(leftStartPoint, bottomStopPoint-24, "wall-right-top-corner").setAngle(180);

        //dolny murek
        this.walls.create(leftStartPoint, bottomStopPoint, "wall-brick-left");
        this.walls.create(rightStopPoint, bottomStopPoint, "wall-brick-right");

        for (var i=leftStartPoint+16; i<=rightStopPoint-16; i+=16){      
            if (i <= leftStartPoint+128 || i >= leftStartPoint + 272){
                this.walls.create(i, bottomStopPoint, "wall-brick-center");
            } 
        }

        //okna
        this.add.image(leftStartPoint+64, bottomStopPoint-4, "wall-window1");

        //wejście
        var doorStartPointTop = 539; //520
        var doorStartPointLeft = 300; 
        var doorAreaLenght = doorStartPointLeft + 128;

        //wejście-podłoga!!!
        for (var j = 48 ;j<=96; j+=16){
            for(var i = 16; i<=128; i+=16){
                this.add.image(doorStartPointLeft+i, doorStartPointTop-j, "floor-1");
            }
        }

        this.walls.create(doorStartPointLeft, doorStartPointTop, "wall-brick-left");
        this.walls.create(doorAreaLenght + 16, doorStartPointTop, "wall-brick-right");
        for (var i=doorStartPointLeft+16; i<=doorAreaLenght; i+=16 ){
            this.walls.create(i, doorStartPointTop, "wall-brick-center");
        }

        this.walls.create(doorStartPointLeft, doorStartPointTop-24, "wall-right-top-corner").setAngle(180);
        this.walls.create(doorAreaLenght+16, doorStartPointTop-24, "wall-left-top-corner").setAngle(180);

        for (var i=doorStartPointLeft+16; i<=doorAreaLenght; i+=16){
            this.walls.create(i, doorStartPointTop-24, "wall-top").setAngle(180);
            this.walls.create(i, doorStartPointTop-36, "wall-bottom-small").setAngle(180);
        }

        this.add.image(doorStartPointLeft + doorAreaLenght/6, doorStartPointTop-2, "wall-door");

        for (var i=40; i<=72; i+=16){
            this.walls.create(doorStartPointLeft, doorStartPointTop-i, "wall-brick-right-center").setAngle(180);
            this.walls.create(doorStartPointLeft+11, doorStartPointTop-i, "wall-right-small");

            this.walls.create(doorAreaLenght+16, doorStartPointTop-i, "wall-brick-right-center");
            this.walls.create(doorAreaLenght+5, doorStartPointTop-i, "wall-right-small").setAngle(180);
        }

        this.walls.create(doorStartPointLeft+11, doorStartPointTop-88, "wall-right-small");
        this.walls.create(doorAreaLenght+5, doorStartPointTop-88, "wall-right-small").setAngle(180);
        




    }
};