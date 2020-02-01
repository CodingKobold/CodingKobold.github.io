import "phaser";
import { Majster } from './majster';
import { Dialog } from "./dialog";

import { ItemType } from "./itemType.enum";
import { GameTime } from './gameTime';
import { GameWindowFocus } from "./gameWindowFocus.enum";

export class GameScene extends Phaser.Scene {
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

    // scene related
    private currentGameWindow: GameWindowFocus;

    // majster related
    private majster: Majster;
    private actionKey: Phaser.Input.Keyboard.Key;

    // graphics related
    private graphics: Phaser.GameObjects.Graphics;
    private walls: Phaser.Physics.Arcade.StaticGroup;

    // time related
    private remainingTimeText: Phaser.GameObjects.Text;
    private gameTime: GameTime;
    private gameDuration: number = 2*60*1000; // 2 min
    private gameOverEvent: Phaser.Time.TimerEvent;

    // dialog related
    private dialog: Dialog;
    private clientDialogText: Phaser.GameObjects.Text;
    private majsterDialogText: Phaser.GameObjects.Text;

    // score related
    private score: number = 100;

    constructor() {
        super({
            key: "GameScene"
        });
    }

    init(): void {
        this.graphics = this.add.graphics();
        this.currentGameWindow = GameWindowFocus.Majster;
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
        this.prepareTime();

        this.cursors = this.input.keyboard.createCursorKeys();
        this.actionKey = this.cursors.space;

        this.physics.add.collider(this.majster.majster, this.walls);
    }
    
    update(): void {
        this.updateTime();

        if (this.currentGameWindow === GameWindowFocus.Majster) {
            this.majster.move(this.cursors);

            if (Phaser.Input.Keyboard.JustUp(this.actionKey)) {
                this.loadRequest(ItemType.Boot);
            }
        }
        else if (this.currentGameWindow === GameWindowFocus.Dialog) {
            if (Phaser.Input.Keyboard.JustUp(this.actionKey)) {
                this.loadResponse();
                this.currentGameWindow = GameWindowFocus.Majster;
            }
        }
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

    private prepareTime() {
        this.gameTime = new GameTime();
        this.gameOverEvent = this.time.delayedCall(this.gameDuration, this.onGameOverEvent, [], this);

        this.add.text(900, 10,  "Czas do zamknięcia:", { font: '24px Consolas' });
        this.remainingTimeText = this.add.text(1150, 10, this.gameTime.getTime(),  { font: '24px Consolas Bold', fill: 'green' });
    }

    private prepareDialog() {
        this.dialog = new Dialog();
        this.clientDialogText = this.add.text(50, 606, "", { font: '24px Consolas', fill: '#FFFFFF' });
        this.majsterDialogText = this.add.text(50, 646, "", { font: '24px Consolas', fill: '#FFFF00' });
    }

    prepareMajster() {
        this.majster = new Majster(this.physics.add.sprite(16,32,'majster'))
        this.majster.setPosition(250, 100);
    }

    private loadRoomAssets() {
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
        this.load.image('floor-3', 'images/wall/floor-3.png');
        this.load.image('floor-4', 'images/wall/floor-4.png');
    }

    private drawRoomInitial() {
        this.walls = this.physics.add.staticGroup();

        var topStartPoint = 24;
        var bottomStopPoint = 480;
        var leftStartPoint = 168;
        var rightStopPoint = 856; //16 * x +12

        //podłoga
        for (var j = topStartPoint+53; j<= bottomStopPoint-10; j+=16){
            for (var i = leftStartPoint+22; i<=rightStopPoint-10; i+=16){
                var randNumber = Math.floor(Math.random() * 3) + 2;
                this.add.image(i, j, "floor-"+randNumber);
            }
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
        for (var j = 42 ;j<=90; j+=16){
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

    private updateTime(){
        this.gameTime.update(this.gameOverEvent.getProgress());
        this.remainingTimeText.setText(this.gameTime.getTime())
        
        let textColor = this.gameOverEvent.getProgress() < 0.5  
            ? 'green' 
            : this.gameOverEvent.getProgress() < 0.75 ? 'orange' : 'red';

        this.remainingTimeText.setColor(textColor);
    }

    onGameOverEvent(): void {
        this.scene.start('ScoreScene', { score: this.score });
    }

    private loadRequest(item: ItemType): void {
        this.currentGameWindow = GameWindowFocus.Dialog;
        let dialogLength = this.dialog.createRequest(item);
        this.time.addEvent({delay: 50, callback: this.updateRequest, callbackScope: this, repeat: dialogLength, args: [dialogLength] });
    }

    private updateRequest(dialogLength: number): void {
        this.dialog.nextLetter();
        this.clientDialogText.setText(this.dialog.text);

        if (this.clientDialogText.text.length === dialogLength) {
            this.time.addEvent({delay: 300, callback: this.showTakeAssignmentText, callbackScope: this });
        }
    }

    private showTakeAssignmentText(): void {
        this.majsterDialogText.setText("Przyjmij zlecenie");
    }

    private loadResponse() {
        let dialogLength = this.dialog.createResponse();
        this.time.addEvent({delay: 50, callback: this.updateResponse, callbackScope: this, repeat: dialogLength, args: [dialogLength] });
    }

    private updateResponse(): void {
        this.dialog.nextLetter();
        this.majsterDialogText.setText(this.dialog.text);
    }
};